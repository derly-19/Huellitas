import * as AdoptionRequestsModel from "../models/adoptionRequestsModel.js";
import { getPetById, updatePetAvailability } from "../models/petsModel.js";
import { createNotification } from "../models/notificationsModel.js";
import { 
  sendAdoptionRequestEmail, 
  sendAdoptionApprovedEmail, 
  sendAdoptionRejectedEmail,
  sendContactedNotificationEmail
} from "../services/emailService.js";

// Crear una nueva solicitud de adopción
export const createRequest = async (req, res) => {
  try {
    const {
      pet_id,
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      tipo_vivienda,
      tiene_mascotas,
      motivacion,
      user_id
    } = req.body;

    // Validar campos requeridos
    const camposFaltantes = [];
    if (!pet_id) camposFaltantes.push('pet_id');
    if (!nombre) camposFaltantes.push('nombre');
    if (!apellido) camposFaltantes.push('apellido');
    if (!correo) camposFaltantes.push('correo');
    if (!telefono) camposFaltantes.push('telefono');
    if (!direccion) camposFaltantes.push('direccion');
    if (!tipo_vivienda) camposFaltantes.push('tipo_vivienda');
    if (!motivacion) camposFaltantes.push('motivacion');
    
    if (camposFaltantes.length > 0) {
      console.log('❌ Campos faltantes:', camposFaltantes);
      console.log('📦 Datos recibidos:', req.body);
      return res.status(400).json({
        success: false,
        message: `Faltan los siguientes campos: ${camposFaltantes.join(', ')}`
      });
    }

    // Obtener información de la mascota
    const pet = await getPetById(pet_id);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Mascota no encontrada"
      });
    }

    console.log('🐾 Mascota encontrada:', pet);

    // Verificar que la mascota esté disponible
    if (pet.available === 0) {
      return res.status(400).json({
        success: false,
        message: "Esta mascota ya no está disponible para adopción"
      });
    }

    // Verificar que la mascota tenga una fundación asignada
    if (!pet.foundation_id) {
      console.error('❌ La mascota no tiene foundation_id asignado');
      return res.status(400).json({
        success: false,
        message: "Esta mascota no está asociada a ninguna fundación. Por favor contacta al administrador."
      });
    }

    // Verificar si ya existe una solicitud pendiente del mismo usuario para esta mascota
    if (user_id) {
      const existingRequest = await AdoptionRequestsModel.checkExistingRequest(user_id, pet_id);
      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: "Ya tienes una solicitud pendiente para esta mascota"
        });
      }
    }

    // Crear la solicitud
    const requestData = {
      pet_id,
      pet_name: pet.name,
      pet_type: pet.type,
      foundation_id: pet.foundation_id,
      foundation_name: pet.foundation,
      user_id,
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      tipo_vivienda,
      tiene_mascotas: tiene_mascotas || "No especificado",
      motivacion
    };

    const result = await AdoptionRequestsModel.createAdoptionRequest(requestData);

    // Enviar email de confirmación
    try {
      await sendAdoptionRequestEmail({
        adoptedByEmail: correo,
        adoptedByName: nombre,
        petName: pet.name,
        foundationName: pet.foundation
      });
      console.log(`📧 Email de solicitud enviado a ${correo}`);
    } catch (emailError) {
      console.error('Error enviando email de solicitud:', emailError);
      // No fallar la operación si falla el email
    }

    res.status(201).json({
      success: true,
      message: "Solicitud de adopción enviada exitosamente",
      data: { id: result.lastID }
    });

  } catch (error) {
    console.error("Error creating adoption request:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud de adopción"
    });
  }
};

// Obtener todas las solicitudes de una fundación
export const getFoundationRequests = async (req, res) => {
  try {
    const { foundationId } = req.params;
    const { status } = req.query;

    console.log(`🔍 Obteniendo solicitudes para fundación ${foundationId}, status: ${status || 'all'}`);

    let requests;
    if (status && status !== 'all') {
      requests = await AdoptionRequestsModel.getRequestsByStatus(foundationId, status);
    } else {
      requests = await AdoptionRequestsModel.getRequestsByFoundation(foundationId);
    }

    console.log(`✅ Encontradas ${requests.length} solicitudes`);

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error("❌ Error fetching foundation requests:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error al obtener las solicitudes",
      error: error.message
    });
  }
};

// Obtener estadísticas de solicitudes de una fundación
export const getFoundationRequestStats = async (req, res) => {
  try {
    const { foundationId } = req.params;
    console.log(`📊 Obteniendo estadísticas para fundación ${foundationId}`);
    
    const counts = await AdoptionRequestsModel.countRequestsByFoundation(foundationId);
    
    console.log(`✅ Estadísticas obtenidas:`, counts);

    res.json({
      success: true,
      data: counts
    });

  } catch (error) {
    console.error("❌ Error fetching request stats:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
};

// Obtener detalle de una solicitud
export const getRequestDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await AdoptionRequestsModel.getRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada"
      });
    }

    res.json({
      success: true,
      data: request
    });

  } catch (error) {
    console.error("Error fetching request detail:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el detalle de la solicitud"
    });
  }
};

// Actualizar estado de una solicitud (aprobar/rechazar)
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Validar estado
    const validStatuses = ['pending', 'approved', 'rejected', 'contacted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Estado no válido"
      });
    }

    // Obtener la solicitud actual
    const request = await AdoptionRequestsModel.getRequestById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada"
      });
    }

    // Actualizar estado
    await AdoptionRequestsModel.updateRequestStatus(id, status, notes);

    // Crear notificación para el usuario
    if (request.user_id) {
      let notificationTitle = '';
      let notificationMessage = '';
      
      if (status === 'approved') {
        notificationTitle = '¡Solicitud Aprobada! 🎉';
        notificationMessage = `Tu solicitud para adoptar a ${request.pet_name} ha sido aprobada. La fundación se pondrá en contacto contigo pronto.`;
      } else if (status === 'rejected') {
        notificationTitle = 'Solicitud Rechazada';
        notificationMessage = `Lamentablemente, tu solicitud para adoptar a ${request.pet_name} no fue aprobada. ${notes || 'Puedes buscar otras mascotas disponibles.'}`;
      } else if (status === 'contacted') {
        notificationTitle = 'Te hemos contactado';
        notificationMessage = `La fundación ${request.foundation_name} se ha puesto en contacto contigo sobre ${request.pet_name}.`;
      }
      
      if (notificationTitle) {
        try {
          await createNotification({
            user_id: request.user_id,
            type: status,
            title: notificationTitle,
            message: notificationMessage,
            request_id: id,
            pet_name: request.pet_name,
            email_address: request.correo
          });
          console.log(`📧 Notificación creada para usuario ${request.user_id}`);
          
          // Enviar email también
          console.log(`📬 Preparando envío de email para status: ${status} a ${request.correo}`);
          
          if (status === 'approved') {
            console.log('✉️ Enviando email de aprobación...');
            const emailResult = await sendAdoptionApprovedEmail({
              adoptedByEmail: request.correo,
              adoptedByName: request.nombre,
              petName: request.pet_name,
              foundationName: request.foundation_name,
              appUrl: process.env.APP_URL || 'http://localhost:3000'
            });
            console.log('✅ Email de aprobación enviado:', emailResult);
          } else if (status === 'rejected') {
            console.log('✉️ Enviando email de rechazo...');
            const emailResult = await sendAdoptionRejectedEmail({
              adoptedByEmail: request.correo,
              adoptedByName: request.nombre,
              petName: request.pet_name,
              foundationName: request.foundation_name,
              reason: notes || null
            });
            console.log('✅ Email de rechazo enviado:', emailResult);
          } else if (status === 'contacted') {
            console.log('✉️ Enviando email de contacto...');
            const emailResult = await sendContactedNotificationEmail({
              adoptedByEmail: request.correo,
              adoptedByName: request.nombre,
              petName: request.pet_name,
              foundationName: request.foundation_name,
              message: notes || null
            });
            console.log('✅ Email de contacto enviado:', emailResult);
          }
          
        } catch (notifError) {
          console.error('❌ Error creando notificación o enviando email:', notifError);
          console.error('❌ Stack trace completo:', notifError.stack);
          // No fallar la operación si falla la notificación
        }
      }
    }

    // Si se aprueba la solicitud, marcar la mascota como no disponible
    if (status === 'approved') {
      await updatePetAvailability(request.pet_id, false);
      
      // Rechazar automáticamente otras solicitudes pendientes para la misma mascota
      const otherRequests = await AdoptionRequestsModel.getRequestsByPet(request.pet_id);
      for (const otherReq of otherRequests) {
        if (otherReq.id !== parseInt(id) && otherReq.status === 'pending') {
          await AdoptionRequestsModel.updateRequestStatus(
            otherReq.id, 
            'rejected', 
            'La mascota fue adoptada por otro solicitante'
          );
          
          // Notificar a los otros solicitantes
          if (otherReq.user_id) {
            try {
              await createNotification({
                user_id: otherReq.user_id,
                type: 'rejected',
                title: 'Solicitud Rechazada',
                message: `Lamentablemente, ${request.pet_name} ya fue adoptado por otra persona. Te invitamos a ver otras mascotas disponibles.`,
                request_id: otherReq.id,
                pet_name: request.pet_name
              });
            } catch (notifError) {
              console.error('Error creando notificación:', notifError);
            }
          }
        }
      }
    }

    res.json({
      success: true,
      message: `Solicitud ${status === 'approved' ? 'aprobada' : status === 'rejected' ? 'rechazada' : 'actualizada'} exitosamente`
    });

  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la solicitud"
    });
  }
};

// Eliminar una solicitud
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await AdoptionRequestsModel.getRequestById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada"
      });
    }

    await AdoptionRequestsModel.deleteRequest(id);

    res.json({
      success: true,
      message: "Solicitud eliminada exitosamente"
    });

  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la solicitud"
    });
  }
};

// Obtener solicitudes por mascota
export const getPetRequests = async (req, res) => {
  try {
    const { petId } = req.params;
    const requests = await AdoptionRequestsModel.getRequestsByPet(petId);

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error("Error fetching pet requests:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las solicitudes de esta mascota"
    });
  }
};

// Obtener solicitudes de un usuario
export const getUserRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario requerido"
      });
    }

    console.log(`📋 Obteniendo solicitudes para usuario ${userId}`);
    
    const requests = await AdoptionRequestsModel.getRequestsByUser(userId);

    console.log(`✅ Se encontraron ${requests?.length || 0} solicitudes`);

    res.json({
      success: true,
      data: requests || []
    });

  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener tus solicitudes",
      error: error.message
    });
  }
};

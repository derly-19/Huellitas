import * as AdoptionRequestsModel from "../models/adoptionRequestsModel.js";
import { getPetById, updatePetAvailability } from "../models/petsModel.js";

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
    if (!pet_id || !nombre || !apellido || !correo || !telefono || !direccion || !tipo_vivienda || !motivacion) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos requeridos deben ser completados"
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

    // Verificar que la mascota esté disponible
    if (pet.available === 0) {
      return res.status(400).json({
        success: false,
        message: "Esta mascota ya no está disponible para adopción"
      });
    }

    // Verificar si ya existe una solicitud pendiente del mismo usuario para esta mascota
    const existingRequest = await AdoptionRequestsModel.checkExistingRequest(user_id, pet_id);
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Ya tienes una solicitud pendiente para esta mascota"
      });
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

    let requests;
    if (status && status !== 'all') {
      requests = await AdoptionRequestsModel.getRequestsByStatus(foundationId, status);
    } else {
      requests = await AdoptionRequestsModel.getRequestsByFoundation(foundationId);
    }

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error("Error fetching foundation requests:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las solicitudes"
    });
  }
};

// Obtener estadísticas de solicitudes de una fundación
export const getFoundationRequestStats = async (req, res) => {
  try {
    const { foundationId } = req.params;
    const counts = await AdoptionRequestsModel.countRequestsByFoundation(foundationId);

    res.json({
      success: true,
      data: counts
    });

  } catch (error) {
    console.error("Error fetching request stats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas"
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
    const requests = await AdoptionRequestsModel.getRequestsByUser(userId);

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener tus solicitudes"
    });
  }
};

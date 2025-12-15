import * as VisitsModel from "../models/visitsModel.js";
import { createNotification } from "../models/notificationsModel.js";
import { sendFollowUpVisitEmail, sendEmail } from "../services/emailService.js";

// Crear visita
export async function createVisit(req, res) {
  try {
    const { adoption_request_id, pet_id, foundation_id, scheduled_date, scheduled_time, visit_type, notes, pet_name } = req.body;
    const user_id = req.user?.id || req.body.user_id;

    if (!adoption_request_id || !pet_id || !foundation_id || !scheduled_date) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos"
      });
    }

    const visitData = {
      adoption_request_id,
      pet_id,
      user_id,
      foundation_id,
      scheduled_date,
      scheduled_time,
      visit_type: visit_type || 'presencial',
      notes
    };

    const result = await VisitsModel.createVisit(visitData);

    // Notificar a la fundación
    try {
      await createNotification({
        user_id: foundation_id,
        type: 'info',
        title: 'Nueva Visita Programada',
        message: `Se ha programado una visita para ${pet_name || 'una mascota'} el ${scheduled_date}`,
        request_id: adoption_request_id,
        pet_name: pet_name
      });
      
      // Enviar email de confirmación de visita programada
      const visitDateTime = scheduled_time ? `${scheduled_date} a las ${scheduled_time}` : scheduled_date;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
            <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
            <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #2c3e50;">📅 Visita de Seguimiento Confirmada</h2>
            
            <p>La fundación ha programado una visita de seguimiento para verificar que todo va bien.</p>
            
            <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 Fecha y Hora:</strong> ${visitDateTime}</p>
              <p style="margin: 5px 0;"><strong>🐾 Mascota:</strong> ${pet_name || 'N/A'}</p>
              <p style="margin: 5px 0;"><strong>📝 Tipo de Visita:</strong> ${visit_type || 'Presencial'}</p>
              ${notes ? `<p style="margin: 5px 0;"><strong>📌 Notas:</strong> ${notes}</p>` : ''}
            </div>
            
            <p>Por favor asegúrate de estar disponible en la fecha y hora programada.</p>
            
            <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
              Este es un email automático, por favor no responder.
            </p>
          </div>
        </div>
      `;
      
      await sendEmail(
        process.env.EMAIL_USER,
        `Visita de Seguimiento Programada - ${pet_name || 'Mascota'}`,
        htmlContent
      );
      
    } catch (notifError) {
      console.error('Error creando notificación o enviando email:', notifError);
    }

    res.status(201).json({
      success: true,
      message: "Visita programada exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error creating visit:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Obtener visitas del usuario
export async function getUserVisits(req, res) {
  try {
    const userId = req.params.userId;
    const visits = await VisitsModel.getUserVisits(userId);

    res.json({
      success: true,
      data: visits
    });
  } catch (error) {
    console.error("Error getting user visits:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Obtener visitas de la fundación
export async function getFoundationVisits(req, res) {
  try {
    const foundationId = req.params.foundationId;
    const visits = await VisitsModel.getFoundationVisits(foundationId);

    res.json({
      success: true,
      data: visits
    });
  } catch (error) {
    console.error("Error getting foundation visits:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Obtener próximas visitas
export async function getUpcomingVisits(req, res) {
  try {
    const foundationId = req.params.foundationId;
    const days = parseInt(req.query.days) || 7;
    const visits = await VisitsModel.getUpcomingVisits(foundationId, days);

    res.json({
      success: true,
      data: visits
    });
  } catch (error) {
    console.error("Error getting upcoming visits:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Actualizar estado de visita
export async function updateVisitStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Estado requerido"
      });
    }

    const result = await VisitsModel.updateVisitStatus(id, status, notes);

    res.json({
      success: true,
      message: "Estado de visita actualizado",
      data: result
    });
  } catch (error) {
    console.error("Error updating visit status:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Reprogramar visita
export async function rescheduleVisit(req, res) {
  try {
    const { id } = req.params;
    const { scheduled_date, scheduled_time, meeting_link } = req.body;

    if (!scheduled_date) {
      return res.status(400).json({
        success: false,
        message: "Nueva fecha requerida"
      });
    }

    const result = await VisitsModel.rescheduleVisit(id, scheduled_date, scheduled_time, meeting_link);

    res.json({
      success: true,
      message: "Visita reprogramada exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error rescheduling visit:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Sugerir cambio de fecha (adoptante)
export async function suggestReschedule(req, res) {
  try {
    const { id } = req.params;
    const { suggested_date, suggested_time, reason } = req.body;

    if (!suggested_date) {
      return res.status(400).json({
        success: false,
        message: "Fecha sugerida requerida"
      });
    }

    const result = await VisitsModel.suggestReschedule(id, suggested_date, suggested_time, reason);

    res.json({
      success: true,
      message: "Sugerencia de cambio enviada",
      data: result
    });
  } catch (error) {
    console.error("Error suggesting reschedule:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Aceptar visita (adoptante)
export async function acceptVisit(req, res) {
  try {
    const { id } = req.params;
    const result = await VisitsModel.acceptVisit(id);

    res.json({
      success: true,
      message: "Visita aceptada",
      data: result
    });
  } catch (error) {
    console.error("Error accepting visit:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Eliminar visita
export async function deleteVisit(req, res) {
  try {
    const { id } = req.params;
    await VisitsModel.deleteVisit(id);

    res.json({
      success: true,
      message: "Visita eliminada"
    });
  } catch (error) {
    console.error("Error deleting visit:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

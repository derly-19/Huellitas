import * as VisitsModel from "../models/visitsModel.js";
import { createNotification } from "../models/notificationsModel.js";

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
    } catch (notifError) {
      console.error('Error creando notificación:', notifError);
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
    const { scheduled_date, scheduled_time } = req.body;

    if (!scheduled_date) {
      return res.status(400).json({
        success: false,
        message: "Nueva fecha requerida"
      });
    }

    const result = await VisitsModel.rescheduleVisit(id, scheduled_date, scheduled_time);

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

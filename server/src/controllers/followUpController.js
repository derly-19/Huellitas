import * as FollowUpModel from "../models/followUpModel.js";
import { createNotification } from "../models/notificationsModel.js";

// Crear seguimiento
export async function createFollowUp(req, res) {
  try {
    const { adoption_request_id, pet_id, foundation_id } = req.body;
    const user_id = req.user?.id || req.body.user_id;

    if (!adoption_request_id || !user_id || !pet_id || !foundation_id) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos"
      });
    }

    const followUpData = {
      adoption_request_id,
      user_id,
      pet_id,
      foundation_id,
      follow_up_date: req.body.follow_up_date || new Date().toISOString().split('T')[0],
      health_status: req.body.health_status || 'excelente',
      behavior_status: req.body.behavior_status || 'adaptado',
      environment_description: req.body.environment_description,
      feeding_notes: req.body.feeding_notes,
      medical_visits: req.body.medical_visits || 0,
      problems_encountered: req.body.problems_encountered,
      overall_satisfaction: req.body.overall_satisfaction || 5,
      additional_notes: req.body.additional_notes,
      photos: req.body.photos
    };

    const result = await FollowUpModel.createFollowUp(followUpData);

    // Notificar a la fundación
    try {
      await createNotification({
        user_id: foundation_id,
        type: 'info',
        title: 'Nuevo Seguimiento Post-Adopción',
        message: `Ha recibido un nuevo seguimiento de ${req.body.pet_name || 'una mascota'}`,
        request_id: adoption_request_id,
        pet_name: req.body.pet_name
      });
    } catch (notifError) {
      console.error('Error creando notificación:', notifError);
    }

    res.status(201).json({
      success: true,
      message: "Seguimiento registrado exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error creating follow-up:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Obtener seguimientos del usuario
export async function getUserFollowUps(req, res) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Usuario ID requerido"
      });
    }

    const followUps = await FollowUpModel.getUserFollowUps(userId);

    res.json({
      success: true,
      data: followUps
    });
  } catch (error) {
    console.error("Error getting user follow-ups:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Obtener seguimientos de la fundación
export async function getFoundationFollowUps(req, res) {
  try {
    const foundationId = req.params.foundationId;

    if (!foundationId) {
      return res.status(400).json({
        success: false,
        message: "Foundation ID requerido"
      });
    }

    const followUps = await FollowUpModel.getFoundationFollowUps(foundationId);

    res.json({
      success: true,
      data: followUps
    });
  } catch (error) {
    console.error("Error getting foundation follow-ups:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Obtener seguimiento por ID
export async function getFollowUpDetail(req, res) {
  try {
    const { id } = req.params;

    const followUp = await FollowUpModel.getFollowUpById(id);

    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: "Seguimiento no encontrado"
      });
    }

    // Parsear fotos si existen
    if (followUp.photos) {
      try {
        followUp.photos = JSON.parse(followUp.photos);
      } catch (e) {
        followUp.photos = [];
      }
    }

    res.json({
      success: true,
      data: followUp
    });
  } catch (error) {
    console.error("Error getting follow-up detail:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Actualizar seguimiento
export async function updateFollowUp(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.user_id;

    // Verificar que el seguimiento pertenece al usuario
    const followUp = await FollowUpModel.getFollowUpById(id);
    if (!followUp || followUp.user_id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para editar este seguimiento"
      });
    }

    // Verificar que no haya sido revisado
    if (followUp.reviewed === 1) {
      return res.status(400).json({
        success: false,
        message: "No puedes editar un seguimiento que ya fue revisado"
      });
    }

    const followUpData = {
      health_status: req.body.health_status || followUp.health_status,
      behavior_status: req.body.behavior_status || followUp.behavior_status,
      environment_description: req.body.environment_description,
      feeding_notes: req.body.feeding_notes,
      medical_visits: req.body.medical_visits,
      problems_encountered: req.body.problems_encountered,
      overall_satisfaction: req.body.overall_satisfaction,
      additional_notes: req.body.additional_notes,
      photos: req.body.photos
    };

    const result = await FollowUpModel.updateFollowUp(id, followUpData);

    res.json({
      success: true,
      message: "Seguimiento actualizado exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error updating follow-up:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Agregar feedback de fundación
export async function addFoundationFeedback(req, res) {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback requerido"
      });
    }

    await FollowUpModel.addFoundationFeedback(id, feedback);

    // Notificar al usuario
    const followUp = await FollowUpModel.getFollowUpById(id);
    try {
      await createNotification({
        user_id: followUp.user_id,
        type: 'info',
        title: 'Feedback en tu Seguimiento',
        message: `La fundación ha revisado tu seguimiento de ${followUp.pet_name}`,
        request_id: followUp.adoption_request_id,
        pet_name: followUp.pet_name
      });
    } catch (notifError) {
      console.error('Error creando notificación:', notifError);
    }

    res.json({
      success: true,
      message: "Feedback agregado exitosamente"
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Obtener seguimientos pendientes
export async function getPendingFollowUps(req, res) {
  try {
    const { foundationId } = req.params;

    const followUps = await FollowUpModel.getPendingFollowUps(foundationId);

    res.json({
      success: true,
      data: followUps,
      count: followUps.length
    });
  } catch (error) {
    console.error("Error getting pending follow-ups:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Obtener estadísticas
export async function getFollowUpStats(req, res) {
  try {
    const { foundationId } = req.params;

    const stats = await FollowUpModel.getFoundationFollowUpStats(foundationId);

    res.json({
      success: true,
      data: {
        total_follow_ups: stats.total_follow_ups || 0,
        avg_satisfaction: (stats.avg_satisfaction || 0).toFixed(1),
        excellent_health: stats.excellent_health || 0,
        well_adapted: stats.well_adapted || 0,
        with_problems: stats.with_problems || 0
      }
    });
  } catch (error) {
    console.error("Error getting follow-up stats:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Eliminar seguimiento
export async function deleteFollowUp(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.user_id;

    // Verificar que el seguimiento pertenece al usuario
    const followUp = await FollowUpModel.getFollowUpById(id);
    if (!followUp || followUp.user_id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar este seguimiento"
      });
    }

    await FollowUpModel.deleteFollowUp(id);

    res.json({
      success: true,
      message: "Seguimiento eliminado exitosamente"
    });
  } catch (error) {
    console.error("Error deleting follow-up:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

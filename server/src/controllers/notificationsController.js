import * as NotificationsModel from "../models/notificationsModel.js";

// Obtener notificaciones de un usuario
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    const notifications = await NotificationsModel.getUserNotifications(
      userId, 
      limit ? parseInt(limit) : 50
    );

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las notificaciones"
    });
  }
};

// Obtener notificaciones no leídas
export const getUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notifications = await NotificationsModel.getUnreadNotifications(userId);

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las notificaciones"
    });
  }
};

// Contar notificaciones no leídas
export const countUnread = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await NotificationsModel.countUnreadNotifications(userId);

    res.json({
      success: true,
      count: count
    });

  } catch (error) {
    console.error("Error counting unread notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error al contar las notificaciones"
    });
  }
};

// Marcar notificación como leída
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    await NotificationsModel.markAsRead(id);

    res.json({
      success: true,
      message: "Notificación marcada como leída"
    });

  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la notificación"
    });
  }
};

// Marcar todas como leídas
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await NotificationsModel.markAllAsRead(userId);

    res.json({
      success: true,
      message: "Todas las notificaciones marcadas como leídas"
    });

  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar las notificaciones"
    });
  }
};

// Eliminar notificación
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    await NotificationsModel.deleteNotification(id);

    res.json({
      success: true,
      message: "Notificación eliminada"
    });

  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la notificación"
    });
  }
};

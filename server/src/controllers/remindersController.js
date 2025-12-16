import { 
  getUnreadReminders, 
  markReminderAsRead, 
  markAllRemindersAsRead,
  getUserReminderSettings,
  updateReminderSettings,
  runDailyReminderCheck
} from '../services/reminderService.js';

// Obtener recordatorios no leídos del usuario
export const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await getUnreadReminders(userId);
    
    res.json({
      success: true,
      reminders,
      count: reminders.length
    });
  } catch (error) {
    console.error('Error al obtener recordatorios:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los recordatorios' 
    });
  }
};

// Marcar un recordatorio como leído
export const markAsRead = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.id;
    
    const success = await markReminderAsRead(reminderId, userId);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Recordatorio marcado como leído' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Recordatorio no encontrado' 
      });
    }
  } catch (error) {
    console.error('Error al marcar recordatorio:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al marcar el recordatorio' 
    });
  }
};

// Marcar todos los recordatorios como leídos
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await markAllRemindersAsRead(userId);
    
    res.json({ 
      success: true, 
      message: `${count} recordatorios marcados como leídos` 
    });
  } catch (error) {
    console.error('Error al marcar todos los recordatorios:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al marcar los recordatorios' 
    });
  }
};

// Obtener configuración de recordatorios
export const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await getUserReminderSettings(userId);
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la configuración' 
    });
  }
};

// Actualizar configuración de recordatorios
export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      email_notifications, 
      vaccine_days_before, 
      deworming_days_before, 
      bath_frequency_days,
      medication_days_before 
    } = req.body;
    
    const settings = await updateReminderSettings(userId, {
      email_notifications,
      vaccine_days_before,
      deworming_days_before,
      bath_frequency_days,
      medication_days_before
    });
    
    res.json({
      success: true,
      message: 'Configuración actualizada',
      settings
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar la configuración' 
    });
  }
};

// Ejecutar verificación manual (para testing o admin)
export const triggerReminderCheck = async (req, res) => {
  try {
    console.log('🔄 Ejecutando verificación manual de recordatorios...');
    await runDailyReminderCheck();
    
    res.json({
      success: true,
      message: 'Verificación de recordatorios ejecutada'
    });
  } catch (error) {
    console.error('Error al ejecutar verificación:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al ejecutar la verificación' 
    });
  }
};

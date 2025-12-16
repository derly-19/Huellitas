import { db } from "../db/database.js";
import { sendReminderEmail } from "./emailService.js";

/**
 * Servicio de Recordatorios para Carnet de Mascotas
 * Verifica fechas próximas y genera notificaciones automáticas
 */

// Tipos de recordatorio
export const REMINDER_TYPES = {
  VACCINE: 'vaccine',
  DEWORMING: 'deworming',
  BATH: 'bath',
  MEDICATION: 'medication'
};

// Configuración por defecto de días antes para cada tipo
const DEFAULT_REMINDER_DAYS = {
  vaccine: [7, 3, 1],      // 7, 3 y 1 día antes
  deworming: [5, 1],       // 5 y 1 día antes
  bath: [3],               // 3 días antes (basado en frecuencia)
  medication: [3, 1]       // 3 y 1 día antes
};

/**
 * Obtener todas las mascotas adoptadas con sus dueños
 */
async function getAdoptedPetsWithOwners() {
  try {
    const pets = await db.all(`
      SELECT 
        p.id as pet_id,
        p.name as pet_name,
        p.type as pet_type,
        ar.user_id,
        u.username,
        u.email,
        c.id as carnet_id
      FROM pets p
      INNER JOIN adoption_requests ar ON p.id = ar.pet_id
      INNER JOIN users u ON ar.user_id = u.id
      INNER JOIN carnet c ON p.id = c.pet_id
      WHERE ar.status = 'approved' AND p.available = 0
    `);
    return pets;
  } catch (error) {
    console.error("Error obteniendo mascotas adoptadas:", error);
    return [];
  }
}

/**
 * Verificar próximas vacunas
 */
async function checkUpcomingVaccines(carnetId, daysAhead = 7) {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    const vaccines = await db.all(`
      SELECT * FROM carnet_vacunas 
      WHERE carnet_id = ? 
        AND proxima_dosis IS NOT NULL 
        AND proxima_dosis >= date('now')
        AND proxima_dosis <= date('now', '+' || ? || ' days')
      ORDER BY proxima_dosis ASC
    `, [carnetId, daysAhead]);

    return vaccines;
  } catch (error) {
    console.error("Error verificando vacunas:", error);
    return [];
  }
}

/**
 * Verificar próximas desparasitaciones
 */
async function checkUpcomingDewormings(carnetId, daysAhead = 5) {
  try {
    const dewormings = await db.all(`
      SELECT * FROM carnet_desparasitaciones 
      WHERE carnet_id = ? 
        AND proxima_dosis IS NOT NULL 
        AND proxima_dosis >= date('now')
        AND proxima_dosis <= date('now', '+' || ? || ' days')
      ORDER BY proxima_dosis ASC
    `, [carnetId, daysAhead]);

    return dewormings;
  } catch (error) {
    console.error("Error verificando desparasitaciones:", error);
    return [];
  }
}

/**
 * Verificar si es hora de un baño (cada X días)
 */
async function checkBathReminder(carnetId, frequencyDays = 30) {
  try {
    const lastBath = await db.get(`
      SELECT * FROM carnet_banos 
      WHERE carnet_id = ? 
      ORDER BY fecha DESC 
      LIMIT 1
    `, [carnetId]);

    if (!lastBath) {
      return null;
    }

    const lastBathDate = new Date(lastBath.fecha);
    const today = new Date();
    const daysSinceLastBath = Math.floor((today - lastBathDate) / (1000 * 60 * 60 * 24));
    const daysUntilNextBath = frequencyDays - daysSinceLastBath;

    if (daysUntilNextBath <= 3 && daysUntilNextBath >= 0) {
      return {
        ...lastBath,
        days_since: daysSinceLastBath,
        days_until: daysUntilNextBath
      };
    }

    return null;
  } catch (error) {
    console.error("Error verificando baños:", error);
    return null;
  }
}

/**
 * Verificar medicamentos por terminar
 */
async function checkMedicationsEnding(carnetId, daysAhead = 3) {
  try {
    const medications = await db.all(`
      SELECT * FROM carnet_medicamentos 
      WHERE carnet_id = ? 
        AND fecha_fin IS NOT NULL 
        AND fecha_fin >= date('now')
        AND fecha_fin <= date('now', '+' || ? || ' days')
      ORDER BY fecha_fin ASC
    `, [carnetId, daysAhead]);

    return medications;
  } catch (error) {
    console.error("Error verificando medicamentos:", error);
    return [];
  }
}

/**
 * Calcular días restantes
 */
function getDaysRemaining(dateString) {
  const targetDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  return Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
}

/**
 * Crear recordatorio en la base de datos
 */
async function createReminder(data) {
  try {
    const { pet_id, user_id, type, title, message, due_date, days_before } = data;

    // Verificar si ya existe un recordatorio similar
    const existing = await db.get(`
      SELECT id FROM carnet_reminders 
      WHERE pet_id = ? AND type = ? AND due_date = ? AND days_before = ?
    `, [pet_id, type, due_date, days_before]);

    if (existing) {
      return null; // Ya existe
    }

    const result = await db.run(`
      INSERT INTO carnet_reminders 
      (pet_id, user_id, type, title, message, due_date, days_before)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [pet_id, user_id, type, title, message, due_date, days_before]);

    return result.lastID;
  } catch (error) {
    console.error("Error creando recordatorio:", error);
    return null;
  }
}

/**
 * Generar recordatorios para una mascota
 */
export async function generateRemindersForPet(pet) {
  const reminders = [];
  const { pet_id, pet_name, user_id, carnet_id, email, username } = pet;

  try {
    // 1. Verificar vacunas
    const vaccines = await checkUpcomingVaccines(carnet_id, 7);
    for (const vaccine of vaccines) {
      const daysRemaining = getDaysRemaining(vaccine.proxima_dosis);
      const reminder = {
        pet_id,
        user_id,
        type: REMINDER_TYPES.VACCINE,
        title: `💉 Vacuna próxima para ${pet_name}`,
        message: `La vacuna "${vaccine.nombre_vacuna}" de ${pet_name} vence en ${daysRemaining} día(s) (${vaccine.proxima_dosis})`,
        due_date: vaccine.proxima_dosis,
        days_before: daysRemaining,
        pet_name,
        email,
        username,
        item_name: vaccine.nombre_vacuna
      };
      reminders.push(reminder);
      await createReminder(reminder);
    }

    // 2. Verificar desparasitaciones
    const dewormings = await checkUpcomingDewormings(carnet_id, 5);
    for (const deworming of dewormings) {
      const daysRemaining = getDaysRemaining(deworming.proxima_dosis);
      const reminder = {
        pet_id,
        user_id,
        type: REMINDER_TYPES.DEWORMING,
        title: `💊 Desparasitación próxima para ${pet_name}`,
        message: `La desparasitación de ${pet_name} (${deworming.medicamento}) vence en ${daysRemaining} día(s)`,
        due_date: deworming.proxima_dosis,
        days_before: daysRemaining,
        pet_name,
        email,
        username,
        item_name: deworming.medicamento
      };
      reminders.push(reminder);
      await createReminder(reminder);
    }

    // 3. Verificar baños
    const bathReminder = await checkBathReminder(carnet_id, 30);
    if (bathReminder) {
      const reminder = {
        pet_id,
        user_id,
        type: REMINDER_TYPES.BATH,
        title: `🛁 Hora del baño para ${pet_name}`,
        message: `Han pasado ${bathReminder.days_since} días desde el último baño de ${pet_name}. ¡Es hora de un nuevo baño!`,
        due_date: new Date().toISOString().split('T')[0],
        days_before: bathReminder.days_until,
        pet_name,
        email,
        username,
        item_name: 'Baño'
      };
      reminders.push(reminder);
      await createReminder(reminder);
    }

    // 4. Verificar medicamentos
    const medications = await checkMedicationsEnding(carnet_id, 3);
    for (const med of medications) {
      const daysRemaining = getDaysRemaining(med.fecha_fin);
      const reminder = {
        pet_id,
        user_id,
        type: REMINDER_TYPES.MEDICATION,
        title: `💊 Medicamento por terminar para ${pet_name}`,
        message: `El medicamento "${med.medicamento}" de ${pet_name} termina en ${daysRemaining} día(s)`,
        due_date: med.fecha_fin,
        days_before: daysRemaining,
        pet_name,
        email,
        username,
        item_name: med.medicamento
      };
      reminders.push(reminder);
      await createReminder(reminder);
    }

    return reminders;

  } catch (error) {
    console.error(`Error generando recordatorios para mascota ${pet_id}:`, error);
    return [];
  }
}

/**
 * Ejecutar verificación completa de recordatorios
 * Esta función se llama desde el cron job diario
 */
export async function runDailyReminderCheck() {
  console.log('\n🔔 ========================================');
  console.log('🔔 Iniciando verificación diaria de recordatorios...');
  console.log('🔔 Fecha:', new Date().toLocaleString('es-CO'));
  console.log('🔔 ========================================\n');

  try {
    // Obtener todas las mascotas adoptadas
    const pets = await getAdoptedPetsWithOwners();
    console.log(`📋 Encontradas ${pets.length} mascotas adoptadas para verificar\n`);

    let totalReminders = 0;
    const remindersToEmail = [];

    for (const pet of pets) {
      const reminders = await generateRemindersForPet(pet);
      if (reminders.length > 0) {
        console.log(`🐾 ${pet.pet_name}: ${reminders.length} recordatorio(s) generado(s)`);
        totalReminders += reminders.length;
        remindersToEmail.push(...reminders);
      }
    }

    console.log(`\n✅ Total de recordatorios generados: ${totalReminders}`);

    // Enviar emails de recordatorio
    if (remindersToEmail.length > 0) {
      console.log('\n📧 Enviando emails de recordatorio...');
      
      // Agrupar por usuario para enviar un solo email
      const remindersByUser = {};
      for (const reminder of remindersToEmail) {
        if (!remindersByUser[reminder.user_id]) {
          remindersByUser[reminder.user_id] = {
            email: reminder.email,
            username: reminder.username,
            reminders: []
          };
        }
        remindersByUser[reminder.user_id].reminders.push(reminder);
      }

      // Enviar emails
      for (const userId in remindersByUser) {
        const userData = remindersByUser[userId];
        try {
          await sendReminderEmail({
            email: userData.email,
            username: userData.username,
            reminders: userData.reminders
          });
          
          // Marcar como enviados
          for (const reminder of userData.reminders) {
            await db.run(
              "UPDATE carnet_reminders SET sent_email = 1 WHERE pet_id = ? AND due_date = ? AND type = ?",
              [reminder.pet_id, reminder.due_date, reminder.type]
            );
          }
          
          console.log(`   ✅ Email enviado a ${userData.email}`);
        } catch (emailError) {
          console.error(`   ❌ Error enviando email a ${userData.email}:`, emailError.message);
        }
      }
    }

    console.log('\n🔔 ========================================');
    console.log('🔔 Verificación de recordatorios completada');
    console.log('🔔 ========================================\n');

    return { success: true, totalReminders };

  } catch (error) {
    console.error('❌ Error en verificación de recordatorios:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener recordatorios no leídos de un usuario
 */
export async function getUnreadReminders(userId) {
  try {
    const reminders = await db.all(`
      SELECT 
        r.*,
        p.name as pet_name,
        p.img as pet_img
      FROM carnet_reminders r
      INNER JOIN pets p ON r.pet_id = p.id
      WHERE r.user_id = ? AND r.read = 0
      ORDER BY r.due_date ASC
    `, [userId]);

    return reminders;
  } catch (error) {
    console.error("Error obteniendo recordatorios:", error);
    return [];
  }
}

/**
 * Obtener todos los recordatorios de un usuario
 */
export async function getAllReminders(userId, limit = 50) {
  try {
    const reminders = await db.all(`
      SELECT 
        r.*,
        p.name as pet_name,
        p.img as pet_img
      FROM carnet_reminders r
      INNER JOIN pets p ON r.pet_id = p.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ?
    `, [userId, limit]);

    return reminders;
  } catch (error) {
    console.error("Error obteniendo recordatorios:", error);
    return [];
  }
}

/**
 * Marcar recordatorio como leído
 */
export async function markReminderAsRead(reminderId) {
  try {
    await db.run("UPDATE carnet_reminders SET read = 1 WHERE id = ?", [reminderId]);
    return true;
  } catch (error) {
    console.error("Error marcando recordatorio como leído:", error);
    return false;
  }
}

/**
 * Marcar todos los recordatorios como leídos
 */
export async function markAllRemindersAsRead(userId) {
  try {
    await db.run("UPDATE carnet_reminders SET read = 1 WHERE user_id = ?", [userId]);
    return true;
  } catch (error) {
    console.error("Error marcando recordatorios como leídos:", error);
    return false;
  }
}

/**
 * Obtener próximos eventos del carnet de una mascota
 */
export async function getUpcomingEventsForPet(petId) {
  try {
    const carnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [petId]);
    if (!carnet) return { vaccines: [], dewormings: [], medications: [] };

    const [vaccines, dewormings, medications] = await Promise.all([
      checkUpcomingVaccines(carnet.id, 30),
      checkUpcomingDewormings(carnet.id, 30),
      checkMedicationsEnding(carnet.id, 30)
    ]);

    return { vaccines, dewormings, medications };
  } catch (error) {
    console.error("Error obteniendo próximos eventos:", error);
    return { vaccines: [], dewormings: [], medications: [] };
  }
}

/**
 * Obtener configuración de recordatorios del usuario
 */
export async function getUserReminderSettings(userId) {
  try {
    let settings = await db.get(
      "SELECT * FROM reminder_settings WHERE user_id = ?",
      [userId]
    );

    // Si no existe, crear con valores por defecto
    if (!settings) {
      await db.run(`
        INSERT INTO reminder_settings 
        (user_id, email_notifications, vaccine_days_before, deworming_days_before, bath_frequency_days, medication_days_before)
        VALUES (?, 1, 7, 5, 30, 3)
      `, [userId]);

      settings = {
        user_id: userId,
        email_notifications: 1,
        vaccine_days_before: 7,
        deworming_days_before: 5,
        bath_frequency_days: 30,
        medication_days_before: 3
      };
    }

    return settings;
  } catch (error) {
    console.error("Error obteniendo configuración de recordatorios:", error);
    return {
      email_notifications: 1,
      vaccine_days_before: 7,
      deworming_days_before: 5,
      bath_frequency_days: 30,
      medication_days_before: 3
    };
  }
}

/**
 * Actualizar configuración de recordatorios del usuario
 */
export async function updateReminderSettings(userId, settings) {
  try {
    const {
      email_notifications,
      vaccine_days_before,
      deworming_days_before,
      bath_frequency_days,
      medication_days_before
    } = settings;

    // Verificar si existe
    const existing = await db.get(
      "SELECT id FROM reminder_settings WHERE user_id = ?",
      [userId]
    );

    if (existing) {
      await db.run(`
        UPDATE reminder_settings SET
          email_notifications = COALESCE(?, email_notifications),
          vaccine_days_before = COALESCE(?, vaccine_days_before),
          deworming_days_before = COALESCE(?, deworming_days_before),
          bath_frequency_days = COALESCE(?, bath_frequency_days),
          medication_days_before = COALESCE(?, medication_days_before)
        WHERE user_id = ?
      `, [
        email_notifications,
        vaccine_days_before,
        deworming_days_before,
        bath_frequency_days,
        medication_days_before,
        userId
      ]);
    } else {
      await db.run(`
        INSERT INTO reminder_settings 
        (user_id, email_notifications, vaccine_days_before, deworming_days_before, bath_frequency_days, medication_days_before)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        userId,
        email_notifications ?? 1,
        vaccine_days_before ?? 7,
        deworming_days_before ?? 5,
        bath_frequency_days ?? 30,
        medication_days_before ?? 3
      ]);
    }

    return await getUserReminderSettings(userId);
  } catch (error) {
    console.error("Error actualizando configuración de recordatorios:", error);
    throw error;
  }
}

export default {
  runDailyReminderCheck,
  generateRemindersForPet,
  getUnreadReminders,
  getAllReminders,
  markReminderAsRead,
  markAllRemindersAsRead,
  getUpcomingEventsForPet,
  getUserReminderSettings,
  updateReminderSettings
};

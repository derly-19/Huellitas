import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function addRemindersTable() {
  const db = await open({
    filename: './src/db/huellitas.db',
    driver: sqlite3.Database
  });

  try {
    console.log('🔔 Creando tabla de recordatorios...\n');

    // Tabla principal de recordatorios
    await db.exec(`
      CREATE TABLE IF NOT EXISTS carnet_reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        due_date DATE NOT NULL,
        days_before INTEGER DEFAULT 0,
        sent_email INTEGER DEFAULT 0,
        read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('✅ Tabla carnet_reminders creada');

    // Tabla de configuración de recordatorios por usuario
    await db.exec(`
      CREATE TABLE IF NOT EXISTS reminder_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        email_notifications INTEGER DEFAULT 1,
        vaccine_days_before INTEGER DEFAULT 7,
        deworming_days_before INTEGER DEFAULT 5,
        bath_frequency_days INTEGER DEFAULT 30,
        medication_days_before INTEGER DEFAULT 3,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('✅ Tabla reminder_settings creada');

    // Índices para búsquedas rápidas
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_reminders_user ON carnet_reminders(user_id);
      CREATE INDEX IF NOT EXISTS idx_reminders_pet ON carnet_reminders(pet_id);
      CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON carnet_reminders(due_date);
      CREATE INDEX IF NOT EXISTS idx_reminders_read ON carnet_reminders(read);
    `);
    console.log('✅ Índices creados');

    console.log('\n✅ Sistema de recordatorios configurado correctamente\n');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Las tablas ya existen');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await db.close();
  }
}

addRemindersTable();

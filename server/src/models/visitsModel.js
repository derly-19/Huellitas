import { db } from "../db/database.js";

// Crear tabla de visitas de seguimiento
export async function createVisitsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adoption_request_id INTEGER NOT NULL,
      pet_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      foundation_id INTEGER NOT NULL,
      scheduled_date TEXT NOT NULL,
      scheduled_time TEXT,
      visit_type TEXT NOT NULL DEFAULT 'presencial', -- presencial, virtual
      meeting_link TEXT, -- enlace de reunión para visitas virtuales
      status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, accepted, completed, cancelled, pending_reschedule
      notes TEXT,
      foundation_notes TEXT,
      suggested_date TEXT,
      suggested_time TEXT,
      reschedule_reason TEXT,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (adoption_request_id) REFERENCES adoption_requests(id),
      FOREIGN KEY (pet_id) REFERENCES pets(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (foundation_id) REFERENCES users(id)
    )
  `;
  
  try {
    await db.run(sql);
    
    // Agregar columna meeting_link si no existe
    try {
      await db.run(`ALTER TABLE visits ADD COLUMN meeting_link TEXT`);
      console.log("✅ Columna meeting_link agregada a visits");
    } catch (e) {
      // La columna ya existe, ignorar
    }
    
    console.log("✅ Visits table ready");
  } catch (err) {
    console.error("❌ Error creating visits table:", err);
  }
}

// Crear visita
export async function createVisit(visitData) {
  const {
    adoption_request_id,
    pet_id,
    user_id,
    foundation_id,
    scheduled_date,
    scheduled_time,
    visit_type,
    meeting_link,
    notes
  } = visitData;

  try {
    const result = await db.run(
      `INSERT INTO visits 
       (adoption_request_id, pet_id, user_id, foundation_id, scheduled_date, scheduled_time, visit_type, meeting_link, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [adoption_request_id, pet_id, user_id, foundation_id, scheduled_date, scheduled_time, visit_type || 'presencial', meeting_link || null, notes]
    );
    
    console.log(`✅ Visita programada para ${scheduled_date}`);
    return { id: result.lastID, ...visitData };
  } catch (err) {
    console.error("Error creating visit:", err);
    throw err;
  }
}

// Obtener visitas del usuario
export async function getUserVisits(userId) {
  try {
    const rows = await db.all(
      `SELECT v.*, p.name as pet_name, p.img as pet_img, p.type as pet_type,
              u.username as foundation_name
       FROM visits v
       JOIN pets p ON v.pet_id = p.id
       JOIN users u ON v.foundation_id = u.id
       WHERE v.user_id = ?
       ORDER BY v.scheduled_date ASC`,
      [userId]
    );
    return rows || [];
  } catch (err) {
    console.error("Error getting user visits:", err);
    throw err;
  }
}

// Obtener visitas de la fundación
export async function getFoundationVisits(foundationId) {
  try {
    const rows = await db.all(
      `SELECT v.*, p.name as pet_name, p.img as pet_img, p.type as pet_type,
              u.username as adopter_name, u.email as adopter_email
       FROM visits v
       JOIN pets p ON v.pet_id = p.id
       JOIN users u ON v.user_id = u.id
       WHERE v.foundation_id = ?
       ORDER BY v.scheduled_date ASC`,
      [foundationId]
    );
    return rows || [];
  } catch (err) {
    console.error("Error getting foundation visits:", err);
    throw err;
  }
}

// Obtener visitas por mascota
export async function getPetVisits(petId) {
  try {
    const rows = await db.all(
      `SELECT v.*, u.username as adopter_name
       FROM visits v
       JOIN users u ON v.user_id = u.id
       WHERE v.pet_id = ?
       ORDER BY v.scheduled_date DESC`,
      [petId]
    );
    return rows || [];
  } catch (err) {
    console.error("Error getting pet visits:", err);
    throw err;
  }
}

// Actualizar estado de visita
export async function updateVisitStatus(id, status, notes = null) {
  try {
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    
    await db.run(
      `UPDATE visits 
       SET status = ?, foundation_notes = COALESCE(?, foundation_notes), 
           completed_at = COALESCE(?, completed_at), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, notes, completedAt, id]
    );
    
    console.log(`✅ Visita ${id} actualizada a ${status}`);
    return { id, status };
  } catch (err) {
    console.error("Error updating visit status:", err);
    throw err;
  }
}

// Reprogramar visita
export async function rescheduleVisit(id, newDate, newTime, meetingLink = null) {
  try {
    if (meetingLink) {
      await db.run(
        `UPDATE visits 
         SET scheduled_date = ?, scheduled_time = ?, meeting_link = ?, status = 'scheduled', 
             suggested_date = NULL, suggested_time = NULL, reschedule_reason = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [newDate, newTime, meetingLink, id]
      );
    } else {
      await db.run(
        `UPDATE visits 
         SET scheduled_date = ?, scheduled_time = ?, status = 'scheduled', 
             suggested_date = NULL, suggested_time = NULL, reschedule_reason = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [newDate, newTime, id]
      );
    }
    
    console.log(`✅ Visita ${id} reprogramada para ${newDate}`);
    return { id, scheduled_date: newDate, scheduled_time: newTime };
  } catch (err) {
    console.error("Error rescheduling visit:", err);
    throw err;
  }
}

// Sugerir cambio de fecha (adoptante)
export async function suggestReschedule(id, suggestedDate, suggestedTime, reason) {
  try {
    await db.run(
      `UPDATE visits 
       SET suggested_date = ?, suggested_time = ?, reschedule_reason = ?, 
           status = 'pending_reschedule', updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [suggestedDate, suggestedTime, reason, id]
    );
    
    console.log(`✅ Sugerencia de cambio enviada para visita ${id}`);
    return { id, suggested_date: suggestedDate };
  } catch (err) {
    console.error("Error suggesting reschedule:", err);
    throw err;
  }
}

// Aceptar visita (adoptante)
export async function acceptVisit(id) {
  try {
    await db.run(
      `UPDATE visits 
       SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );
    
    console.log(`✅ Visita ${id} aceptada por adoptante`);
    return { id, status: 'accepted' };
  } catch (err) {
    console.error("Error accepting visit:", err);
    throw err;
  }
}

// Eliminar visita
export async function deleteVisit(id) {
  try {
    await db.run(`DELETE FROM visits WHERE id = ?`, [id]);
    console.log(`✅ Visita ${id} eliminada`);
  } catch (err) {
    console.error("Error deleting visit:", err);
    throw err;
  }
}

// Obtener próximas visitas
export async function getUpcomingVisits(foundationId, days = 7) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const rows = await db.all(
      `SELECT v.*, p.name as pet_name, u.username as adopter_name, u.phone as adopter_phone
       FROM visits v
       JOIN pets p ON v.pet_id = p.id
       JOIN users u ON v.user_id = u.id
       WHERE v.foundation_id = ? 
         AND v.scheduled_date BETWEEN ? AND ?
         AND v.status IN ('scheduled', 'rescheduled')
       ORDER BY v.scheduled_date ASC`,
      [foundationId, today, futureDateStr]
    );
    return rows || [];
  } catch (err) {
    console.error("Error getting upcoming visits:", err);
    throw err;
  }
}

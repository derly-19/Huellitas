import { db } from '../db/database.js';

/**
 * Script para limpiar datos de prueba creados durante las pruebas de recordatorios
 * Útil para resetear la base de datos después de las pruebas
 */

async function cleanTestData() {
  try {
    console.log('🗑️  Iniciando limpieza de datos de prueba...\n');

    // Obtener ID del usuario de prueba más reciente
    const testUser = await getTestUser();
    
    if (!testUser) {
      console.log('ℹ️  No se encontraron usuarios de prueba para eliminar');
      process.exit(0);
    }

    console.log(`Found test user ID: ${testUser.id}\n`);

    // Eliminar en orden correcto (respetando foreign keys)
    console.log('1️⃣ Eliminando recordatorios...');
    await deleteRecords('reminders', 'user_id', testUser.id);

    console.log('2️⃣ Eliminando notificaciones...');
    await deleteRecords('notifications', 'user_id', testUser.id);

    console.log('3️⃣ Eliminando follow-ups...');
    const adoption = await getAdoptionByUserId(testUser.id);
    if (adoption) {
      await deleteRecords('follow_ups', 'adoption_request_id', adoption.id);
    }

    console.log('4️⃣ Eliminando visitas...');
    if (adoption) {
      await deleteRecords('visits', 'adoption_request_id', adoption.id);
    }

    console.log('5️⃣ Eliminando registros médicos del carnet...');
    const pet = await getPetByAdoptionId(adoption?.id);
    if (pet) {
      await deleteRecords('vacunas', 'pet_id', pet.id);
      await deleteRecords('desparasitaciones', 'pet_id', pet.id);
      await deleteRecords('banos', 'pet_id', pet.id);
      await deleteRecords('procedimientos', 'pet_id', pet.id);
      await deleteRecords('medicamentos', 'pet_id', pet.id);
    }

    console.log('6️⃣ Eliminando carnet...');
    if (pet) {
      await deleteRecords('carnet', 'pet_id', pet.id);
    }

    console.log('7️⃣ Eliminando solicitud de adopción...');
    if (adoption) {
      await deleteRecords('adoption_requests', 'id', adoption.id);
    }

    console.log('8️⃣ Eliminando mascota...');
    if (pet) {
      await deleteRecords('pets', 'id', pet.id);
    }

    console.log('9️⃣ Eliminando usuario de prueba...');
    await deleteRecords('users', 'id', testUser.id);

    console.log('\n✅ ¡Limpieza completada!');
    console.log('📊 Todos los datos de prueba han sido eliminados de la base de datos');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    process.exit(1);
  }
}

function getTestUser() {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE username LIKE 'testuser_%' ORDER BY id DESC LIMIT 1`,
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

function getAdoptionByUserId(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM adoption_requests WHERE user_id = ? LIMIT 1`,
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

function getPetByAdoptionId(adoptionId) {
  return new Promise((resolve, reject) => {
    if (!adoptionId) {
      resolve(null);
      return;
    }
    
    db.get(
      `SELECT p.* FROM pets p 
       INNER JOIN adoption_requests ar ON p.id = ar.pet_id 
       WHERE ar.id = ? LIMIT 1`,
      [adoptionId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

function deleteRecords(table, column, value) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM ${table} WHERE ${column} = ?`,
      [value],
      function(err) {
        if (err) {
          console.log(`   ⚠️  Error en ${table}: ${err.message}`);
          resolve(); // Continuar aunque haya error
        } else {
          console.log(`   ✅ ${table}: ${this.changes} fila(s) eliminada(s)`);
          resolve();
        }
      }
    );
  });
}

cleanTestData();

import { db } from '../db/database.js';

/**
 * Script para probar recordatorios
 * Crea datos de ejemplo con mascotas, adopciones y carnet médico
 * para poder visualizar los recordatorios en acción
 */

async function createTestReminders() {
  try {
    console.log('🧪 Iniciando prueba de recordatorios...\n');

    // 1. Crear usuario adoptante de prueba
    console.log('1️⃣ Creando usuario adoptante de prueba...');
    const userId = await createTestUser();
    console.log(`✅ Usuario creado con ID: ${userId}\n`);

    // 2. Crear mascota de prueba
    console.log('2️⃣ Creando mascota de prueba...');
    const petId = await createTestPet();
    console.log(`✅ Mascota creada con ID: ${petId}\n`);

    // 3. Crear solicitud de adopción aprobada
    console.log('3️⃣ Creando solicitud de adopción...');
    const adoptionId = await createTestAdoption(userId, petId);
    console.log(`✅ Adopción creada con ID: ${adoptionId}\n`);

    // 4. Crear carnet médico
    console.log('4️⃣ Creando carnet médico...');
    const carnetId = await createTestCarnet(petId);
    console.log(`✅ Carnet creado con ID: ${carnetId}\n`);

    // 5. Agregar registros con fechas próximas
    console.log('5️⃣ Agregando registros médicos con fechas próximas...');
    await createTestRecords(petId, carnetId);
    console.log('✅ Registros médicos creados\n');

    console.log('🎉 ¡Datos de prueba creados exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   • Usuario ID: ${userId}`);
    console.log(`   • Mascota ID: ${petId}`);
    console.log(`   • Adopción ID: ${adoptionId}`);
    console.log(`   • Carnet ID: ${carnetId}`);
    console.log('\n💡 Los recordatorios deberían aparecer en 1-7 días dependiendo de las fechas');
    console.log('🔄 Corre: npm run reminders:check para generar los recordatorios manualmente\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    process.exit(1);
  }
}

async function createTestUser() {
  const username = `testuser_${Date.now()}`;
  const email = `test_${Date.now()}@example.com`;
  
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, email, password_hash, user_type, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, 'test_hash_123', 'normal', 'activo'],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

async function createTestPet() {
  const petName = `TestPet_${Date.now()}`;
  
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO pets (name, type, breed, age, description, available, foundation_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [petName, 'Perro', 'Labrador', 2, 'Mascota de prueba para testing de recordatorios', 0, 1],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

async function createTestAdoption(userId, petId) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO adoption_requests 
       (pet_id, user_id, nombre, apellido, correo, telefono, direccion, tipo_vivienda, tiene_mascotas, motivacion, status, fecha_solicitud)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petId,
        userId,
        'Test',
        'User',
        'test@example.com',
        '1234567890',
        'Calle Test 123',
        'Casa',
        'No',
        'Testing de recordatorios',
        'approved',
        new Date().toISOString()
      ],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

async function createTestCarnet(petId) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO carnet (pet_id, created_at, updated_at)
       VALUES (?, ?, ?)`,
      [petId, new Date().toISOString(), new Date().toISOString()],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

async function createTestRecords(petId, carnetId) {
  const today = new Date();
  
  // Registros con fechas próximas para que se generen recordatorios
  const records = [
    {
      table: 'vacunas',
      data: {
        pet_id: petId,
        nombre_vacuna: 'Rabia',
        fecha_aplicacion: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 3 días
        lote: 'LOTE123',
        veterinario: 'Dr. Test'
      }
    },
    {
      table: 'vacunas',
      data: {
        pet_id: petId,
        nombre_vacuna: 'DHPP',
        fecha_aplicacion: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 7 días
        lote: 'LOTE456',
        veterinario: 'Dr. Test'
      }
    },
    {
      table: 'desparasitaciones',
      data: {
        pet_id: petId,
        tipo: 'Interna',
        fecha_aplicacion: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mañana
        medicamento: 'Desparasitante X',
        veterinario: 'Dr. Test'
      }
    },
    {
      table: 'banos',
      data: {
        pet_id: petId,
        fecha: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 5 días
        tipo_baño: 'Baño medicado',
        observaciones: 'Prueba de recordatorio de baño'
      }
    },
    {
      table: 'medicamentos',
      data: {
        pet_id: petId,
        nombre: 'Medicina de prueba',
        dosis: '10ml',
        frecuencia: 'Cada 12 horas',
        inicio_tratamiento: new Date().toISOString().split('T')[0],
        fin_tratamiento: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 10 días
        razon: 'Testing'
      }
    }
  ];

  for (const record of records) {
    await insertRecord(record.table, record.data);
  }
}

function insertRecord(table, data) {
  return new Promise((resolve, reject) => {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    db.run(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
      values,
      function(err) {
        if (err) {
          console.warn(`⚠️ Error insertando en ${table}:`, err.message);
          resolve(); // No rechazar, continuar con el siguiente
        } else {
          console.log(`   ✅ ${table}: ${data.nombre_vacuna || data.tipo || data.nombre || 'Registro'} - ${data.fecha_aplicacion || data.fecha || data.fin_tratamiento}`);
          resolve();
        }
      }
    );
  });
}

// Ejecutar
createTestReminders();

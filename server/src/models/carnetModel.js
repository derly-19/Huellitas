import { db } from "../db/database.js";

// Función para crear las tablas del carnet médico
export async function createCarnetTables() {
  try {
    console.log("🏥 Creando tablas del carnet médico...");

    // Tabla principal del carnet (uno por mascota)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS carnet (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets (id)
      )
    `);

    // Tabla de vacunas
    await db.exec(`
      CREATE TABLE IF NOT EXISTS carnet_vacunas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carnet_id INTEGER NOT NULL,
        nombre_vacuna TEXT NOT NULL,
        fecha_aplicacion DATE NOT NULL,
        lote TEXT,
        veterinario TEXT,
        proxima_dosis DATE,
        observaciones TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (carnet_id) REFERENCES carnet (id)
      )
    `);

    // Tabla de desparasitaciones
    await db.exec(`
      CREATE TABLE IF NOT EXISTS carnet_desparasitaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carnet_id INTEGER NOT NULL,
        tipo TEXT NOT NULL, -- 'interna' o 'externa'
        medicamento TEXT NOT NULL,
        dosis TEXT,
        fecha_aplicacion DATE NOT NULL,
        peso_mascota REAL,
        veterinario TEXT,
        proxima_dosis DATE,
        observaciones TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (carnet_id) REFERENCES carnet (id)
      )
    `);

    // Tabla de baños y cuidados
    await db.exec(`
      CREATE TABLE IF NOT EXISTS carnet_banos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carnet_id INTEGER NOT NULL,
        fecha DATE NOT NULL,
        tipo_shampoo TEXT NOT NULL,
        tratamiento_especial TEXT,
        observaciones TEXT,
        realizado_por TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (carnet_id) REFERENCES carnet (id)
      )
    `);

    // Tabla de procedimientos médicos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS carnet_procedimientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carnet_id INTEGER NOT NULL,
        tipo_procedimiento TEXT NOT NULL, -- 'cirugia', 'consulta', 'emergencia', etc.
        descripcion TEXT NOT NULL,
        fecha DATE NOT NULL,
        veterinario TEXT,
        costo REAL,
        observaciones TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (carnet_id) REFERENCES carnet (id)
      )
    `);

    // Tabla de medicamentos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS carnet_medicamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carnet_id INTEGER NOT NULL,
        medicamento TEXT NOT NULL,
        dosis TEXT NOT NULL,
        frecuencia TEXT NOT NULL, -- 'cada 8 horas', 'una vez al día', etc.
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE,
        motivo TEXT,
        veterinario TEXT,
        observaciones TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (carnet_id) REFERENCES carnet (id)
      )
    `);

    console.log("✅ Tablas del carnet médico creadas exitosamente");
    return true;
  } catch (error) {
    console.error("❌ Error creando tablas del carnet:", error);
    return false;
  }
}

// Función para crear carnets para todas las mascotas existentes
export async function createCarnetsForAllPets() {
  try {
    console.log("📋 Creando carnets para todas las mascotas...");
    
    // Obtener todas las mascotas
    const pets = await db.all("SELECT id, name FROM pets");
    
    for (const pet of pets) {
      // Verificar si ya tiene carnet
      const existingCarnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [pet.id]);
      
      if (!existingCarnet) {
        // Crear carnet para la mascota
        const result = await db.run("INSERT INTO carnet (pet_id) VALUES (?)", [pet.id]);
        console.log(`📋 Carnet creado para ${pet.name} (ID: ${result.lastID})`);
      } else {
        console.log(`📋 ${pet.name} ya tiene carnet (ID: ${existingCarnet.id})`);
      }
    }
    
    return true;
  } catch (error) {
    console.error("❌ Error creando carnets:", error);
    return false;
  }
}

// Función para insertar datos de ejemplo
export async function insertSampleCarnetData() {
  try {
    console.log("🎯 Insertando datos de ejemplo para los carnets...");
    
    // Obtener todos los carnets
    const carnets = await db.all(`
      SELECT c.id as carnet_id, c.pet_id, p.name as pet_name 
      FROM carnet c 
      JOIN pets p ON c.pet_id = p.id
    `);

    for (const carnet of carnets) {
      console.log(`📝 Agregando datos para ${carnet.pet_name}...`);
      
      // Vacunas (2-3 por mascota)
      const vacunas = [
        {
          nombre_vacuna: 'Rabia',
          fecha_aplicacion: '2024-01-15',
          lote: 'RAB001',
          veterinario: 'Dr. García',
          proxima_dosis: '2025-01-15',
          observaciones: 'Sin reacciones adversas'
        },
        {
          nombre_vacuna: 'Parvovirus',
          fecha_aplicacion: '2024-02-10',
          lote: 'PAR002',
          veterinario: 'Dr. García',
          proxima_dosis: '2025-02-10',
          observaciones: 'Aplicada correctamente'
        }
      ];

      for (const vacuna of vacunas) {
        await db.run(`
          INSERT INTO carnet_vacunas 
          (carnet_id, nombre_vacuna, fecha_aplicacion, lote, veterinario, proxima_dosis, observaciones)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [carnet.carnet_id, vacuna.nombre_vacuna, vacuna.fecha_aplicacion, 
            vacuna.lote, vacuna.veterinario, vacuna.proxima_dosis, vacuna.observaciones]);
      }

      // Desparasitaciones (1-2 por mascota)
      const desparasitaciones = [
        {
          tipo: 'interna',
          medicamento: 'Drontal Plus',
          dosis: '1 tableta',
          fecha_aplicacion: '2024-03-01',
          peso_mascota: carnet.pet_id <= 5 ? 15.5 : 4.2, // Perros más pesados que gatos
          veterinario: 'Dr. López',
          proxima_dosis: '2024-06-01',
          observaciones: 'Toleró bien el medicamento'
        }
      ];

      for (const desp of desparasitaciones) {
        await db.run(`
          INSERT INTO carnet_desparasitaciones
          (carnet_id, tipo, medicamento, dosis, fecha_aplicacion, peso_mascota, veterinario, proxima_dosis, observaciones)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [carnet.carnet_id, desp.tipo, desp.medicamento, desp.dosis, 
            desp.fecha_aplicacion, desp.peso_mascota, desp.veterinario, desp.proxima_dosis, desp.observaciones]);
      }

      // Baños (1-2 por mascota)
      const banos = [
        {
          fecha: '2024-03-15',
          tipo_shampoo: 'Antipulgas',
          tratamiento_especial: 'Acondicionador hidratante',
          observaciones: 'Se comportó muy bien durante el baño',
          realizado_por: 'Refugio Huellitas'
        }
      ];

      for (const bano of banos) {
        await db.run(`
          INSERT INTO carnet_banos
          (carnet_id, fecha, tipo_shampoo, tratamiento_especial, observaciones, realizado_por)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [carnet.carnet_id, bano.fecha, bano.tipo_shampoo, 
            bano.tratamiento_especial, bano.observaciones, bano.realizado_por]);
      }

      // Procedimientos (1 por mascota)
      const procedimientos = [
        {
          tipo_procedimiento: 'consulta',
          descripcion: 'Revisión general y chequeo de salud',
          fecha: '2024-01-10',
          veterinario: 'Dr. García',
          costo: 50000,
          observaciones: 'Mascota en buen estado de salud general'
        }
      ];

      for (const proc of procedimientos) {
        await db.run(`
          INSERT INTO carnet_procedimientos
          (carnet_id, tipo_procedimiento, descripcion, fecha, veterinario, costo, observaciones)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [carnet.carnet_id, proc.tipo_procedimiento, proc.descripcion, 
            proc.fecha, proc.veterinario, proc.costo, proc.observaciones]);
      }

      // Medicamentos (solo para algunas mascotas)
      if (carnet.pet_id % 3 === 0) { // Cada 3ra mascota
        const medicamentos = [
          {
            medicamento: 'Antibiótico Amoxicilina',
            dosis: '250mg',
            frecuencia: 'cada 12 horas',
            fecha_inicio: '2024-02-15',
            fecha_fin: '2024-02-25',
            motivo: 'Infección leve en pata',
            veterinario: 'Dr. López',
            observaciones: 'Completó el tratamiento exitosamente'
          }
        ];

        for (const med of medicamentos) {
          await db.run(`
            INSERT INTO carnet_medicamentos
            (carnet_id, medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, motivo, veterinario, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [carnet.carnet_id, med.medicamento, med.dosis, med.frecuencia, 
              med.fecha_inicio, med.fecha_fin, med.motivo, med.veterinario, med.observaciones]);
        }
      }
    }

    console.log("🎉 Datos de ejemplo insertados exitosamente");
    return true;
  } catch (error) {
    console.error("❌ Error insertando datos de ejemplo:", error);
    return false;
  }
}

// Función principal para configurar todo el carnet
export async function setupCarnetSystem() {
  console.log("🏥 CONFIGURANDO SISTEMA DE CARNET MÉDICO");
  console.log("=========================================");
  
  const step1 = await createCarnetTables();
  if (!step1) return false;
  
  const step2 = await createCarnetsForAllPets();
  if (!step2) return false;
  
  const step3 = await insertSampleCarnetData();
  if (!step3) return false;
  
  console.log("🎉 ¡Sistema de carnet médico configurado completamente!");
  return true;
}
// Script para agregar columnas faltantes en tablas de carnet
// Ejecutar con: node src/scripts/addCarnetColumns.js

import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function addCarnetColumns() {
  console.log("🔄 Iniciando agregación de columnas de carnet...\n");

  const db = await open({
    filename: "./src/db/huellitas.db",
    driver: sqlite3.Database
  });

  try {
    // Agregar columnas a carnet_medicamentos
    console.log("📋 Actualizando tabla 'carnet_medicamentos'...");
    
    const medicamentosColumns = [
      { name: 'frecuencia', type: 'TEXT' },
      { name: 'veterinario', type: 'TEXT' }
    ];

    for (const col of medicamentosColumns) {
      try {
        await db.exec(`ALTER TABLE carnet_medicamentos ADD COLUMN ${col.name} ${col.type}`);
        console.log(`  ✅ Columna '${col.name}' agregada a carnet_medicamentos`);
      } catch (error) {
        if (error.message.includes('duplicate column name')) {
          console.log(`  ⏭️  Columna '${col.name}' ya existe en carnet_medicamentos`);
        } else {
          console.error(`  ❌ Error al agregar '${col.name}':`, error.message);
        }
      }
    }

    // Agregar columnas a carnet_procedimientos
    console.log("\n📋 Actualizando tabla 'carnet_procedimientos'...");
    
    const procedimientosColumns = [
      { name: 'duracion', type: 'TEXT' },
      { name: 'complicaciones', type: 'TEXT' }
    ];

    for (const col of procedimientosColumns) {
      try {
        await db.exec(`ALTER TABLE carnet_procedimientos ADD COLUMN ${col.name} ${col.type}`);
        console.log(`  ✅ Columna '${col.name}' agregada a carnet_procedimientos`);
      } catch (error) {
        if (error.message.includes('duplicate column name')) {
          console.log(`  ⏭️  Columna '${col.name}' ya existe en carnet_procedimientos`);
        } else {
          console.error(`  ❌ Error al agregar '${col.name}':`, error.message);
        }
      }
    }

    console.log("\n✅ Actualización completada exitosamente!");
    
    // Mostrar estructura actual
    console.log("\n📊 Estructura actual de las tablas:");
    
    const medicamentosInfo = await db.all("PRAGMA table_info(carnet_medicamentos)");
    console.log("\n💊 Tabla 'carnet_medicamentos':");
    medicamentosInfo.forEach(col => {
      console.log(`   - ${col.name}: ${col.type}`);
    });

    const procedimientosInfo = await db.all("PRAGMA table_info(carnet_procedimientos)");
    console.log("\n🏥 Tabla 'carnet_procedimientos':");
    procedimientosInfo.forEach(col => {
      console.log(`   - ${col.name}: ${col.type}`);
    });

  } catch (error) {
    console.error("❌ Error durante la actualización:", error);
  } finally {
    await db.close();
  }
}

addCarnetColumns();

// Script de migración para agregar columnas de fundación
// Ejecutar con: node src/scripts/migrateDatabase.js

import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function migrateDatabase() {
  console.log("🔄 Iniciando migración de base de datos...\n");

  const db = await open({
    filename: "./src/db/huellitas.db",
    driver: sqlite3.Database
  });

  try {
    // Verificar y agregar columnas a la tabla users
    console.log("📋 Migrando tabla 'users'...");
    
    const userColumns = [
      { name: 'user_type', type: "TEXT DEFAULT 'user'" },
      { name: 'foundation_name', type: 'TEXT' },
      { name: 'foundation_description', type: 'TEXT' },
      { name: 'foundation_phone', type: 'TEXT' },
      { name: 'foundation_address', type: 'TEXT' },
      { name: 'foundation_logo', type: 'TEXT' },
      { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
    ];

    for (const col of userColumns) {
      try {
        await db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        console.log(`  ✅ Columna '${col.name}' agregada a users`);
      } catch (error) {
        if (error.message.includes('duplicate column name')) {
          console.log(`  ⏭️  Columna '${col.name}' ya existe en users`);
        } else {
          console.error(`  ❌ Error al agregar '${col.name}':`, error.message);
        }
      }
    }

    // Verificar y agregar columnas a la tabla pets
    console.log("\n📋 Migrando tabla 'pets'...");
    
    const petColumns = [
      { name: 'foundation_id', type: 'INTEGER REFERENCES users(id)' }
    ];

    for (const col of petColumns) {
      try {
        await db.exec(`ALTER TABLE pets ADD COLUMN ${col.name} ${col.type}`);
        console.log(`  ✅ Columna '${col.name}' agregada a pets`);
      } catch (error) {
        if (error.message.includes('duplicate column name')) {
          console.log(`  ⏭️  Columna '${col.name}' ya existe en pets`);
        } else {
          console.error(`  ❌ Error al agregar '${col.name}':`, error.message);
        }
      }
    }

    console.log("\n✅ Migración completada exitosamente!");
    
    // Mostrar estructura actual de las tablas
    console.log("\n📊 Estructura actual de las tablas:");
    
    const usersInfo = await db.all("PRAGMA table_info(users)");
    console.log("\n👤 Tabla 'users':");
    usersInfo.forEach(col => {
      console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });

    const petsInfo = await db.all("PRAGMA table_info(pets)");
    console.log("\n🐾 Tabla 'pets':");
    petsInfo.forEach(col => {
      console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });

  } catch (error) {
    console.error("❌ Error durante la migración:", error);
  } finally {
    await db.close();
  }
}

migrateDatabase();

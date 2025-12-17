import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Abrir base de datos
const dbPath = path.join(__dirname, "../db/huellitas.db");
const database = await open({
  filename: dbPath,
  driver: sqlite3.Database
});

console.log(`📁 Base de datos: ${dbPath}`);

// Eliminar tabla follow_ups si existe
try {
  await database.exec("DROP TABLE IF EXISTS follow_ups");
  console.log("✅ Tabla follow_ups eliminada");
} catch (err) {
  console.error("❌ Error eliminando tabla:", err);
}

// Crear tabla follow_ups nuevamente
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS follow_ups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    adoption_request_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    foundation_id INTEGER NOT NULL,
    follow_up_date TEXT NOT NULL,
    health_status TEXT NOT NULL DEFAULT 'excelente',
    behavior_status TEXT NOT NULL DEFAULT 'adaptado',
    environment_description TEXT,
    feeding_notes TEXT,
    medical_visits INTEGER DEFAULT 0,
    problems_encountered TEXT,
    additional_notes TEXT,
    photos TEXT,
    reviewed INTEGER DEFAULT 0,
    foundation_feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adoption_request_id) REFERENCES adoption_requests(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id),
    FOREIGN KEY (foundation_id) REFERENCES users(id)
  )
`;

try {
  await database.exec(createTableSQL);
  console.log("✅ Tabla follow_ups creada exitosamente");
} catch (err) {
  console.error("❌ Error creando tabla:", err);
}

// Verificar que la tabla existe
try {
  const result = await database.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("\n📋 Tablas en la base de datos:");
  result.forEach(row => {
    console.log(`  - ${row.name}`);
  });
} catch (err) {
  console.error("❌ Error listando tablas:", err);
}

await database.close();
console.log("\n✅ Base de datos lista");

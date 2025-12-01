import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addUserFields() {
  const db = await open({
    filename: path.join(__dirname, '../../huellitas.db'),
    driver: sqlite3.Database
  });

  try {
    console.log('🔄 Agregando nuevos campos a la tabla users...');

    // Verificar si las columnas ya existen
    const tableInfo = await db.all("PRAGMA table_info(users)");
    const columnNames = tableInfo.map(col => col.name);

    const columnsToAdd = [
      { name: 'nombre', type: 'TEXT' },
      { name: 'apellido', type: 'TEXT' },
      { name: 'telefono', type: 'TEXT' },
      { name: 'direccion', type: 'TEXT' },
      { name: 'ciudad', type: 'TEXT' }
    ];

    for (const column of columnsToAdd) {
      if (!columnNames.includes(column.name)) {
        await db.run(`ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`);
        console.log(`✅ Columna '${column.name}' agregada`);
      } else {
        console.log(`ℹ️  Columna '${column.name}' ya existe`);
      }
    }

    console.log('✅ Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    await db.close();
  }
}

addUserFields();

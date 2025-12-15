import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function addPasswordResetColumns() {
  const db = await open({
    filename: './src/db/huellitas.db',
    driver: sqlite3.Database
  });

  try {
    console.log('🔄 Verificando tabla users...');
    
    // Obtener información de la tabla
    const tableInfo = await db.all("PRAGMA table_info(users)");
    const columnNames = tableInfo.map(col => col.name);
    
    console.log('📋 Columnas actuales:', columnNames);
    
    // Agregar columnas si no existen
    if (!columnNames.includes('reset_token')) {
      console.log('➕ Agregando columna reset_token...');
      await db.exec('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255)');
      console.log('✅ Columna reset_token agregada');
    } else {
      console.log('ℹ️  Columna reset_token ya existe');
    }
    
    if (!columnNames.includes('reset_token_expires')) {
      console.log('➕ Agregando columna reset_token_expires...');
      await db.exec('ALTER TABLE users ADD COLUMN reset_token_expires DATETIME');
      console.log('✅ Columna reset_token_expires agregada');
    } else {
      console.log('ℹ️  Columna reset_token_expires ya existe');
    }
    
    console.log('\n✅ Base de datos actualizada correctamente\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    // No fallar si las columnas ya existen
    if (error.message.includes('duplicate column name')) {
      console.log('ℹ️  Las columnas ya existen, continuando...\n');
    }
  } finally {
    await db.close();
  }
}

addPasswordResetColumns();

import { db } from "../db/database.js";

export async function createUsersTable() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      user_type TEXT DEFAULT 'user',
      nombre TEXT,
      apellido TEXT,
      telefono TEXT,
      direccion TEXT,
      ciudad TEXT,
      foundation_name TEXT,
      foundation_description TEXT,
      foundation_phone TEXT,
      foundation_address TEXT,
      foundation_logo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log("Tabla 'users' creada o ya existe");
}

// Obtener fundación por ID
export async function getFoundationById(id) {
  return db.get(
    "SELECT id, username, email, user_type, foundation_name, foundation_description, foundation_phone, foundation_address, foundation_logo, created_at FROM users WHERE id = ? AND user_type = 'foundation'",
    [id]
  );
}

// Obtener todas las fundaciones
export async function getAllFoundations() {
  return db.all(
    "SELECT id, username, email, foundation_name, foundation_description, foundation_phone, foundation_address, foundation_logo, created_at FROM users WHERE user_type = 'foundation'"
  );
}

// Actualizar información de la fundación
export async function updateFoundation(id, data) {
  const { foundation_name, foundation_description, foundation_phone, foundation_address, foundation_logo } = data;
  return db.run(
    "UPDATE users SET foundation_name = ?, foundation_description = ?, foundation_phone = ?, foundation_address = ?, foundation_logo = ? WHERE id = ? AND user_type = 'foundation'",
    [foundation_name, foundation_description, foundation_phone, foundation_address, foundation_logo, id]
  );
}

// Obtener usuario por ID
export async function getUserById(id) {
  return db.get(
    "SELECT id, username, email, user_type, nombre, apellido, telefono, direccion, ciudad, created_at FROM users WHERE id = ?",
    [id]
  );
}

// Actualizar información del usuario
export async function updateUser(id, data) {
  const { nombre, apellido, telefono, direccion, ciudad } = data;
  
  // Construir la consulta dinámicamente solo con los campos proporcionados
  const updates = [];
  const values = [];
  
  if (nombre !== undefined) {
    updates.push('nombre = ?');
    values.push(nombre || null);
  }
  if (apellido !== undefined) {
    updates.push('apellido = ?');
    values.push(apellido || null);
  }
  if (telefono !== undefined) {
    updates.push('telefono = ?');
    values.push(telefono || null);
  }
  if (direccion !== undefined) {
    updates.push('direccion = ?');
    values.push(direccion || null);
  }
  if (ciudad !== undefined) {
    updates.push('ciudad = ?');
    values.push(ciudad || null);
  }
  
  if (updates.length === 0) {
    return { changes: 0 };
  }
  
  values.push(id);
  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  
  return db.run(query, values);
}

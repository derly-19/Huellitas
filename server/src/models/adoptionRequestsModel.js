import { db } from "../db/database.js";

// Crear tabla de solicitudes de adopción si no existe
export const createAdoptionRequestsTable = async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS adoption_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      
      -- Datos de la mascota
      pet_id INTEGER NOT NULL,
      pet_name TEXT NOT NULL,
      pet_type TEXT,
      
      -- Datos de la fundación
      foundation_id INTEGER NOT NULL,
      foundation_name TEXT,
      
      -- Datos del adoptante (usuario)
      user_id INTEGER NOT NULL,
      
      -- Información personal del adoptante
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      correo TEXT NOT NULL,
      telefono TEXT NOT NULL,
      
      -- Información del hogar
      direccion TEXT NOT NULL,
      tipo_vivienda TEXT NOT NULL,
      tiene_mascotas TEXT,
      
      -- Motivación
      motivacion TEXT NOT NULL,
      
      -- Estado y fechas
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      
      FOREIGN KEY (pet_id) REFERENCES pets(id),
      FOREIGN KEY (foundation_id) REFERENCES users(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log("Tabla adoption_requests verificada/creada");
};

// Crear una nueva solicitud de adopción
export const createAdoptionRequest = async (requestData) => {
  const {
    pet_id,
    pet_name,
    pet_type,
    foundation_id,
    foundation_name,
    user_id,
    nombre,
    apellido,
    correo,
    telefono,
    direccion,
    tipo_vivienda,
    tiene_mascotas,
    motivacion
  } = requestData;

  const result = await db.run(
    `INSERT INTO adoption_requests (
      pet_id, pet_name, pet_type, foundation_id, foundation_name,
      user_id, nombre, apellido, correo, telefono,
      direccion, tipo_vivienda, tiene_mascotas, motivacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pet_id, pet_name, pet_type, foundation_id, foundation_name,
      user_id, nombre, apellido, correo, telefono,
      direccion, tipo_vivienda, tiene_mascotas, motivacion
    ]
  );

  return result;
};

// Obtener todas las solicitudes de una fundación
export const getRequestsByFoundation = async (foundationId) => {
  const requests = await db.all(
    `SELECT ar.*, p.img as pet_img, p.breed as pet_breed, p.age as pet_age
     FROM adoption_requests ar
     LEFT JOIN pets p ON ar.pet_id = p.id
     WHERE ar.foundation_id = ?
     ORDER BY ar.created_at DESC`,
    [foundationId]
  );
  return requests;
};

// Obtener solicitudes por estado
export const getRequestsByStatus = async (foundationId, status) => {
  const requests = await db.all(
    `SELECT ar.*, p.img as pet_img, p.breed as pet_breed, p.age as pet_age
     FROM adoption_requests ar
     LEFT JOIN pets p ON ar.pet_id = p.id
     WHERE ar.foundation_id = ? AND ar.status = ?
     ORDER BY ar.created_at DESC`,
    [foundationId, status]
  );
  return requests;
};

// Obtener una solicitud por ID
export const getRequestById = async (requestId) => {
  const request = await db.get(
    `SELECT ar.*, p.img as pet_img, p.breed as pet_breed, p.age as pet_age, p.size as pet_size, p.description as pet_description
     FROM adoption_requests ar
     LEFT JOIN pets p ON ar.pet_id = p.id
     WHERE ar.id = ?`,
    [requestId]
  );
  return request;
};

// Obtener solicitudes por mascota
export const getRequestsByPet = async (petId) => {
  const requests = await db.all(
    `SELECT * FROM adoption_requests WHERE pet_id = ? ORDER BY created_at DESC`,
    [petId]
  );
  return requests;
};

// Verificar si un usuario ya tiene una solicitud pendiente para una mascota
export const checkExistingRequest = async (userId, petId) => {
  const existing = await db.get(
    `SELECT * FROM adoption_requests 
     WHERE user_id = ? AND pet_id = ? AND status = 'pending'`,
    [userId, petId]
  );
  return existing;
};

// Actualizar el estado de una solicitud
export const updateRequestStatus = async (requestId, status, notes = null) => {
  const result = await db.run(
    `UPDATE adoption_requests 
     SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [status, notes, requestId]
  );
  return result;
};

// Eliminar una solicitud
export const deleteRequest = async (requestId) => {
  const result = await db.run(
    `DELETE FROM adoption_requests WHERE id = ?`,
    [requestId]
  );
  return result;
};

// Contar solicitudes por fundación
export const countRequestsByFoundation = async (foundationId) => {
  const counts = await db.get(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
     FROM adoption_requests 
     WHERE foundation_id = ?`,
    [foundationId]
  );
  return counts;
};

// Obtener solicitudes de un usuario
export const getRequestsByUser = async (userId) => {
  const requests = await db.all(
    `SELECT ar.*, p.img as pet_img
     FROM adoption_requests ar
     LEFT JOIN pets p ON ar.pet_id = p.id
     WHERE ar.user_id = ?
     ORDER BY ar.created_at DESC`,
    [userId]
  );
  return requests;
};

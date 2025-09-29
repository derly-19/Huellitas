import { db } from "../db/database.js";

// Función para crear la tabla de mascotas si no existe
export async function createPetsTable() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,           -- 'dog' o 'cat'
      img TEXT NOT NULL,            -- ruta de la imagen
      description TEXT,
      age TEXT,                     -- 'Cachorro', 'Joven', 'Adulto'
      size TEXT,                    -- 'Pequeño', 'Mediano', 'Grande'
      sex TEXT,                     -- 'Macho', 'Hembra'
      foundation TEXT,              -- nombre de la fundación
      available BOOLEAN DEFAULT 1,  -- 1 = disponible, 0 = adoptado
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Tabla 'pets' creada o ya existe");
}

// Función para obtener todas las mascotas
export async function getAllPets() {
  return db.all("SELECT * FROM pets WHERE available = 1 ORDER BY created_at DESC");
}

// Función para obtener mascotas por tipo (dog o cat)
export async function getPetsByType(type) {
  return db.all("SELECT * FROM pets WHERE type = ? AND available = 1 ORDER BY created_at DESC", type);
}

// Función para obtener una mascota por ID
export async function getPetById(id) {
  return db.get("SELECT * FROM pets WHERE id = ? AND available = 1", id);
}

// Función para crear una nueva mascota
export async function createPet(name, type, img, description, age, size, sex, foundation) {
  const result = await db.run(
    "INSERT INTO pets (name, type, img, description, age, size, sex, foundation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, type, img, description, age, size, sex, foundation]
  );
  return { id: result.lastID, name, type, img, description, age, size, sex, foundation, available: 1 };
}

// Función para marcar una mascota como adoptada
export async function markPetAsAdopted(id) {
  return db.run("UPDATE pets SET available = 0 WHERE id = ?", id);
}

// Función para insertar datos iniciales (migración de datos hardcodeados)
export async function insertInitialPets() {
  // Verificar si ya hay datos
  const existingPets = await db.get("SELECT COUNT(*) as count FROM pets");
  if (existingPets.count > 0) {
    console.log("Ya existen mascotas en la base de datos");
    return;
  }

  // Datos de perros (tomados de Dogs.jsx)
  const dogs = [
    {
      name: "Bella",
      type: "dog",
      img: "/src/assets/p1.jpg",
      description: "Bella es una perrita tranquila, le encanta jugar y busca un hogar lleno de cariño.",
      age: "Cachorro",
      size: "Pequeño",
      sex: "Hembra",
      foundation: "Huellitas de Amor"
    },
    {
      name: "Rocky",
      type: "dog", 
      img: "/src/assets/p2.jpg",
      description: "Rocky es un perro lleno de energía, ideal para familias activas.",
      age: "Adulto",
      size: "Grande",
      sex: "Macho",
      foundation: "Corazón Canino"
    },
    {
      name: "Nina",
      type: "dog",
      img: "/src/assets/p3.jpg", 
      description: "Nina es amorosa y muy sociable, perfecta para cualquier familia.",
      age: "Joven",
      size: "Mediano",
      sex: "Hembra",
      foundation: "Refugio Esperanza"
    },
    {
      name: "Max",
      type: "dog",
      img: "/src/assets/p4.jpg",
      description: "Max es juguetón y muy noble, siempre está listo para recibir cariño.",
      age: "Cachorro", 
      size: "Grande",
      sex: "Macho",
      foundation: "Amigos de 4 Patas"
    },
    {
      name: "Toby",
      type: "dog",
      img: "/src/assets/p5.jpg",
      description: "Toby es tranquilo, le gusta descansar y disfrutar de la compañía.",
      age: "Adulto",
      size: "Mediano", 
      sex: "Macho",
      foundation: "Patitas Felices"
    }
  ];

  // Datos de gatos (tomados de Cats.jsx)
  const cats = [
    {
      name: "Luna",
      type: "cat",
      img: "/src/assets/g1.jpg",
      description: "Luna es dulce y tranquila, disfruta acurrucarse en lugares soleados.",
      age: "Joven",
      size: "Pequeño",
      sex: "Hembra", 
      foundation: "Patitas de Amor"
    },
    {
      name: "Simba",
      type: "cat",
      img: "/src/assets/g2.jpg",
      description: "Simba es curioso y muy juguetón, le encanta explorar.",
      age: "Cachorro",
      size: "Mediano",
      sex: "Macho",
      foundation: "Gatitos Felices"
    },
    {
      name: "Misu", 
      type: "cat",
      img: "/src/assets/g3.jpg",
      description: "Misu es independiente, pero adora las caricias cuando tiene confianza.",
      age: "Adulto",
      size: "Mediano",
      sex: "Hembra",
      foundation: "Refugio Esperanza"
    },
    {
      name: "Oliver",
      type: "cat", 
      img: "/src/assets/g4.jpg",
      description: "Oliver es cariñoso y busca una familia que lo mime mucho.",
      age: "Joven",
      size: "Grande", 
      sex: "Macho",
      foundation: "Amigos Felinos"
    },
    {
      name: "Mía",
      type: "cat",
      img: "/src/assets/g5.jpg", 
      description: "Mía es juguetona y siempre está lista para una aventura.",
      age: "Cachorro",
      size: "Pequeño",
      sex: "Hembra",
      foundation: "Refugio Gatuno"
    }
  ];

  // Insertar todos los perros y gatos
  const allPets = [...dogs, ...cats];
  
  for (const pet of allPets) {
    await db.run(
      "INSERT INTO pets (name, type, img, description, age, size, sex, foundation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [pet.name, pet.type, pet.img, pet.description, pet.age, pet.size, pet.sex, pet.foundation]
    );
  }
  
  console.log(`Se insertaron ${allPets.length} mascotas en la base de datos`);
}
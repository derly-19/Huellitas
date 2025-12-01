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
      foundation_id INTEGER,        -- ID de la fundación (usuario tipo fundación)
      available BOOLEAN DEFAULT 1,  -- 1 = disponible, 0 = adoptado
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (foundation_id) REFERENCES users(id)
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

// Función para obtener una mascota por ID (incluyendo no disponibles - para fundaciones)
export async function getPetByIdAdmin(id) {
  return db.get("SELECT * FROM pets WHERE id = ?", id);
}

// Función para crear una nueva mascota
export async function createPet(name, type, img, description, age, size, sex, foundation, foundation_id = null) {
  const result = await db.run(
    "INSERT INTO pets (name, type, img, description, age, size, sex, foundation, foundation_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [name, type, img, description, age, size, sex, foundation, foundation_id]
  );
  return { id: result.lastID, name, type, img, description, age, size, sex, foundation, foundation_id, available: 1 };
}

// Función para actualizar una mascota
export async function updatePet(id, data) {
  const { name, type, img, description, age, size, sex } = data;
  return db.run(
    "UPDATE pets SET name = ?, type = ?, img = ?, description = ?, age = ?, size = ?, sex = ? WHERE id = ?",
    [name, type, img, description, age, size, sex, id]
  );
}

// Función para marcar una mascota como adoptada
export async function markPetAsAdopted(id) {
  return db.run("UPDATE pets SET available = 0 WHERE id = ?", id);
}

// Función para reactivar una mascota (ponerla de nuevo en adopción)
export async function markPetAsAvailable(id) {
  return db.run("UPDATE pets SET available = 1 WHERE id = ?", id);
}

// Función para actualizar la disponibilidad de una mascota
export async function updatePetAvailability(id, available) {
  return db.run("UPDATE pets SET available = ? WHERE id = ?", [available ? 1 : 0, id]);
}

// Función para obtener mascotas de una fundación específica
export async function getPetsByFoundationId(foundationId) {
  return db.all(
    "SELECT * FROM pets WHERE foundation_id = ? ORDER BY created_at DESC",
    [foundationId]
  );
}

// Función para eliminar una mascota
export async function deletePet(id) {
  return db.run("DELETE FROM pets WHERE id = ?", id);
}

// Función para insertar datos iniciales (migración de datos hardcodeados)
export async function insertInitialPets() {
  // Verificar si ya hay datos
  const existingPets = await db.get("SELECT COUNT(*) as count FROM pets");
  if (existingPets.count > 0) {
    console.log("Ya existen mascotas en la base de datos");
    // Asignar foundation_id a mascotas que no lo tienen
    await assignFoundationIdsToPets();
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
    },
    {
      name: "Zeus",
      type: "dog",
      img: "/src/assets/p6.jpg",
      description: "Zeus es un perro guardián leal y protector, ideal para casas grandes.",
      age: "Adulto",
      size: "Grande",
      sex: "Macho",
      foundation: "Huellitas de Amor"
    },
    {
      name: "Luna",
      type: "dog",
      img: "/src/assets/p7.jpg",
      description: "Luna es cariñosa y juguetona, le encanta correr en el parque.",
      age: "Joven",
      size: "Mediano",
      sex: "Hembra",
      foundation: "Corazón Canino"
    },
    {
      name: "Bruno",
      type: "dog",
      img: "/src/assets/p8.jpg",
      description: "Bruno es tranquilo y obediente, perfecto para personas mayores.",
      age: "Adulto",
      size: "Grande",
      sex: "Macho",
      foundation: "Refugio Esperanza"
    },
    {
      name: "Coco",
      type: "dog",
      img: "/src/assets/p9.jpg",
      description: "Coco es pequeña pero valiente, adora jugar con niños.",
      age: "Cachorro",
      size: "Pequeño",
      sex: "Hembra",
      foundation: "Amigos de 4 Patas"
    },
    {
      name: "Duke",
      type: "dog",
      img: "/src/assets/p10.jpg",
      description: "Duke es enérgico y atlético, necesita ejercicio diario.",
      age: "Joven",
      size: "Grande",
      sex: "Macho",
      foundation: "Patitas Felices"
    },
    {
      name: "Lola",
      type: "dog",
      img: "/src/assets/p11.jpg",
      description: "Lola es dulce y amorosa, le gusta estar en familia.",
      age: "Cachorro",
      size: "Pequeño",
      sex: "Hembra",
      foundation: "Huellitas de Amor"
    },
    {
      name: "Rex",
      type: "dog",
      img: "/src/assets/p12.jpg",
      description: "Rex es inteligente y fácil de entrenar, ideal para primera mascota.",
      age: "Joven",
      size: "Mediano",
      sex: "Macho",
      foundation: "Corazón Canino"
    },
    {
      name: "Kira",
      type: "dog",
      img: "/src/assets/p13.jpg",
      description: "Kira es activa y sociable, perfecta para familias con niños.",
      age: "Joven",
      size: "Mediano",
      sex: "Hembra",
      foundation: "Refugio Esperanza"
    },
    {
      name: "Rocco",
      type: "dog",
      img: "/src/assets/p14.jpg",
      description: "Rocco es protector y leal, siempre cuida a su familia.",
      age: "Adulto",
      size: "Grande",
      sex: "Macho",
      foundation: "Amigos de 4 Patas"
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
    },
    {
      name: "Felix",
      type: "cat",
      img: "/src/assets/g6.jpg",
      description: "Felix es tranquilo y le gusta observar desde lugares altos.",
      age: "Adulto",
      size: "Mediano",
      sex: "Macho",
      foundation: "Patitas de Amor"
    },
    {
      name: "Nala",
      type: "cat",
      img: "/src/assets/g7.jpg",
      description: "Nala es elegante y cariñosa, busca un hogar tranquilo.",
      age: "Joven",
      size: "Pequeño",
      sex: "Hembra",
      foundation: "Gatitos Felices"
    },
    {
      name: "Tom",
      type: "cat",
      img: "/src/assets/g8.jpg",
      description: "Tom es aventurero y curioso, le encanta explorar.",
      age: "Cachorro",
      size: "Mediano",
      sex: "Macho",
      foundation: "Refugio Esperanza"
    },
    {
      name: "Bella",
      type: "cat",
      img: "/src/assets/g9.jpg",
      description: "Bella es mimosa y ronronea mucho, adora las caricias.",
      age: "Joven",
      size: "Pequeño",
      sex: "Hembra",
      foundation: "Amigos Felinos"
    },
    {
      name: "Garfield",
      type: "cat",
      img: "/src/assets/g10.jpg",
      description: "Garfield es tranquilo y le encanta dormir largas siestas.",
      age: "Adulto",
      size: "Grande",
      sex: "Macho",
      foundation: "Refugio Gatuno"
    },
    {
      name: "Cleo",
      type: "cat",
      img: "/src/assets/g11.jpg",
      description: "Cleo es independiente pero cariñosa cuando quiere mimos.",
      age: "Joven",
      size: "Mediano",
      sex: "Hembra",
      foundation: "Patitas de Amor"
    },
    {
      name: "Tigre",
      type: "cat",
      img: "/src/assets/g12.jpg",
      description: "Tigre es juguetón y le encanta perseguir juguetes.",
      age: "Cachorro",
      size: "Pequeño",
      sex: "Macho",
      foundation: "Gatitos Felices"
    },
    {
      name: "Pelusa",
      type: "cat",
      img: "/src/assets/g13.jpg",
      description: "Pelusa es esponjosa y dulce, perfecta para abrazar.",
      age: "Joven",
      size: "Mediano",
      sex: "Hembra",
      foundation: "Refugio Esperanza"
    },
    {
      name: "Michi",
      type: "cat",
      img: "/src/assets/g14.jpg",
      description: "Michi es sociable y le gusta estar con la familia.",
      age: "Adulto",
      size: "Mediano",
      sex: "Macho",
      foundation: "Amigos Felinos"
    },
    {
      name: "Kitty",
      type: "cat",
      img: "/src/assets/g15.jpg",
      description: "Kitty es pequeña y juguetona, adora los ratones de juguete.",
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
  
  // Asignar foundation_id a las mascotas recién insertadas
  await assignFoundationIdsToPets();
}

// Función para asignar foundation_id a mascotas que no lo tienen
async function assignFoundationIdsToPets() {
  try {
    // Mapeo de nombres de fundaciones a IDs (asumiendo que hay usuarios tipo fundación)
    // Por ahora, vamos a asignar un ID genérico (2) que debe ser una fundación
    // En producción, esto debería hacerse correctamente con fundaciones reales
    
    const petsWithoutFoundation = await db.all(
      "SELECT * FROM pets WHERE foundation_id IS NULL"
    );
    
    if (petsWithoutFoundation.length === 0) {
      return;
    }
    
    console.log(`🏥 Asignando foundation_id a ${petsWithoutFoundation.length} mascotas...`);
    
    // Asignar foundation_id = 2 a todas las mascotas sin fundación
    // (En un sistema real, buscaríamos la fundación por nombre)
    for (const pet of petsWithoutFoundation) {
      await db.run(
        "UPDATE pets SET foundation_id = ? WHERE id = ?",
        [2, pet.id]
      );
    }
    
    console.log(`✅ Foundation_id asignado a todas las mascotas`);
  } catch (error) {
    console.error("Error asignando foundation_id:", error);
  }
}
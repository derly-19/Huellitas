import { db } from "../db/database.js";

async function createMissingCarnets() {
  try {
    console.log("🐾 Buscando mascotas sin carnet...");
    
    // Obtener todas las mascotas
    const pets = await db.all("SELECT id, name FROM pets");
    console.log(`📊 Total de mascotas: ${pets.length}`);
    
    let created = 0;
    let skipped = 0;
    
    for (const pet of pets) {
      // Verificar si ya tiene carnet
      const existingCarnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [pet.id]);
      
      if (!existingCarnet) {
        try {
          const result = await db.run("INSERT INTO carnet (pet_id) VALUES (?)", [pet.id]);
          console.log(`✅ Carnet creado para ${pet.name} (Pet ID: ${pet.id}, Carnet ID: ${result.lastID})`);
          created++;
        } catch (error) {
          console.error(`❌ Error al crear carnet para ${pet.name}:`, error.message);
        }
      } else {
        console.log(`⏭️  ${pet.name} ya tiene carnet (Carnet ID: ${existingCarnet.id})`);
        skipped++;
      }
    }
    
    console.log("\n📋 RESUMEN:");
    console.log(`✅ Carnets creados: ${created}`);
    console.log(`⏭️  Carnets existentes: ${skipped}`);
    console.log(`📊 Total procesado: ${created + skipped}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
}

createMissingCarnets();

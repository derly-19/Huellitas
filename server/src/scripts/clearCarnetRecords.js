import { db } from "../db/database.js";

async function clearAllCarnetRecords() {
  try {
    console.log("🧹 Limpiando todos los registros del carnet...");

    // Eliminar todos los registros de las tablas del carnet
    await db.run("DELETE FROM carnet_vacunas");
    console.log("✅ Vacunas eliminadas");

    await db.run("DELETE FROM carnet_desparasitaciones");
    console.log("✅ Desparasitaciones eliminadas");

    await db.run("DELETE FROM carnet_banos");
    console.log("✅ Baños eliminados");

    await db.run("DELETE FROM carnet_procedimientos");
    console.log("✅ Procedimientos eliminados");

    await db.run("DELETE FROM carnet_medicamentos");
    console.log("✅ Medicamentos eliminados");

    console.log("\n✨ Todos los registros del carnet han sido eliminados exitosamente");
    console.log("📋 Los carnets de las mascotas ahora están vacíos y listos para nuevos registros");

  } catch (error) {
    console.error("❌ Error al limpiar registros:", error);
  } finally {
    process.exit(0);
  }
}

clearAllCarnetRecords();

import { db } from "../db/database.js";

async function fixVisitDates() {
  try {
    // Ver todas las visitas
    const visits = await db.all("SELECT * FROM visits");
    console.log("Visitas actuales:");
    console.log(JSON.stringify(visits, null, 2));

    // Arreglar fechas que empiezan con 2202
    for (const visit of visits) {
      if (visit.scheduled_date && visit.scheduled_date.startsWith('2202')) {
        const newDate = visit.scheduled_date.substring(1);
        console.log(`Arreglando visita ${visit.id}: ${visit.scheduled_date} -> ${newDate}`);
        await db.run(
          "UPDATE visits SET scheduled_date = ? WHERE id = ?",
          [newDate, visit.id]
        );
      }
    }

    // Ver resultado
    const updatedVisits = await db.all("SELECT * FROM visits");
    console.log("\nVisitas actualizadas:");
    console.log(JSON.stringify(updatedVisits, null, 2));

  } catch (err) {
    console.error("Error:", err);
  }
}

fixVisitDates();

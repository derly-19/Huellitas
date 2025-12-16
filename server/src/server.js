import app from "./app.js";
import cron from "node-cron";
import { runDailyReminderCheck } from "./services/reminderService.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
  
  // Configurar cron job para recordatorios
  // Se ejecuta todos los días a las 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Ejecutando verificación diaria de recordatorios...');
    try {
      await runDailyReminderCheck();
      console.log('✅ Verificación de recordatorios completada');
    } catch (error) {
      console.error('❌ Error en verificación de recordatorios:', error);
    }
  }, {
    timezone: "America/Bogota"
  });
  
  console.log('📅 Cron job de recordatorios configurado (8:00 AM diario)');
});


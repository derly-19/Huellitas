import { runDailyReminderCheck } from '../services/reminderService.js';

/**
 * Script para ejecutar manualmente la verificación de recordatorios
 * Útil para testing sin esperar al cron job diario
 */

async function checkReminders() {
  try {
    console.log('🔄 Iniciando verificación de recordatorios...\n');
    
    const result = await runDailyReminderCheck();
    
    console.log('\n✅ Verificación completada');
    console.log('\n📊 Resumen:');
    console.log(`   • Mascotas procesadas: ${result.petsProcessed || 0}`);
    console.log(`   • Recordatorios generados: ${result.remindersCreated || 0}`);
    console.log(`   • Emails enviados: ${result.emailsSent || 0}`);
    console.log(`   • Errores: ${result.errors || 0}`);
    
    if (result.details && result.details.length > 0) {
      console.log('\n📋 Detalles:');
      result.details.forEach((detail, index) => {
        console.log(`   ${index + 1}. ${detail}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al verificar recordatorios:', error);
    process.exit(1);
  }
}

checkReminders();

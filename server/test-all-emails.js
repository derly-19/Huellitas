import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { 
  sendPasswordChangeEmail,
  sendContactedNotificationEmail,
  sendAdoptionApprovedEmail,
  sendAdoptionRejectedEmail
} from './src/services/emailService.js';

dotenv.config();

async function testAllEmails() {
  console.log('🧪 Iniciando prueba de TODOS los tipos de correos...\n');

  const testEmail = process.env.EMAIL_USER;
  console.log(`📧 Email de destino: ${testEmail}\n`);

  try {
    // 1. Correo de cambio de contraseña
    console.log('1️⃣  Enviando correo de cambio de contraseña...');
    const now = new Date().toLocaleString('es-CO');
    await sendPasswordChangeEmail({
      email: testEmail,
      username: 'TestUser',
      changeDate: now
    });
    console.log('✅ Correo de cambio de contraseña enviado\n');

    // 2. Correo de contacto (la fundación se ha puesto en contacto)
    console.log('2️⃣  Enviando correo de notificación de contacto...');
    await sendContactedNotificationEmail({
      adoptedByEmail: testEmail,
      adoptedByName: 'Juan Pérez',
      petName: 'Bella',
      foundationName: 'Fundación Huellitas Felices',
      message: 'Nos gustaría agendar una cita para hablar sobre tu solicitud de adopción.'
    });
    console.log('✅ Correo de contacto enviado\n');

    // 3. Correo de aprobación
    console.log('3️⃣  Enviando correo de solicitud aprobada...');
    await sendAdoptionApprovedEmail({
      adoptedByEmail: testEmail,
      adoptedByName: 'Juan Pérez',
      petName: 'Bella',
      foundationName: 'Fundación Huellitas Felices',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    });
    console.log('✅ Correo de aprobación enviado\n');

    // 4. Correo de rechazo
    console.log('4️⃣  Enviando correo de solicitud rechazada...');
    await sendAdoptionRejectedEmail({
      adoptedByEmail: testEmail,
      adoptedByName: 'Juan Pérez',
      petName: 'Bella',
      foundationName: 'Fundación Huellitas Felices',
      reason: 'Lamentablemente, tu perfil no cumple con los requisitos para esta mascota en particular.'
    });
    console.log('✅ Correo de rechazo enviado\n');

    console.log('='*50);
    console.log('🎉 ¡Todos los correos se enviaron exitosamente!');
    console.log('='*50);
    console.log('\n📋 Resumen de correos enviados:');
    console.log('  ✓ Notificación de cambio de contraseña');
    console.log('  ✓ Notificación de contacto de fundación');
    console.log('  ✓ Solicitud de adopción aprobada');
    console.log('  ✓ Solicitud de adopción rechazada\n');

  } catch (error) {
    console.error('❌ Error al enviar correos:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

testAllEmails();

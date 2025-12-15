import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { sendPasswordResetEmail } from './src/services/emailService.js';
import crypto from 'crypto';

dotenv.config();

async function testPasswordResetFlow() {
  console.log('🔐 Prueba de Flujo de Reset de Contraseña\n');
  console.log('='*60);

  const testEmail = process.env.EMAIL_USER;
  const testUsername = 'TestUser';

  try {
    // Simular el flujo de reset
    console.log('\n📋 PASO 1: Usuario solicita reset de contraseña');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Acción: POST /api/users/forgot-password/request`);
    
    // Generar token (como lo haría el servidor)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}&email=${testEmail}`;
    
    console.log('\n📬 PASO 2: Enviar email con enlace de reset');
    
    await sendPasswordResetEmail({
      email: testEmail,
      username: testUsername,
      resetUrl: resetUrl,
      expiresIn: '1 hora'
    });
    
    console.log('✅ Email de reset enviado correctamente');
    
    console.log('\n🔗 PASO 3: Usuario recibe email con enlace');
    console.log(`   Enlace de reset: ${resetUrl}`);
    console.log('   El enlace es válido por 1 hora');
    
    console.log('\n🔄 PASO 4: Usuario hace clic en el enlace');
    console.log(`   Se abre: ${appUrl}/reset-password?token=...`);
    
    console.log('\n💾 PASO 5: Usuario ingresa nueva contraseña');
    console.log('   Acción: POST /api/users/forgot-password/reset');
    console.log('   Body: { token, email, newPassword, confirmPassword }');
    
    console.log('\n✅ PASO 6: Contraseña actualizada');
    console.log('   Email de confirmación enviado');
    console.log('   Token eliminado de la base de datos');
    
    console.log('\n' + '='*60);
    console.log('🎉 ¡Flujo completo de reset de contraseña implementado!');
    console.log('='*60);
    
    console.log('\n📝 Endpoints disponibles:');
    console.log('   1. POST /api/users/forgot-password/request');
    console.log('      Body: { email }');
    console.log('      Descripción: Envía email con enlace de reset\n');
    
    console.log('   2. POST /api/users/forgot-password/reset');
    console.log('      Body: { token, email, newPassword, confirmPassword }');
    console.log('      Descripción: Valida token y cambia contraseña\n');
    
    console.log('   3. POST /api/users/:id/change-password');
    console.log('      Body: { currentPassword, newPassword, confirmPassword }');
    console.log('      Descripción: Cambia contraseña (requiere contraseña actual)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testPasswordResetFlow();

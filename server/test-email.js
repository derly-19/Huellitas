import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('🧪 Iniciando prueba de envío de correo...\n');

  // Mostrar configuración
  console.log('📋 Configuración detectada:');
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`   EMAIL_SERVICE: ${process.env.EMAIL_SERVICE}`);
  console.log(`   EMAIL_DEV_MODE: ${process.env.EMAIL_DEV_MODE}`);
  console.log(`   EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME}\n`);

  // Si está en modo dev, lo decimos
  if (process.env.EMAIL_DEV_MODE === 'true') {
    console.log('⚠️  MODO DESARROLLO ACTIVO - Los emails NO se enviarán realmente\n');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('🔌 Verificando conexión con el servidor de correo...');
    await transporter.verify();
    console.log('✅ Conexión exitosa!\n');

    // Preparar email de prueba
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
      to: process.env.EMAIL_USER, // Enviamos a nosotros mismos para la prueba
      subject: '🧪 Email de Prueba - Huellitas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
            <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
            <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #27ae60;">✅ ¡Prueba de Email Exitosa!</h2>
            
            <p>Este es un email de prueba para verificar que el sistema de correos está funcionando correctamente.</p>
            
            <div style="background-color: #ecf0f1; padding: 15px; border-left: 4px solid #27ae60; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Hora:</strong> ${new Date().toLocaleString('es-CO')}</p>
              <p style="margin: 5px 0;"><strong>Sistema:</strong> Huellitas - Sistema de Adopción</p>
              <p style="margin: 5px 0;"><strong>Estado:</strong> Funcionando correctamente ✅</p>
            </div>
            
            <p>Si recibiste este email, significa que la configuración está correcta y los emails se enviarán normalmente.</p>
            
            <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
              Este es un email de prueba automático.
            </p>
          </div>
        </div>
      `,
    };

    console.log('📤 Enviando email de prueba...');
    console.log(`   Para: ${mailOptions.to}`);
    console.log(`   Asunto: ${mailOptions.subject}\n`);

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ ¡EMAIL ENVIADO EXITOSAMENTE!');
    console.log(`   ID del mensaje: ${info.messageId}`);
    console.log(`   Respuesta del servidor: ${info.response}`);
    console.log('\n🎉 El sistema de correos está funcionando correctamente.\n');

  } catch (error) {
    console.error('❌ Error al enviar el email:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === 'EAUTH') {
      console.error('💡 Sugerencia: Verifica que las credenciales de email sean correctas.');
      console.error('   Si usas Gmail, necesitas una "contraseña de aplicación" y no tu contraseña de cuenta.\n');
    } else if (error.code === 'ESOCKET') {
      console.error('💡 Sugerencia: Verifica tu conexión a internet o la configuración del firewall.\n');
    }
    
    process.exit(1);
  }
}

testEmail();

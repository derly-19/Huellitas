import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Crear transporte de correo
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Enviar correo genérico
export const sendEmail = async (to, subject, htmlContent) => {
  // Si está en modo desarrollo, solo simular
  if (process.env.EMAIL_DEV_MODE === 'true') {
    console.log('📧 [DEV MODE] Email que se enviaría:');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Content: ${htmlContent}`);
    return { success: true, message: 'Email simulado en modo desarrollo' };
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado a ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error enviando email a ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Plantilla: Solicitud de adopción recibida
export const sendAdoptionRequestEmail = async (adoptionData) => {
  const { adoptedByEmail, adoptedByName, petName, foundationName } = adoptionData;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
        <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
        <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #2c3e50;">¡Tu solicitud ha sido recibida!</h2>
        
        <p>Hola <strong>${adoptedByName}</strong>,</p>
        
        <p>Nos alegra mucho informarte que tu solicitud de adopción para <strong>${petName}</strong> 
        ha sido recibida correctamente por <strong>${foundationName}</strong>.</p>
        
        <div style="background-color: #ecf0f1; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Mascota:</strong> ${petName}</p>
          <p style="margin: 5px 0;"><strong>Fundación:</strong> ${foundationName}</p>
          <p style="margin: 5px 0;"><strong>Estado:</strong> En revisión</p>
        </div>
        
        <p>La fundación revisará tu solicitud pronto. Te notificaremos cuando haya novedades.</p>
        
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
          Este es un email automático, por favor no responder. Si tienes preguntas, 
          contacta directamente a través de la plataforma.
        </p>
      </div>
    </div>
  `;

  return sendEmail(adoptedByEmail, `Solicitud de adopción recibida - ${petName}`, htmlContent);
};

// Plantilla: Solicitud de adopción aprobada
export const sendAdoptionApprovedEmail = async (adoptionData) => {
  const { adoptedByEmail, adoptedByName, petName, foundationName, appUrl } = adoptionData;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
        <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
        <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #27ae60;">¡Tu solicitud ha sido aprobada! ✅</h2>
        
        <p>Hola <strong>${adoptedByName}</strong>,</p>
        
        <p>¡Felicidades! Tu solicitud de adopción para <strong>${petName}</strong> 
        ha sido <strong style="color: #27ae60;">aprobada</strong> por <strong>${foundationName}</strong>.</p>
        
        <div style="background-color: #d5f4e6; padding: 15px; border-left: 4px solid #27ae60; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>🎉 Estado:</strong> Aprobada</p>
          <p style="margin: 5px 0;">Ya puedes contactar a la fundación para coordinar la entrega.</p>
        </div>
        
        <p>
          <a href="${appUrl}/misolicitudes" style="display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Ver más detalles
          </a>
        </p>
        
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
          Este es un email automático, por favor no responder. Si tienes preguntas, 
          contacta directamente a través de la plataforma.
        </p>
      </div>
    </div>
  `;

  return sendEmail(adoptedByEmail, `¡Tu solicitud fue aprobada! - ${petName}`, htmlContent);
};

// Plantilla: Solicitud de adopción rechazada
export const sendAdoptionRejectedEmail = async (adoptionData) => {
  const { adoptedByEmail, adoptedByName, petName, foundationName, reason } = adoptionData;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
        <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
        <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #2c3e50;">Actualización sobre tu solicitud</h2>
        
        <p>Hola <strong>${adoptedByName}</strong>,</p>
        
        <p>Lamentablemente, tu solicitud de adopción para <strong>${petName}</strong> 
        no ha sido aprobada en esta ocasión por <strong>${foundationName}</strong>.</p>
        
        ${reason ? `<div style="background-color: #ffe6e6; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Motivo:</strong> ${reason}</p>
        </div>` : ''}
        
        <p>No te desanimes, hay muchas más mascotas que necesitan un hogar amoroso. 
        ¡Síguenos para conocer nuevas oportunidades de adopción!</p>
        
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
          Este es un email automático, por favor no responder. Si tienes preguntas, 
          contacta directamente a través de la plataforma.
        </p>
      </div>
    </div>
  `;

  return sendEmail(adoptedByEmail, `Actualización de tu solicitud - ${petName}`, htmlContent);
};

// Plantilla: Notificación de visita de seguimiento
export const sendFollowUpVisitEmail = async (visitData) => {
  const { adoptedByEmail, adoptedByName, petName, visitDate, location } = visitData;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
        <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
        <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #2c3e50;">📅 Visita de seguimiento programada</h2>
        
        <p>Hola <strong>${adoptedByName}</strong>,</p>
        
        <p>Te informamos que hemos programado una visita de seguimiento para verificar 
        que <strong>${petName}</strong> se está adaptando perfectamente a su nuevo hogar.</p>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>📅 Fecha:</strong> ${visitDate}</p>
          <p style="margin: 5px 0;"><strong>📍 Ubicación:</strong> ${location}</p>
          <p style="margin: 5px 0;"><strong>🐾 Mascota:</strong> ${petName}</p>
        </div>
        
        <p>Por favor confirma tu disponibilidad. Si necesitas cambiar la fecha, 
        contáctanos lo antes posible.</p>
        
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
          Este es un email automático, por favor no responder. Si tienes preguntas, 
          contacta directamente a través de la plataforma.
        </p>
      </div>
    </div>
  `;

  return sendEmail(adoptedByEmail, `Visita de seguimiento programada - ${petName}`, htmlContent);
};

// Plantilla: Notificación de contacto de fundación
export const sendContactedNotificationEmail = async (contactData) => {
  const { adoptedByEmail, adoptedByName, petName, foundationName, message } = contactData;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
        <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
        <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #3498db;">📞 ¡Se han puesto en contacto contigo!</h2>
        
        <p>Hola <strong>${adoptedByName}</strong>,</p>
        
        <p><strong>${foundationName}</strong> se ha puesto en contacto contigo sobre tu solicitud de adopción para <strong>${petName}</strong>.</p>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>🐾 Mascota:</strong> ${petName}</p>
          <p style="margin: 5px 0;"><strong>🏢 Fundación:</strong> ${foundationName}</p>
          <p style="margin: 5px 0;"><strong>📝 Mensaje:</strong> ${message || 'Pronto tendremos más información para ti'}</p>
        </div>
        
        <p>Por favor, mantente atento a los mensajes y llamadas de la fundación. 
        ¡Estamos cerca de que conozcas a tu nuevo amigo peludo! 🐾</p>
        
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
          Este es un email automático, por favor no responder. Si tienes preguntas, 
          contacta directamente a través de la plataforma.
        </p>
      </div>
    </div>
  `;

  return sendEmail(adoptedByEmail, `La fundación se ha puesto en contacto - ${petName}`, htmlContent);
};

// Plantilla: Cambio de contraseña
export const sendPasswordChangeEmail = async (userData) => {
  const { email, username, changeDate } = userData;
  
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5;">
      <!-- Header con gradiente -->
      <div style="background: linear-gradient(135deg, #BCC990 0%, #8FA875 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <div style="background-color: white; width: 80px; height: 80px; margin: 0 auto 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <span style="font-size: 40px;">🔒</span>
        </div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🐾 Huellitas</h1>
        <p style="color: rgba(255,255,255,0.95); margin: 8px 0 0 0; font-size: 14px; font-weight: 300;">Plataforma de Adopción de Mascotas</p>
      </div>
      
      <!-- Contenido principal -->
      <div style="padding: 40px 30px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Tu contraseña ha sido cambiada</h2>
          <p style="color: #7f8c8d; margin: 0; font-size: 16px;">Confirmación de seguridad</p>
        </div>
        
        <p style="color: #555; line-height: 1.6; font-size: 15px;">Hola <strong style="color: #2c3e50;">${username}</strong>,</p>
        
        <p style="color: #555; line-height: 1.6; font-size: 15px;">Confirmamos que tu contraseña ha sido cambiada exitosamente.</p>
        
        <!-- Información de la cuenta con diseño mejorado -->
        <div style="background: linear-gradient(135deg, #fff9e6 0%, #fff3d4 100%); padding: 20px; border-radius: 10px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 24px; margin-right: 12px;">⏰</span>
            <div>
              <p style="margin: 0; color: #856404; font-size: 13px; font-weight: 600;">Fecha y hora:</p>
              <p style="margin: 3px 0 0 0; color: #2c3e50; font-size: 15px; font-weight: 500;">${changeDate}</p>
            </div>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="font-size: 24px; margin-right: 12px;">📧</span>
            <div>
              <p style="margin: 0; color: #856404; font-size: 13px; font-weight: 600;">Cuenta:</p>
              <p style="margin: 3px 0 0 0; color: #2c3e50; font-size: 15px; font-weight: 500;">${email}</p>
            </div>
          </div>
        </div>
        
        <!-- Alerta de seguridad -->
        <div style="background-color: #ffe6e6; border-left: 4px solid #e74c3c; padding: 18px; border-radius: 5px; margin: 25px 0;">
          <p style="margin: 0; color: #c0392b; font-weight: 600; font-size: 15px;">
            <span style="font-size: 20px; margin-right: 8px;">⚠️</span>
            Si no realizaste este cambio, contacta con nosotros inmediatamente.
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 18px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
          <p style="margin: 0; color: #555; line-height: 1.7; font-size: 14px;">
            <strong style="color: #2c3e50;">🛡️ Tu cuenta está protegida:</strong><br>
            Solo tú tienes acceso a tu contraseña. Por tu seguridad, no compartas tu contraseña con nadie.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #2c3e50; padding: 25px 30px; border-radius: 0 0 10px 10px; text-align: center;">
        <p style="color: #ecf0f1; font-size: 13px; margin: 0 0 8px 0; line-height: 1.6;">
          Este es un email de seguridad automático, por favor no responder.
        </p>
        <p style="color: #95a5a6; font-size: 12px; margin: 0; line-height: 1.5;">
          Si tienes preguntas, contacta directamente a través de la plataforma.
        </p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #34495e;">
          <p style="color: #95a5a6; font-size: 12px; margin: 0;">
            © 2025 Huellitas - Plataforma de Adopción de Mascotas
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail(email, `Notificación de Seguridad - Tu contraseña ha sido cambiada`, htmlContent);
};

// Plantilla: Solicitud de reset de contraseña con CÓDIGO
export const sendPasswordResetEmail = async (userData) => {
  const { email, username, resetCode, expiresIn } = userData;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
        <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
        <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #e74c3c;">🔐 Restablecer Contraseña</h2>
        
        <p>Hola <strong>${username}</strong>,</p>
        
        <p>Recibimos una solicitud para restablecer tu contraseña en Huellitas. 
        Si no realizaste esta solicitud, ignora este email.</p>
        
        <p style="margin: 25px 0; text-align: center;">
          <span style="display: inline-block; background-color: #f5f5f5; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #e74c3c; border-radius: 10px; border: 2px dashed #e74c3c;">
            ${resetCode}
          </span>
        </p>
        
        <p style="text-align: center; color: #7f8c8d; margin-top: 10px;">
          Ingresa este código en la página de recuperación de contraseña
        </p>
        
        <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>⏰ Este código expira en:</strong> ${expiresIn}</p>
          <p style="margin: 5px 0;">Por seguridad, el código solo es válido por tiempo limitado.</p>
        </div>
        
        <p style="color: #e74c3c; font-weight: bold;">⚠️ IMPORTANTE: Nunca compartas este código con nadie. 
        Si no solicitaste un cambio de contraseña, ignora este email.</p>
        
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
          Este es un email de seguridad automático, por favor no responder. 
          Si tienes preguntas, contacta directamente a través de la plataforma.
        </p>
      </div>
    </div>
  `;

  return sendEmail(email, `Código de Verificación: ${resetCode} - Huellitas`, htmlContent);
};

// Plantilla: Recordatorios del carnet de mascota
export const sendReminderEmail = async (reminderData) => {
  const { email, username, reminders } = reminderData;
  
  // Generar HTML para cada recordatorio
  const reminderItems = reminders.map(reminder => {
    let icon = '📌';
    let color = '#3498db';
    
    switch(reminder.type) {
      case 'vaccine':
        icon = '💉';
        color = '#e74c3c';
        break;
      case 'deworming':
        icon = '💊';
        color = '#9b59b6';
        break;
      case 'bath':
        icon = '🛁';
        color = '#3498db';
        break;
      case 'medication':
        icon = '💊';
        color = '#f39c12';
        break;
    }

    return `
      <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid ${color}; margin: 10px 0; border-radius: 5px;">
        <p style="margin: 0; font-size: 18px;">${icon} <strong>${reminder.title}</strong></p>
        <p style="margin: 5px 0 0 0; color: #555;">${reminder.message}</p>
        ${reminder.days_before <= 1 ? '<p style="margin: 5px 0 0 0; color: #e74c3c; font-weight: bold;">⚠️ ¡Urgente!</p>' : ''}
      </div>
    `;
  }).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
        <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
        <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #2c3e50;">🔔 Recordatorios para tus mascotas</h2>
        
        <p>Hola <strong>${username}</strong>,</p>
        
        <p>Te enviamos los siguientes recordatorios importantes sobre el cuidado de tus mascotas:</p>
        
        ${reminderItems}
        
        <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #155724;">
            <strong>💡 Consejo:</strong> Mantener al día las vacunas y desparasitaciones de tu mascota 
            es fundamental para su salud y bienestar. ¡Tu peludo te lo agradecerá!
          </p>
        </div>
        
        <p style="text-align: center; margin: 25px 0;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/carnet" style="display: inline-block; background-color: #BCC990; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Ver Carnet Digital
          </a>
        </p>
        
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
          Este es un email automático de recordatorio. Si no deseas recibir estos recordatorios, 
          puedes desactivarlos desde la configuración de tu perfil.
        </p>
      </div>
    </div>
  `;

  const reminderCount = reminders.length;
  const subject = `🔔 ${reminderCount} recordatorio${reminderCount > 1 ? 's' : ''} para tus mascotas - Huellitas`;

  return sendEmail(email, subject, htmlContent);
};

export default sendEmail;

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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
        <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
        <p style="color: #7f8c8d; margin: 5px 0;">Plataforma de Adopción de Mascotas</p>
      </div>
      
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #2c3e50;">🔒 Tu contraseña ha sido cambiada</h2>
        
        <p>Hola <strong>${username}</strong>,</p>
        
        <p>Confirmamos que tu contraseña ha sido cambiada exitosamente.</p>
        
        <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>⏰ Fecha y hora:</strong> ${changeDate}</p>
          <p style="margin: 5px 0;"><strong>📧 Cuenta:</strong> ${email}</p>
        </div>
        
        <p style="color: #e74c3c; font-weight: bold;">⚠️ Si no realizaste este cambio, contacta con nosotros inmediatamente.</p>
        
        <p>Tu cuenta está protegida y solo tú tienes acceso a tu contraseña. 
        Por tu seguridad, no compartas tu contraseña con nadie.</p>
        
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
          Este es un email de seguridad automático, por favor no responder. 
          Si tienes preguntas, contacta directamente a través de la plataforma.
        </p>
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

export default sendEmail;

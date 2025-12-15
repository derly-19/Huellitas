# 📧 Guía de Implementación de Sistema de Emails - Huellitas

## ✅ Pasos Completados

### Paso 1: Instalación de Nodemailer
- ✅ Instalado `nodemailer` (librería estándar para envío de emails en Node.js)
- Comando: `npm install nodemailer`

### Paso 2: Configuración de Variables de Entorno
- ✅ Actualizado archivo `.env` con variables de email:
  ```
  EMAIL_SERVICE=gmail
  EMAIL_USER=tu_email@gmail.com
  EMAIL_PASSWORD=contraseña_app_password
  EMAIL_FROM_NAME=Huellitas - Plataforma de Adopción
  EMAIL_FROM_EMAIL=tu_email@gmail.com
  EMAIL_DEV_MODE=false (cambiar a false para enviar emails reales)
  APP_URL=http://localhost:3000
  ```

### Paso 3: Creación del Servicio de Email
- ✅ Archivo: `server/src/services/emailService.js`
- **Funciones incluidas:**
  - `sendEmail()` - Función genérica para enviar emails
  - `sendAdoptionRequestEmail()` - Confirma recepción de solicitud de adopción
  - `sendAdoptionApprovedEmail()` - Notifica aprobación de adopción
  - `sendAdoptionRejectedEmail()` - Notifica rechazo de adopción
  - `sendFollowUpVisitEmail()` - Notifica visita de seguimiento programada

### Paso 4: Actualización del Modelo de Notificaciones
- ✅ Agregados campos a tabla `notifications`:
  - `email_sent` - Indica si el email fue enviado
  - `email_address` - Almacena la dirección de email

### Paso 5: Integración de Emails en Adopciones
- ✅ Archivo: `server/src/controllers/adoptionRequestsController.js`
- **Emails enviados:**
  - Cuando se crea una solicitud: Email de confirmación al usuario
  - Cuando se aprueba: Email de aprobación
  - Cuando se rechaza: Email con motivo del rechazo

### Paso 6: Integración de Emails en Seguimiento
- ✅ Archivo: `server/src/controllers/followUpController.js`
- **Email enviado:** Notificación a la fundación cuando se registra un nuevo seguimiento

### Paso 7: Integración de Emails en Visitas
- ✅ Archivo: `server/src/controllers/visitsController.js`
- **Email enviado:** Confirmación de visita programada

### Paso 8: Prueba y Verificación
- ✅ Servidor iniciado sin errores
- ✅ Todas las tablas creadas correctamente
- ✅ Sistema listo para envío de emails

---

## 🔧 Configuración de Gmail (Importante)

### Para usar con Gmail:

1. **Habilitar "Aplicaciones menos seguras":**
   - Ir a: `https://myaccount.google.com/security`
   - Activar "Acceso de aplicaciones menos seguras"

2. **O mejor aún, usar "App Password":**
   - Ir a: `https://myaccount.google.com/apppasswords`
   - Seleccionar "Correo" y "Windows Computer" (o tu dispositivo)
   - Gmail te generará una contraseña única de 16 caracteres
   - Usar esa contraseña en `EMAIL_PASSWORD` en `.env`

---

## 🧪 Prueba de Envío de Emails

### Modo Desarrollo (EMAIL_DEV_MODE=true):
- Los emails se simulan en la consola
- No se envían emails reales
- Útil para testing

### Modo Producción (EMAIL_DEV_MODE=false):
- Los emails se envían realmente
- Requiere credenciales válidas de Gmail

---

## 📧 Eventos que Envían Emails

### 1. **Solicitud de Adopción**
- **Cuándo:** Usuario crea una solicitud de adopción
- **A quién:** Email del usuario que solicita
- **Contenido:** Confirmación y detalles de la solicitud

### 2. **Aprobación de Adopción**
- **Cuándo:** Fundación aprueba la solicitud
- **A quién:** Email del usuario
- **Contenido:** Confirmación de aprobación con enlace a dashboard

### 3. **Rechazo de Adopción**
- **Cuándo:** Fundación rechaza la solicitud
- **A quién:** Email del usuario
- **Contenido:** Notificación con motivo del rechazo

### 4. **Nuevo Seguimiento**
- **Cuándo:** Usuario registra seguimiento post-adopción
- **A quién:** Email de la fundación
- **Contenido:** Detalles del seguimiento recibido

### 5. **Visita Programada**
- **Cuándo:** Se programa una visita de seguimiento
- **A quién:** Email de la fundación
- **Contenido:** Detalles y fecha de la visita

---

## 📁 Archivos Modificados/Creados

```
server/
├── .env (MODIFICADO)
│   └── Agregadas variables de email
├── src/
│   ├── services/
│   │   └── emailService.js (NUEVO)
│   │       └── Servicio centralizado de emails
│   ├── models/
│   │   └── notificationsModel.js (MODIFICADO)
│   │       └── Agregados campos para email
│   └── controllers/
│       ├── adoptionRequestsController.js (MODIFICADO)
│       │   └── Integración de emails en adopciones
│       ├── followUpController.js (MODIFICADO)
│       │   └── Integración de emails en seguimiento
│       └── visitsController.js (MODIFICADO)
│           └── Integración de emails en visitas
```

---

## 🚀 Próximos Pasos Opcionales

1. **Agregar más plantillas de email:**
   - Recuperación de contraseña
   - Confirmación de registro
   - Avisos de nuevas mascotas disponibles

2. **Sistema de colas de emails:**
   - Instalar `bull` o `bull-queue` para procesar emails en background
   - Útil para no bloquear las operaciones principales

3. **Logs de emails:**
   - Guardar registro de emails enviados en base de datos
   - Permitir reenvío de emails

4. **Personalización de plantillas:**
   - Permitir a fundaciones personalizar contenido de emails

---

## 📞 Contacto y Soporte

Si tienes dudas sobre la implementación, revisa:
- Archivo: `.env` - Variables de configuración
- Archivo: `server/src/services/emailService.js` - Lógica de envío
- Consola del servidor - Logs de confirmación de emails

¡Sistema de emails implementado exitosamente! 🎉

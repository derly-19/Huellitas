# 🔐 Sistema Completo de Gestión de Contraseñas - Huellitas

## 📋 Resumen de Implementación

Se ha implementado un sistema completo y seguro de gestión de contraseñas con 3 flujos diferentes:

---

## 1️⃣ **Cambio de Contraseña Directo** (Usuarios Logueados)

### 🎯 Descripción
El usuario cambiar su contraseña cuando recuerda la contraseña actual.

### 📱 Interfaz
- **Ubicación:** Página de Perfil → Botón "🔐 Cambiar Contraseña"
- **Modal:** ChangePasswordModal.jsx

### 🔧 Endpoint Backend
```
POST /api/users/:id/change-password
Body: {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}
```

### ✅ Validaciones
- ✓ Contraseña actual correcta
- ✓ Nuevas contraseñas coinciden
- ✓ Nueva contraseña ≥ 6 caracteres
- ✓ Nueva contraseña ≠ contraseña actual

### 📧 Email Enviado
- Confirmación de cambio exitoso
- Fecha y hora del cambio
- Alerta de seguridad

---

## 2️⃣ **Reset de Contraseña por Email** (Olvide Contraseña)

### 🎯 Descripción
El usuario solicita un enlace de reset cuando olvida su contraseña.

### 📱 Interfaz
- **Ubicación:** Login → Link "¿Olvidaste tu contraseña?"
- **Página:** ForgotPassword.jsx (2 pasos)

### 🔧 Backend Endpoints

#### Paso 1: Solicitar Reset
```
POST /api/users/forgot-password/request
Body: {
  email: string
}
```

**Respuesta:**
- Genera token único (válido 1 hora)
- Envía email con enlace: `https://app.com/reset-password?token=...&email=...`

#### Paso 2: Validar Token y Cambiar Contraseña
```
POST /api/users/forgot-password/reset
Body: {
  token: string,
  email: string,
  newPassword: string,
  confirmPassword: string
}
```

**Validaciones:**
- ✓ Token válido y no expirado
- ✓ Email existe en la BD
- ✓ Nuevas contraseñas coinciden
- ✓ Nueva contraseña ≥ 6 caracteres

### ⏰ Seguridad
- Token expira en 1 hora
- Token hasheado en BD (no texto plano)
- Token eliminado tras uso exitoso

### 📧 Emails Enviados
1. **Email de Reset:** Contiene enlace con token
2. **Email de Confirmación:** Verifica cambio exitoso

---

## 3️⃣ **Notificaciones por Cambio de Contraseña**

### 📧 Plantilla de Email

**Asunto:** `Notificación de Seguridad - Tu contraseña ha sido cambiada`

**Contenido:**
- Confirmación del cambio
- Fecha y hora exacta
- Email de la cuenta
- ⚠️ Alerta de seguridad si no fui el usuario

---

## 🗄️ Base de Datos

### Nuevas Columnas en `users`
```sql
ALTER TABLE users ADD COLUMN reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN reset_token_expires DATETIME;
```

**Ejecutar migración:**
```bash
node scripts/addPasswordResetColumns.js
```

---

## 🎨 Componentes Frontend

### 1. Login.jsx
- Actualizado con link "¿Olvidaste tu contraseña?"
- Enlace directo a `/forgot-password`

### 2. ForgotPassword.jsx (NUEVO)
- **Paso 1:** Ingreso de email
- **Paso 2:** Ingreso de token y nueva contraseña
- Validaciones en tiempo real
- Mensajes de éxito/error

### 3. ChangePasswordModal.jsx (NUEVO)
- Modal para cambiar contraseña desde perfil
- Campos de contraseña con opción de mostrar/ocultar
- Validaciones inmediatas

### 4. Perfil.jsx
- Botón "🔐 Cambiar Contraseña" junto a "Editar Perfil"
- Abre modal de cambio de contraseña

### 5. App.jsx
- Nueva ruta: `POST /forgot-password`
- Excluye navbar/footer en página de reset

---

## 🔐 Seguridad Implementada

✅ **Contraseñas Hasheadas**
- Bcrypt con 10 rounds
- Nunca se almacenan en texto plano

✅ **Tokens Únicos**
- 32 bytes de datos aleatorios
- Hasheados con SHA-256 antes de guardarse
- Válidos solo 1 hora

✅ **Validaciones Completas**
- Longitud mínima: 6 caracteres
- Coincidencia de contraseñas
- Cambio de contraseña actual
- Validación de token expirado

✅ **Notificaciones**
- Email confirmación de cambio
- Alerta si cambio no fue autorizado

✅ **Privacidad**
- No revela si email existe (por seguridad)
- Mensajes genéricos en respuestas

---

## 🧪 Testing

### Probar Cambio Directo
```bash
# Como usuario logueado, ir a /perfil
# Click en "🔐 Cambiar Contraseña"
# Ingresar contraseña actual, nueva y confirmación
```

### Probar Reset por Email
```bash
# 1. Ir a /login
# 2. Click en "¿Olvidaste tu contraseña?"
# 3. Ingresar email registrado
# 4. Revisar email (derlynatalia62@gmail.com)
# 5. Copiar token del enlace
# 6. Pegar token en formulario
# 7. Ingresar nueva contraseña
# 8. Confirmar reset
```

### Tests Completados ✅
- Email de cambio de contraseña enviado
- Email de reset con token enviado
- Email de confirmación enviado
- Token con expiración funciona
- Validaciones preventivas funcionan

---

## 📝 Flujo de Usuario

### Cambio Directo (Recuerda Contraseña)
```
Usuario Logueado
    ↓
Perfil → Botón "🔐 Cambiar Contraseña"
    ↓
Modal ingresa:
  - Contraseña actual
  - Nueva contraseña
  - Confirmación
    ↓
Validaciones OK
    ↓
BD actualizada
    ↓
Email confirmación
    ↓
✅ Contraseña cambiada
```

### Reset por Email (Olvida Contraseña)
```
Usuario NO Logueado
    ↓
Login → Link "¿Olvidaste tu contraseña?"
    ↓
Paso 1: Ingresar email
    ↓
Backend genera token (1 hora)
    ↓
Email enviado con enlace
    ↓
Usuario abre email
    ↓
Copia token del URL
    ↓
Paso 2: Pega token y nueva contraseña
    ↓
Validaciones OK
    ↓
BD actualizada
    ↓
Email confirmación
    ↓
✅ Contraseña restablecida
```

---

## 📱 Rutas Frontend

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión |
| `/forgot-password` | Reset de contraseña |
| `/perfil` | Perfil usuario (cambio directo) |

---

## 🔗 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/users/:id/change-password` | Cambiar contraseña (requiere actual) |
| POST | `/api/users/forgot-password/request` | Solicitar email de reset |
| POST | `/api/users/forgot-password/reset` | Validar token y cambiar contraseña |

---

## 📧 Email Templates

### 1. Cambio de Contraseña
- ✓ Confirmación exitosa
- ✓ Fecha/hora exacta
- ✓ Alerta de seguridad

### 2. Reset de Contraseña
- ✓ Enlace de reset único
- ✓ Token en URL
- ✓ Expiración en 1 hora
- ✓ Instrucciones claras

### 3. Confirmación de Reset
- ✓ Mismo que cambio directo
- ✓ Verifica la operación

---

## ✨ Características Destacadas

🎯 **UX Amigable**
- Formularios claros y simples
- Mensajes de error descriptivos
- Validaciones antes de enviar

🔐 **Muy Seguro**
- Tokens únicos y hasheados
- Expiración automática
- Contraseñas nunca en texto plano

📧 **Notificaciones Completas**
- Email en cada cambio
- Alertas de seguridad
- Confirmaciones automáticas

⚡ **Rápido y Eficiente**
- Validaciones en frontend
- Respuestas inmediatas
- Sin recargas innecesarias

🎨 **Diseño Consistente**
- Mismo estilo que Huellitas
- Color verde (#BCC990)
- Responsive en móvil

---

## 🚀 Próximas Mejoras Opcionales

- [ ] Autenticación de dos factores
- [ ] Historial de cambios de contraseña
- [ ] Alertas de intentos fallidos
- [ ] Preguntas de seguridad personalizadas
- [ ] Recuperación por SMS

---

**Implementado:** 15 de Diciembre de 2025
**Estado:** ✅ Listo para producción

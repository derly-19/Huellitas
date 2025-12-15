import { db } from "../db/database.js";
import bcrypt from "bcrypt";
import { getAllFoundations, getFoundationById, updateFoundation, updateUser, getUserById } from "../models/usersModel.js";
import { sendPasswordChangeEmail, sendPasswordResetEmail } from "../services/emailService.js";
import crypto from "crypto";

export async function registerUser(req, res) {
  const { username, email, password, user_type, foundation_name, foundation_description, foundation_phone, foundation_address } = req.body;

  console.log("📝 Datos recibidos:", { username, email, password: "***", user_type });

  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Todos los campos son obligatorios" 
    });
  }

  // Si es fundación, validar campos adicionales
  if (user_type === 'foundation' && !foundation_name) {
    return res.status(400).json({ 
      success: false, 
      message: "El nombre de la fundación es obligatorio" 
    });
  }

  try {
    console.log("🔍 Verificando si el email existe...");
    // Verificar si el email ya existe
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    
    if (existingUser) {
      console.log("❌ Email ya existe");
      return res.status(400).json({ 
        success: false, 
        message: "El email ya está registrado" 
      });
    }

    console.log("🔐 Hasheando contraseña...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Contraseña hasheada");

    console.log("💾 Insertando usuario en la base de datos...");
    
    const result = await db.run(
      `INSERT INTO users (username, email, password, user_type, foundation_name, foundation_description, foundation_phone, foundation_address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username, 
        email, 
        hashedPassword, 
        user_type || 'user',
        foundation_name || null,
        foundation_description || null,
        foundation_phone || null,
        foundation_address || null
      ]
    );

    console.log("✅ Usuario insertado con ID:", result.lastID);

    // Devolver el usuario creado
    const newUser = {
      id: result.lastID,
      username: username,
      email: email,
      user_type: user_type || 'user',
      foundation_name: foundation_name || null
    };

    res.status(201).json({ 
      success: true, 
      message: user_type === 'foundation' 
        ? "Fundación registrada con éxito ✅" 
        : "Usuario registrado con éxito ✅",
      user: newUser
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al registrar usuario" 
    });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Correo y contraseña requeridos" 
    });
  }

  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuario no encontrado" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Contraseña incorrecta" 
      });
    }

    res.json({
      success: true,
      message: "Login exitoso ✅",
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        correo: user.email,
        user_type: user.user_type || 'user',
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        direccion: user.direccion,
        ciudad: user.ciudad,
        foundation_name: user.foundation_name,
        foundation_description: user.foundation_description,
        foundation_phone: user.foundation_phone,
        foundation_address: user.foundation_address,
        foundation_logo: user.foundation_logo,
        created_at: user.created_at
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al iniciar sesión" 
    });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await db.all("SELECT id, username, email, user_type, foundation_name FROM users");
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ 
      success: false, 
      error: "Error al obtener usuarios" 
    });
  }
}

// Obtener todas las fundaciones
export async function getFoundations(req, res) {
  try {
    const foundations = await getAllFoundations();
    res.json({
      success: true,
      data: foundations,
      message: `Se encontraron ${foundations.length} fundaciones`
    });
  } catch (error) {
    console.error("Error al obtener fundaciones:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener fundaciones" 
    });
  }
}

// Obtener una fundación por ID
export async function getFoundation(req, res) {
  try {
    const { id } = req.params;
    const foundation = await getFoundationById(id);
    
    if (!foundation) {
      return res.status(404).json({
        success: false,
        message: "Fundación no encontrada"
      });
    }
    
    res.json({
      success: true,
      data: foundation
    });
  } catch (error) {
    console.error("Error al obtener fundación:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener fundación" 
    });
  }
}

// Actualizar información de fundación
export async function editFoundation(req, res) {
  try {
    const { id } = req.params;
    const { foundation_name, foundation_description, foundation_phone, foundation_address, foundation_logo } = req.body;
    
    const foundation = await getFoundationById(id);
    if (!foundation) {
      return res.status(404).json({
        success: false,
        message: "Fundación no encontrada"
      });
    }
    
    await updateFoundation(id, {
      foundation_name,
      foundation_description,
      foundation_phone,
      foundation_address,
      foundation_logo
    });
    
    res.json({
      success: true,
      message: "Información de la fundación actualizada"
    });
  } catch (error) {
    console.error("Error al actualizar fundación:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar fundación" 
    });
  }
}

// Actualizar información de usuario
export async function editUser(req, res) {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, direccion, ciudad } = req.body;
    
    console.log(`📝 Actualizando usuario ${id}:`, { nombre, apellido, telefono, direccion, ciudad });
    
    const user = await getUserById(id);
    if (!user) {
      console.log(`❌ Usuario ${id} no encontrado`);
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    const result = await updateUser(id, {
      nombre,
      apellido,
      telefono,
      direccion,
      ciudad
    });
    
    console.log(`✅ Usuario ${id} actualizado:`, result);
    
    res.json({
      success: true,
      message: "Información del usuario actualizada"
    });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar usuario: " + error.message
    });
  }
}
// Cambiar contraseña de usuario
export async function changePassword(req, res) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validar campos
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios"
      });
    }

    // Validar que las nuevas contraseñas coincidan
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Las nuevas contraseñas no coinciden"
      });
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe ser diferente a la actual"
      });
    }

    // Validar que la nueva contraseña tenga al menos 6 caracteres
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe tener al menos 6 caracteres"
      });
    }

    // Obtener usuario
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "La contraseña actual es incorrecta"
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar en base de datos
    await db.run("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);

    console.log(`✅ Contraseña actualizada para usuario ${id}`);

    // Enviar email de notificación
    try {
      const changeDate = new Date().toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      await sendPasswordChangeEmail({
        email: user.email,
        username: user.username,
        changeDate: changeDate
      });
      console.log(`📧 Email de cambio de contraseña enviado a ${user.email}`);
    } catch (emailError) {
      console.error('Error enviando email de cambio de contraseña:', emailError);
      // No fallar la operación si falla el email
    }

    res.json({
      success: true,
      message: "Contraseña cambiada exitosamente ✅"
    });

  } catch (error) {
    console.error("❌ Error al cambiar contraseña:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar contraseña: " + error.message
    });
  }
}

// Solicitar reset de contraseña (generar CÓDIGO de 6 dígitos)
export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "El correo es obligatorio"
      });
    }

    // Buscar usuario por email
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      // Por seguridad, no revelar si el email existe
      return res.status(200).json({
        success: true,
        message: "Si el correo está registrado, recibirás un código de verificación"
      });
    }

    // Generar código de 6 dígitos
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Código expira en 15 minutos
    const expiresIn = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar código en base de datos (sin hashear para comparar fácilmente)
    await db.run(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
      [resetCode, expiresIn.toISOString(), user.id]
    );

    // Enviar email con código
    try {
      await sendPasswordResetEmail({
        email: user.email,
        username: user.username,
        resetCode: resetCode,
        expiresIn: '15 minutos'
      });
      console.log(`📧 Código de reset ${resetCode} enviado a ${user.email}`);
    } catch (emailError) {
      console.error('Error enviando email de reset:', emailError);
      // Limpiar el código si falla el email
      await db.run("UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?", [user.id]);
      return res.status(500).json({
        success: false,
        message: "Error al enviar el correo. Intenta de nuevo."
      });
    }

    res.json({
      success: true,
      message: "Te hemos enviado un código de verificación a tu correo"
    });

  } catch (error) {
    console.error("❌ Error en solicitud de reset:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud"
    });
  }
}

// Validar CÓDIGO y cambiar contraseña
export async function resetPasswordWithToken(req, res) {
  try {
    const { token, email, newPassword, confirmPassword } = req.body;

    // token ahora es el código de 6 dígitos
    const code = token;

    if (!code || !email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Las contraseñas no coinciden"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    // Buscar usuario
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Validar código (comparación directa)
    if (user.reset_token !== code) {
      return res.status(401).json({
        success: false,
        message: "Código incorrecto"
      });
    }

    // Validar que el código no haya expirado
    if (new Date(user.reset_token_expires) < new Date()) {
      return res.status(401).json({
        success: false,
        message: "El código ha expirado. Solicita uno nuevo."
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar código
    await db.run(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    console.log(`✅ Contraseña restablecida para usuario ${user.id}`);

    // Enviar email de confirmación
    try {
      const changeDate = new Date().toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      await sendPasswordChangeEmail({
        email: user.email,
        username: user.username,
        changeDate: changeDate
      });
      console.log(`📧 Email de confirmación enviado a ${user.email}`);
    } catch (emailError) {
      console.error('Error enviando email de confirmación:', emailError);
    }

    res.json({
      success: true,
      message: "Contraseña restablecida exitosamente ✅"
    });

  } catch (error) {
    console.error("❌ Error al restablecer contraseña:", error);
    res.status(500).json({
      success: false,
      message: "Error al restablecer la contraseña"
    });
  }
}
import { db } from "../db/database.js";
import bcrypt from "bcrypt";
import { getAllFoundations, getFoundationById, updateFoundation } from "../models/usersModel.js";

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
        user_type: user.user_type || 'user',
        foundation_name: user.foundation_name,
        foundation_description: user.foundation_description,
        foundation_phone: user.foundation_phone,
        foundation_address: user.foundation_address,
        foundation_logo: user.foundation_logo
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

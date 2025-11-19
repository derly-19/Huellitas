import { db } from "../db/database.js";
import bcrypt from "bcrypt";

export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  console.log("📝 Datos recibidos:", { username, email, password: "***" });

  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Todos los campos son obligatorios" 
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
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    console.log("✅ Usuario insertado con ID:", result.lastID);

    // Devolver el usuario creado
    const newUser = {
      id: result.lastID,
      username: username,
      email: email
    };

    res.status(201).json({ 
      success: true, 
      message: "Usuario registrado con éxito ✅",
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
        email: user.email 
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
    const users = await db.all("SELECT id, username, email FROM users");
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

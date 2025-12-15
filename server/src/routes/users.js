import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUsers,
  getFoundations,
  getFoundation,
  editFoundation,
  editUser,
  changePassword,
  requestPasswordReset,
  resetPasswordWithToken
} from "../controllers/usersController.js";

const router = express.Router();

// Registro
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Listar todos los usuarios
router.get("/", getUsers);

// Obtener todas las fundaciones
router.get("/foundations", getFoundations);

// Obtener una fundación por ID
router.get("/foundations/:id", getFoundation);

// Actualizar información de fundación
router.put("/foundations/:id", editFoundation);

// Actualizar información de usuario
router.put("/:id", editUser);

// Cambiar contraseña (requiere contraseña actual)
router.post("/:id/change-password", changePassword);

// Solicitar reset de contraseña (envía email con token)
router.post("/forgot-password/request", requestPasswordReset);

// Restablecer contraseña con token
router.post("/forgot-password/reset", resetPasswordWithToken);

export default router;

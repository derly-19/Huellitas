import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUsers,
  getFoundations,
  getFoundation,
  editFoundation,
  editUser
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

export default router;

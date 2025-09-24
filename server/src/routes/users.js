import express from "express";
import { registerUser, loginUser, getUsers } from "../controllers/usersController.js";

const router = express.Router();

// Registro
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Listar todos los usuarios
router.get("/", getUsers);

export default router;

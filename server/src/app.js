import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createUsersTable } from "./models/usersModel.js";
import usersRoutes from "./routes/users.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Crear tabla usuarios si no existe
createUsersTable();

// Rutas
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;

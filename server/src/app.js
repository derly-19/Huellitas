import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createUsersTable } from "./models/usersModel.js";
import { createPetsTable, insertInitialPets } from "./models/petsModel.js";
import { createCarnetTables, createCarnetsForAllPets, insertSampleCarnetData } from "./models/carnetModel.js";
import usersRoutes from "./routes/users.js";
import petsRoutes from "./routes/pets.js";
import carnetRoutes from "./routes/carnet.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  console.log("Body:", req.body);
  next();
});

// Crear tablas si no existen
createUsersTable();
createPetsTable();
createCarnetTables();

// Insertar datos iniciales de mascotas (solo la primera vez)
insertInitialPets();

// Crear carnets para todas las mascotas
createCarnetsForAllPets();

// Insertar datos de ejemplo en los carnets
insertSampleCarnetData();

// Rutas
app.use("/api/users", usersRoutes);
app.use("/api/pets", petsRoutes);
app.use("/api/carnet", carnetRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;

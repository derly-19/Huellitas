import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createUsersTable } from "./models/usersModel.js";
import { createPetsTable, insertInitialPets } from "./models/petsModel.js";
import { createCarnetTables, createCarnetsForAllPets, insertSampleCarnetData } from "./models/carnetModel.js";
import { createAdoptionRequestsTable } from "./models/adoptionRequestsModel.js";
import { createNotificationsTable } from "./models/notificationsModel.js";
import usersRoutes from "./routes/users.js";
import petsRoutes from "./routes/pets.js";
import carnetRoutes from "./routes/carnet.js";
import adoptionRequestsRoutes from "./routes/adoptionRequests.js";
import notificationsRoutes from "./routes/notifications.js";

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Body:", req.body);
  }
  next();
});

// Crear tablas si no existen
(async () => {
  createUsersTable();
  createPetsTable();
  createCarnetTables();
  createAdoptionRequestsTable();
  await createNotificationsTable();
  console.log("📋 Todas las tablas inicializadas");
})();

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
app.use("/api/adoption-requests", adoptionRequestsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;

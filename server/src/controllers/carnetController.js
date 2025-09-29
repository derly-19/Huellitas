import { db } from "../db/database.js";

// Obtener carnet completo de una mascota
export async function getCarnetByPetId(req, res) {
  try {
    const { petId } = req.params;

    // Verificar que la mascota existe
    const pet = await db.get("SELECT * FROM pets WHERE id = ?", [petId]);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Mascota no encontrada"
      });
    }

    // Obtener carnet
    const carnet = await db.get("SELECT * FROM carnet WHERE pet_id = ?", [petId]);
    if (!carnet) {
      return res.status(404).json({
        success: false,
        message: "Carnet no encontrado para esta mascota"
      });
    }

    // Obtener todas las secciones del carnet
    const [vacunas, desparasitaciones, banos, procedimientos, medicamentos] = await Promise.all([
      db.all("SELECT * FROM carnet_vacunas WHERE carnet_id = ? ORDER BY fecha_aplicacion DESC", [carnet.id]),
      db.all("SELECT * FROM carnet_desparasitaciones WHERE carnet_id = ? ORDER BY fecha_aplicacion DESC", [carnet.id]),
      db.all("SELECT * FROM carnet_banos WHERE carnet_id = ? ORDER BY fecha DESC", [carnet.id]),
      db.all("SELECT * FROM carnet_procedimientos WHERE carnet_id = ? ORDER BY fecha DESC", [carnet.id]),
      db.all("SELECT * FROM carnet_medicamentos WHERE carnet_id = ? ORDER BY fecha_inicio DESC", [carnet.id])
    ]);

    res.json({
      success: true,
      data: {
        carnet_id: carnet.id,
        mascota: {
          id: pet.id,
          name: pet.name,
          type: pet.type,
          age: pet.age,
          size: pet.size,
          sex: pet.sex,
          img: pet.img
        },
        vacunas,
        desparasitaciones,
        banos,
        procedimientos,
        medicamentos
      }
    });

  } catch (error) {
    console.error("Error obteniendo carnet:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Agregar nueva vacuna
export async function addVacuna(req, res) {
  try {
    const { petId } = req.params;
    const { nombre_vacuna, fecha_aplicacion, lote, veterinario, proxima_dosis, observaciones } = req.body;

    // Obtener carnet
    const carnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [petId]);
    if (!carnet) {
      return res.status(404).json({
        success: false,
        message: "Carnet no encontrado"
      });
    }

    // Insertar vacuna
    const result = await db.run(`
      INSERT INTO carnet_vacunas 
      (carnet_id, nombre_vacuna, fecha_aplicacion, lote, veterinario, proxima_dosis, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [carnet.id, nombre_vacuna, fecha_aplicacion, lote, veterinario, proxima_dosis, observaciones]);

    res.status(201).json({
      success: true,
      message: "Vacuna agregada exitosamente",
      data: {
        id: result.lastID,
        carnet_id: carnet.id,
        nombre_vacuna,
        fecha_aplicacion,
        lote,
        veterinario,
        proxima_dosis,
        observaciones
      }
    });

  } catch (error) {
    console.error("Error agregando vacuna:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Agregar nueva desparasitación
export async function addDesparasitacion(req, res) {
  try {
    const { petId } = req.params;
    const { tipo, medicamento, dosis, fecha_aplicacion, peso_mascota, veterinario, proxima_dosis, observaciones } = req.body;

    // Obtener carnet
    const carnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [petId]);
    if (!carnet) {
      return res.status(404).json({
        success: false,
        message: "Carnet no encontrado"
      });
    }

    // Insertar desparasitación
    const result = await db.run(`
      INSERT INTO carnet_desparasitaciones
      (carnet_id, tipo, medicamento, dosis, fecha_aplicacion, peso_mascota, veterinario, proxima_dosis, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [carnet.id, tipo, medicamento, dosis, fecha_aplicacion, peso_mascota, veterinario, proxima_dosis, observaciones]);

    res.status(201).json({
      success: true,
      message: "Desparasitación agregada exitosamente",
      data: {
        id: result.lastID,
        carnet_id: carnet.id,
        tipo,
        medicamento,
        dosis,
        fecha_aplicacion,
        peso_mascota,
        veterinario,
        proxima_dosis,
        observaciones
      }
    });

  } catch (error) {
    console.error("Error agregando desparasitación:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Agregar nuevo baño
export async function addBano(req, res) {
  try {
    const { petId } = req.params;
    const { fecha, tipo_shampoo, tratamiento_especial, observaciones, realizado_por } = req.body;

    // Obtener carnet
    const carnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [petId]);
    if (!carnet) {
      return res.status(404).json({
        success: false,
        message: "Carnet no encontrado"
      });
    }

    // Insertar baño
    const result = await db.run(`
      INSERT INTO carnet_banos
      (carnet_id, fecha, tipo_shampoo, tratamiento_especial, observaciones, realizado_por)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [carnet.id, fecha, tipo_shampoo, tratamiento_especial, observaciones, realizado_por]);

    res.status(201).json({
      success: true,
      message: "Baño registrado exitosamente",
      data: {
        id: result.lastID,
        carnet_id: carnet.id,
        fecha,
        tipo_shampoo,
        tratamiento_especial,
        observaciones,
        realizado_por
      }
    });

  } catch (error) {
    console.error("Error registrando baño:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Agregar nuevo procedimiento
export async function addProcedimiento(req, res) {
  try {
    const { petId } = req.params;
    const { tipo_procedimiento, descripcion, fecha, veterinario, costo, observaciones } = req.body;

    // Obtener carnet
    const carnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [petId]);
    if (!carnet) {
      return res.status(404).json({
        success: false,
        message: "Carnet no encontrado"
      });
    }

    // Insertar procedimiento
    const result = await db.run(`
      INSERT INTO carnet_procedimientos
      (carnet_id, tipo_procedimiento, descripcion, fecha, veterinario, costo, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [carnet.id, tipo_procedimiento, descripcion, fecha, veterinario, costo, observaciones]);

    res.status(201).json({
      success: true,
      message: "Procedimiento registrado exitosamente",
      data: {
        id: result.lastID,
        carnet_id: carnet.id,
        tipo_procedimiento,
        descripcion,
        fecha,
        veterinario,
        costo,
        observaciones
      }
    });

  } catch (error) {
    console.error("Error registrando procedimiento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Agregar nuevo medicamento
export async function addMedicamento(req, res) {
  try {
    const { petId } = req.params;
    const { medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, motivo, veterinario, observaciones } = req.body;

    // Obtener carnet
    const carnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [petId]);
    if (!carnet) {
      return res.status(404).json({
        success: false,
        message: "Carnet no encontrado"
      });
    }

    // Insertar medicamento
    const result = await db.run(`
      INSERT INTO carnet_medicamentos
      (carnet_id, medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, motivo, veterinario, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [carnet.id, medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, motivo, veterinario, observaciones]);

    res.status(201).json({
      success: true,
      message: "Medicamento agregado exitosamente",
      data: {
        id: result.lastID,
        carnet_id: carnet.id,
        medicamento,
        dosis,
        frecuencia,
        fecha_inicio,
        fecha_fin,
        motivo,
        veterinario,
        observaciones
      }
    });

  } catch (error) {
    console.error("Error agregando medicamento:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}
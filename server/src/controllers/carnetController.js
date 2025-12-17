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
    const { nombre_vacuna, fecha, lote, veterinario, proxima_dosis, observaciones } = req.body;
    const fecha_aplicacion = fecha || req.body.fecha_aplicacion;

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
    const { producto, dosis, fecha, veterinario, proxima_dosis, observaciones } = req.body;
    const fecha_aplicacion = fecha || req.body.fecha_aplicacion;
    const tipo = req.body.tipo || 'Desparasitación interna';
    const medicamento = producto || req.body.medicamento;

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
      (carnet_id, tipo, medicamento, dosis, fecha_aplicacion, veterinario, proxima_dosis, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [carnet.id, tipo, medicamento, dosis, fecha_aplicacion, veterinario, proxima_dosis, observaciones]);

    res.status(201).json({
      success: true,
      message: "Desparasitación agregada exitosamente",
      data: {
        id: result.lastID,
        carnet_id: carnet.id,
        tipo,
        producto: medicamento,
        dosis,
        fecha_aplicacion,
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
    const { fecha, producto, responsable, observaciones } = req.body;
    const tipo_shampoo = producto || req.body.tipo_shampoo;
    const realizado_por = responsable || req.body.realizado_por;

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
      (carnet_id, fecha, tipo_shampoo, observaciones, realizado_por)
      VALUES (?, ?, ?, ?, ?)
    `, [carnet.id, fecha, tipo_shampoo, observaciones, realizado_por]);

    res.status(201).json({
      success: true,
      message: "Baño registrado exitosamente",
      data: {
        id: result.lastID,
        carnet_id: carnet.id,
        fecha,
        producto: tipo_shampoo,
        observaciones,
        responsable: realizado_por
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
    const { tipo_procedimiento, descripcion, fecha, veterinario, observaciones, duracion, complicaciones } = req.body;
    const tipo = tipo_procedimiento || req.body.tipo;

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
      (carnet_id, tipo_procedimiento, descripcion, fecha, veterinario, observaciones, duracion, complicaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [carnet.id, tipo, descripcion, fecha, veterinario, observaciones, duracion, complicaciones]);

    res.status(201).json({
      success: true,
      message: "Procedimiento registrado exitosamente",
      data: {
        id: result.lastID,
        carnet_id: carnet.id,
        tipo_procedimiento: tipo,
        descripcion,
        fecha,
        veterinario,
        observaciones,
        duracion,
        complicaciones
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
    const { medicamento, dosis, frecuencia, duracion, fecha, fecha_inicio, fecha_fin, observaciones, veterinario } = req.body;

    // Obtener carnet
    const carnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [petId]);
    if (!carnet) {
      return res.status(404).json({
        success: false,
        message: "Carnet no encontrado"
      });
    }

    // Normalizar campos (aceptar tanto 'fecha' como 'fecha_inicio', 'duracion' como 'frecuencia')
    const fechaInicio = fecha_inicio || fecha;
    const frecuenciaFinal = frecuencia || duracion;

    // Insertar medicamento
    const result = await db.run(`
      INSERT INTO carnet_medicamentos
      (carnet_id, medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, observaciones, veterinario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [carnet.id, medicamento, dosis, frecuenciaFinal, fechaInicio, fecha_fin, observaciones, veterinario]);

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
        observaciones,
        veterinario
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

// Eliminar registro del carnet
export async function deleteRecord(req, res) {
  try {
    const { petId, tipo, recordId } = req.params;

    // Mapear el tipo al nombre de la tabla
    const tablaMap = {
      'vacunas': 'carnet_vacunas',
      'desparasitaciones': 'carnet_desparasitaciones',
      'banos': 'carnet_banos',
      'procedimientos': 'carnet_procedimientos',
      'medicamentos': 'carnet_medicamentos'
    };

    const tabla = tablaMap[tipo];
    
    if (!tabla) {
      return res.status(400).json({
        success: false,
        message: "Tipo de registro no válido"
      });
    }

    // Verificar que el registro existe y pertenece a la mascota
    const carnet = await db.get("SELECT id FROM carnet WHERE pet_id = ?", [petId]);
    if (!carnet) {
      return res.status(404).json({
        success: false,
        message: "Carnet no encontrado"
      });
    }

    // Eliminar el registro
    const result = await db.run(
      `DELETE FROM ${tabla} WHERE id = ? AND carnet_id = ?`,
      [recordId, carnet.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado"
      });
    }

    res.json({
      success: true,
      message: "Registro eliminado exitosamente"
    });

  } catch (error) {
    console.error("Error eliminando registro:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}
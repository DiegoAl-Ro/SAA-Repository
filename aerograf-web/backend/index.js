const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Inicialización y conexión a la base de datos SQLite (Archivo persistente)
const dbPath = path.resolve(__dirname, 'aerograff.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos SQLite:', err.message);
  } else {
    console.log(`Conectado exitosamente a SQLite en: ${dbPath}`);
  }
});

// Crear tabla 'presupuestos' si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS proyectos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      cliente TEXT NOT NULL,
      ubicacion TEXT NOT NULL,
      estado TEXT CHECK(estado IN ('Planificación', 'En Progreso', 'Completado', 'Cancelado')) DEFAULT 'Planificación',
      presupuesto REAL NOT NULL,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla proyectos:', err.message);
    } else {
      console.log('Tabla "proyectos" verificada/creada correctamente.');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS presupuestos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      superficie_m2 REAL NOT NULL,
      altura_m REAL NOT NULL,
      tipo_mural TEXT NOT NULL,
      fecha_estimada DATETIME NOT NULL,
      coste_total REAL NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla presupuestos:', err.message);
    } else {
      console.log('Tabla "presupuestos" verificada/creada correctamente.');
    }
  });
});

// Helper: Obtener fecha/hora actual en zona Europa/Madrid usando zona horaria local
function obtenerFechaMadrid() {
  const ahora = new Date();
  // Obtener la fecha en zona Europa/Madrid usando toLocaleString
  return ahora.toLocaleString('sv-SE', { timeZone: 'Europe/Madrid' }).replace(' ', 'T');
}

const ESTADOS_PROYECTO = ['Planificación', 'En Progreso', 'Completado', 'Cancelado'];

function validarIdProyecto(id) {
  const numero = Number(id);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function validarDatosProyecto(body) {
  const datos = body || {};
  const camposTexto = [datos.titulo, datos.cliente, datos.ubicacion];
  if (!camposTexto.every((valor) => typeof valor === 'string' && valor.trim().length > 0)) {
    return 'Los campos titulo, cliente y ubicacion son obligatorios y no pueden estar vacíos.';
  }
  if (!ESTADOS_PROYECTO.includes(datos.estado)) {
    return `El estado debe ser uno de: ${ESTADOS_PROYECTO.join(', ')}.`;
  }
  const presupuesto = Number(datos.presupuesto);
  const tipoPresupuesto = typeof datos.presupuesto;
  if ((tipoPresupuesto !== 'number' && tipoPresupuesto !== 'string') ||
      datos.presupuesto === '' || !Number.isFinite(presupuesto) || presupuesto <= 0) {
    return 'El presupuesto debe ser un número positivo.';
  }
  return null;
}

function normalizarProyecto(body) {
  return {
    titulo: body.titulo.trim(),
    cliente: body.cliente.trim(),
    ubicacion: body.ubicacion.trim(),
    estado: body.estado,
    presupuesto: Number(body.presupuesto)
  };
}

app.get('/api/proyectos', (req, res) => {
  db.all('SELECT * FROM proyectos ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

app.get('/api/proyectos/:id', (req, res) => {
  const id = validarIdProyecto(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'El ID del proyecto debe ser un número entero positivo.' });
  }

  db.get('SELECT * FROM proyectos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }
    res.json({ data: row });
  });
});

app.post('/api/proyectos', (req, res) => {
  const errorValidacion = validarDatosProyecto(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const proyecto = normalizarProyecto(req.body);
  const sql = `
    INSERT INTO proyectos (titulo, cliente, ubicacion, estado, presupuesto)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [proyecto.titulo, proyecto.cliente, proyecto.ubicacion, proyecto.estado, proyecto.presupuesto];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: 'Proyecto de mural creado con éxito',
      data: { id: this.lastID, ...proyecto }
    });
  });
});

app.put('/api/proyectos/:id', (req, res) => {
  const id = validarIdProyecto(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'El ID del proyecto debe ser un número entero positivo.' });
  }

  const errorValidacion = validarDatosProyecto(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const proyecto = normalizarProyecto(req.body);
  const sql = `
    UPDATE proyectos
    SET titulo = ?, cliente = ?, ubicacion = ?, estado = ?, presupuesto = ?
    WHERE id = ?
  `;
  const params = [proyecto.titulo, proyecto.cliente, proyecto.ubicacion, proyecto.estado, proyecto.presupuesto, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado para actualizar.' });
    }
    res.json({
      message: `Proyecto ID ${id} actualizado correctamente`,
      data: { id, ...proyecto }
    });
  });
});

app.delete('/api/proyectos/:id', (req, res) => {
  const id = validarIdProyecto(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'El ID del proyecto debe ser un número entero positivo.' });
  }

  db.run('DELETE FROM proyectos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado para eliminar.' });
    }
    res.json({ message: `Proyecto ID ${id} eliminado con éxito` });
  });
});

// --- RUTAS REST PARA PRESUPUESTOS ---
// 1. OBTENER TODOS LOS PRESUPUESTOS (READ ALL)
app.get('/api/presupuestos', (req, res) => {
  const sql = 'SELECT * FROM presupuestos ORDER BY id DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

// 2. CREAR UN NUEVO PRESUPUESTO (CREATE)
app.post('/api/presupuestos', (req, res) => {
  const { cliente, superficie_m2, altura_m, tipo_mural, fecha_estimada, coste_total } = req.body;

  // Validación básica
  if (!cliente || !superficie_m2 || !altura_m || !tipo_mural || !fecha_estimada || coste_total === undefined) {
    return res.status(400).json({
      error: 'Por favor proporciona todos los campos obligatorios: cliente, superficie_m2, altura_m, tipo_mural, fecha_estimada y coste_total.'
    });
  }

  // Validar que superficie_m2 y altura_m sean positivos
  if (superficie_m2 <= 0 || altura_m <= 0) {
    return res.status(400).json({
      error: 'La superficie y altura deben ser valores positivos.'
    });
  }

  // Validar que fecha_estimada sea una fecha válida
  const fecha = new Date(fecha_estimada);
  if (isNaN(fecha.getTime())) {
    return res.status(400).json({
      error: 'La fecha estimada debe ser una fecha válida.'
    });
  }

  // Usar fecha en formato ISO con zona Europa/Madrid
  const fechaFormateada = fecha_estimada;

  const sql = `
    INSERT INTO presupuestos (cliente, superficie_m2, altura_m, tipo_mural, fecha_estimada, coste_total)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [cliente, superficie_m2, altura_m, tipo_mural, fechaFormateada, coste_total];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: 'Presupuesto creado con éxito',
      data: {
        id: this.lastID,
        cliente,
        superficie_m2,
        altura_m,
        tipo_mural,
        fecha_estimada: fechaFormateada,
        coste_total
      }
    });
  });
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de AeroGraff AI escuchando en el puerto ${PORT}`);
});
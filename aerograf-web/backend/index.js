const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicialización y conexión a la base de datos SQLite (Archivo persistente)
const dbPath = path.resolve(__dirname, 'aerograff.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos SQLite:', err.message);
  } else {
    console.log(`Conectado exitosamente a SQLite en: ${dbPath}`);
  }
});

// Crear tabla 'proyectos' si no existe
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
});

// RUTA DE PRUEBA / HEALTHCHECK
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AeroGraff AI Backend API' });
});

// --- RUTAS DEL CRUD DE PROYECTOS DE MURALES ---

// 1. OBTENER TODOS LOS PROYECTOS (READ ALL)
app.get('/api/proyectos', (req, res) => {
  const sql = 'SELECT * FROM proyectos ORDER BY id DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

// 2. OBTENER UN PROYECTO POR ID (READ ONE)
app.get('/api/proyectos/:id', (req, res) => {
  const sql = 'SELECT * FROM proyectos WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json({ data: row });
  });
});

// 3. CREAR UN NUEVO PROYECTO (CREATE)
app.post('/api/proyectos', (req, res) => {
  const { titulo, cliente, ubicacion, estado, presupuesto } = req.body;

  if (!titulo || !cliente || !ubicacion || presupuesto === undefined) {
    return res.status(400).json({
      error: 'Por favor proporciona los campos obligatorios: titulo, cliente, ubicacion y presupuesto.'
    });
  }

  const sql = `
    INSERT INTO proyectos (titulo, cliente, ubicacion, estado, presupuesto)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [titulo, cliente, ubicacion, estado || 'Planificación', presupuesto];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: 'Proyecto de mural creado con éxito',
      data: {
        id: this.lastID,
        titulo,
        cliente,
        ubicacion,
        estado: estado || 'Planificación',
        presupuesto
      }
    });
  });
});

// 4. ACTUALIZAR UN PROYECTO (UPDATE)
app.put('/api/proyectos/:id', (req, res) => {
  const { titulo, cliente, ubicacion, estado, presupuesto } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE proyectos 
    SET titulo = COALESCE(?, titulo),
        cliente = COALESCE(?, cliente),
        ubicacion = COALESCE(?, ubicacion),
        estado = COALESCE(?, estado),
        presupuesto = COALESCE(?, presupuesto)
    WHERE id = ?
  `;
  const params = [titulo, cliente, ubicacion, estado, presupuesto, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado para actualizar' });
    }
    res.json({
      message: `Proyecto ID ${id} actualizado correctamente`,
      changes: this.changes
    });
  });
});

// 5. ELIMINAR UN PROYECTO (DELETE)
app.delete('/api/proyectos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM proyectos WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado para eliminar' });
    }
    res.json({
      message: `Proyecto ID ${id} eliminado con éxito`
    });
  });
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de AeroGraff AI escuchando en el puerto ${PORT}`);
});
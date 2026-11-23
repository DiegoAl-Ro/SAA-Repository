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

// Crear tabla 'presupuestos' si no existe
db.serialize(() => {
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
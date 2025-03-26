const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database('./Residuos.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos Residuos.db');
    // Creamos la tabla si no existe
    db.run(`
      CREATE TABLE IF NOT EXISTS residuos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        tipo TEXT,
        descripcion TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error al crear la tabla residuos', err.message);
      } else {
        console.log('Tabla residuos creada o ya existente.');
      }
    });
  }
});

app.use(express.json());

app.post('/residuos', (req, res) => {
  const { nombre, tipo, descripcion } = req.body;

  if (!nombre || !tipo || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  db.run('INSERT INTO residuos (nombre, tipo, descripcion) VALUES (?, ?, ?)', [nombre, tipo, descripcion], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Residuo creado correctamente', id: this.lastID });
  });
});

app.get('/', (req, res) => {
  res.send('¡Hola desde mi API de residuos!');
});

// Añadiendo los nuevos endpoints aquí:

// Endpoint para obtener todos los residuos
app.get('/residuos', (req, res) => {
  db.all('SELECT id, nombre, tipo, descripcion FROM residuos', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Endpoint para modificar un residuo
app.put('/residuos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, tipo, descripcion } = req.body;

  db.run('UPDATE residuos SET nombre = ?, tipo = ?, descripcion = ? WHERE id = ?', [nombre, tipo, descripcion, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Residuo actualizado correctamente', changes: this.changes });
  });
});

// Endpoint para eliminar un residuo
app.delete('/residuos/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM residuos WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Residuo eliminado correctamente', changes: this.changes });
  });
});


app.listen(port, () => {
  console.log(`La API está corriendo en http://localhost:${port}`);
});
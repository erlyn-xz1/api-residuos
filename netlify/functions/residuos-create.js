const sqlite3 = require('sqlite3').verbose();
const path = require('path');

exports.handler = async (event, context) => {
  // Construye la ruta a la base de datos relativa a la ubicación de la función
  const dbPath = path.join(__dirname, '..', '..', 'Residuos.db');
  const db = new sqlite3.Database(dbPath);

  try {
    const body = JSON.parse(event.body);
    const { nombre, tipo, descripcion } = body;

    if (!nombre || !tipo || !descripcion) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos obligatorios' }),
      };
    }

    return new Promise((resolve, reject) => {
      db.run('INSERT INTO residuos (nombre, tipo, descripcion) VALUES (?, ?, ?)', [nombre, tipo, descripcion], function(err) {
        if (err) {
          reject({
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
          });
        } else {
          resolve({
            statusCode: 201,
            body: JSON.stringify({ message: 'Residuo creado correctamente', id: this.lastID }),
          });
        }
      });
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    db.close();
  }
};
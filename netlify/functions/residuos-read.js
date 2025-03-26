const sqlite3 = require('sqlite3').verbose();

exports.handler = async (event, context) => {
  const db = new sqlite3.Database('./Residuos.db');

  try {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, nombre, tipo, descripcion FROM residuos', [], (err, rows) => {
        if (err) {
          reject({
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
          });
        } else {
          resolve({
            statusCode: 200,
            body: JSON.stringify(rows),
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
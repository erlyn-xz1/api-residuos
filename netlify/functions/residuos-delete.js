const sqlite3 = require('sqlite3').verbose();

exports.handler = async (event, context) => {
  const db = new sqlite3.Database('./Residuos.db');

  try {
    const id = event.path.split('/').pop(); // Obtener el ID de la URL

    return new Promise((resolve, reject) => {
      db.run('DELETE FROM residuos WHERE id = ?', id, function(err) {
        if (err) {
          reject({
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
          });
        } else {
          resolve({
            statusCode: 200,
            body: JSON.stringify({ message: 'Residuo eliminado correctamente', changes: this.changes }),
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
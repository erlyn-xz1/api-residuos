// Importa el cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

// Define las variables de entorno para la URL y la clave de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Inicializa el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    // Para leer todos los residuos, no necesitamos extraer un ID de la URL.
    // Eliminamos la línea que intentaba obtener el ID.
    // const id = event.path.split('/').pop();

    // Construimos la consulta para seleccionar todos los campos de la tabla 'residuos'.
    const { data, error } = await supabase
      .from('residuos')
      .select('id, nombre, tipo, descripcion');

    if (error) {
      console.error('Error al leer residuos:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    // Devolvemos la lista completa de residuos.
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Error general en la función:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
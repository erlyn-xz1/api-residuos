// Importa el cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

// Define las variables de entorno para la URL y la clave de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Inicializa el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    const id = event.path.split('/').pop(); // Obtener el ID de la URL

    let query = supabase
      .from('residuos')
      .select('id, nombre, tipo, descripcion');

    if (id) {
      query = query.eq('id', id); // Filtrar por ID si se proporciona
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al leer residuos:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(id ? (data.length > 0 ? data[0] : null) : data),
    };

  } catch (error) {
    console.error('Error general en la función:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
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

    const { error } = await supabase
      .from('residuos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar residuo:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Residuo eliminado correctamente' }),
    };

  } catch (error) {
    console.error('Error general en la función:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
// Importa el cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

// Define las variables de entorno para la URL y la clave de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Inicializa el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Esta función de Netlify se activa para eliminar un residuo específico por su ID.
exports.handler = async (event, context) => {
  try {
    // Extrae el ID del residuo que se va a eliminar desde el último segmento de la ruta de la URL.
    // Por ejemplo, si la URL es /api/eliminar/123, 'id' contendrá '123'.
    const id = event.path.split('/').pop();

    // Realiza la operación de eliminación en la tabla 'residuos' de Supabase.
    // Utiliza el método 'delete()' para eliminar registros.
    // La condición '.eq('id', id)' asegura que solo se elimine el residuo cuyo 'id' coincida con el extraído de la URL.
    const { error } = await supabase
      .from('residuos')
      .delete()
      .eq('id', id);

    // Comprueba si hubo algún error durante la operación de eliminación en Supabase.
    if (error) {
      console.error('Error al eliminar residuo:', error);
      return {
        statusCode: 500, // Indica un error del servidor.
        body: JSON.stringify({ error: error.message }), // Devuelve un mensaje de error en formato JSON.
      };
    }

    // Si la eliminación fue exitosa (no hubo error), devuelve una respuesta exitosa.
    return {
      statusCode: 200, // Indica una respuesta exitosa.
      body: JSON.stringify({ message: 'Residuo eliminado correctamente' }), // Devuelve un mensaje de éxito en formato JSON.
    };

  } catch (error) {
    // Captura cualquier error general que pueda ocurrir durante la ejecución de la función.
    console.error('Error general en la función:', error);
    return {
      statusCode: 500, // Indica un error del servidor.
      body: JSON.stringify({ error: error.message }), // Devuelve un mensaje de error en formato JSON.
    };
  }
};
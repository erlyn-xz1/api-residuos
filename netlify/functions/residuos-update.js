// Importa el cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

// Define las variables de entorno para la URL y la clave de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Inicializa el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Esta función de Netlify se activa para actualizar un residuo existente en la base de datos, identificado por su ID.
exports.handler = async (event, context) => {
  try {
    // Extrae el ID del residuo que se va a actualizar desde el último segmento de la ruta de la URL.
    // Por ejemplo, si la URL es /api/actualizar/456, 'id' contendrá '456'.
    const id = event.path.split('/').pop();
    // Parsea el cuerpo de la petición HTTP, que se espera que contenga los datos actualizados del residuo en formato JSON.
    const body = JSON.parse(event.body);
    // Extrae las propiedades 'nombre', 'tipo' y 'descripcion' del objeto JSON parseado. Estos son los campos que se van a actualizar.
    const { nombre, tipo, descripcion } = body;

    // Realiza una validación básica para asegurarse de que todos los campos necesarios para la actualización estén presentes en el cuerpo de la petición.
    if (!nombre || !tipo || !descripcion) {
      return {
        statusCode: 400, // Indica una petición incorrecta por parte del cliente (faltan datos).
        body: JSON.stringify({ error: 'Faltan campos obligatorios para actualizar' }), // Devuelve un mensaje de error indicando los campos que faltan.
      };
    }

    // Realiza la operación de actualización en la tabla 'residuos' de Supabase.
    // Utiliza el método 'update()' para modificar registros existentes.
    // El primer argumento es un objeto que contiene los campos y sus nuevos valores.
    // La condición '.eq('id', id)' asegura que solo se actualice el residuo cuyo 'id' coincida con el extraído de la URL.
    // El método 'count' en la respuesta indicará cuántas filas fueron actualizadas (debería ser 1 si el ID existe).
    const { error, count } = await supabase
      .from('residuos')
      .update({ nombre, tipo, descripcion })
      .eq('id', id);

    // Comprueba si hubo algún error durante la operación de actualización en Supabase.
    if (error) {
      console.error('Error al actualizar residuo:', error);
      return {
        statusCode: 500, // Indica un error del servidor.
        body: JSON.stringify({ error: error.message }), // Devuelve un mensaje de error detallado proporcionado por Supabase.
      };
    }

    // Si la actualización fue exitosa (no hubo error), devuelve una respuesta de éxito.
    return {
      statusCode: 200, // Indica una respuesta exitosa.
      body: JSON.stringify({ message: 'Residuo actualizado correctamente', changes: count }), // Devuelve un mensaje de éxito y la cantidad de registros modificados.
    };

  } catch (error) {
    // Captura cualquier error general que pueda ocurrir durante la ejecución de la función, como un error al parsear el JSON del cuerpo de la petición.
    console.error('Error general en la función:', error);
    return {
      statusCode: 500, // Indica un error del servidor.
      body: JSON.stringify({ error: error.message }), // Devuelve un mensaje de error genérico.
    };
  }
};
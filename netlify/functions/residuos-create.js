// Importa el cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

// Define las variables de entorno para la URL y la clave de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Inicializa el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Esta función de Netlify se activa para crear un nuevo residuo en la base de datos.
exports.handler = async (event, context) => {
  try {
    // Parsea el cuerpo de la petición HTTP, que se espera que contenga los datos del nuevo residuo en formato JSON.
    const body = JSON.parse(event.body);
    // Extrae las propiedades 'nombre', 'tipo' y 'descripcion' del objeto JSON parseado.
    const { nombre, tipo, descripcion } = body;

    // Realiza una validación básica para asegurarse de que todos los campos obligatorios estén presentes.
    if (!nombre || !tipo || !descripcion) {
      return {
        statusCode: 400, // Indica una petición incorrecta por parte del cliente.
        body: JSON.stringify({ error: 'Faltan campos obligatorios' }), // Devuelve un mensaje de error indicando los campos faltantes.
      };
    }

    // Realiza la operación de inserción en la tabla 'residuos' de Supabase.
    // Utiliza el método 'insert()' para añadir un nuevo registro.
    // El argumento es un array de objetos, aunque aquí solo insertamos un objeto.
    // El método '.select()' después de 'insert()' indica que queremos recibir los datos del registro recién insertado en la respuesta.
    const { data, error } = await supabase
      .from('residuos')
      .insert([{ nombre, tipo, descripcion }])
      .select();

    // Comprueba si hubo algún error durante la operación de inserción en Supabase.
    if (error) {
      console.error('Error al insertar residuo:', error);
      return {
        statusCode: 500, // Indica un error del servidor.
        body: JSON.stringify({ error: error.message }), // Devuelve un mensaje de error detallado proporcionado por Supabase.
      };
    }

    // Si la inserción fue exitosa (no hubo error), devuelve una respuesta de éxito.
    return {
      statusCode: 201, // Indica que un nuevo recurso ha sido creado exitosamente.
      body: JSON.stringify({ message: 'Residuo creado correctamente', data }), // Devuelve un mensaje de éxito y los datos del residuo recién creado.
    };

  } catch (error) {
    // Captura cualquier error general que pueda ocurrir durante la ejecución de la función, como un error al parsear el JSON del cuerpo de la petición.
    console.error('Error general en la función:', error);
    return {
      statusCode: 500, // Indica un error del servidor.
      body: JSON.stringify({ error: 'Error general en la función' }), // Devuelve un mensaje de error genérico.
    };
  }
};
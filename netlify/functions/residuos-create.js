// Importa el cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

// Define las variables de entorno para la URL y la clave de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Inicializa el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const { nombre, tipo, descripcion } = body;

    if (!nombre || !tipo || !descripcion) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos obligatorios' }),
      };
    }

    const { data, error } = await supabase
      .from('residuos')
      .insert([{ nombre, tipo, descripcion }])
      .select(); // Para obtener los datos insertados

    if (error) {
      console.error('Error al insertar residuo:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Residuo creado correctamente', data }),
    };

  } catch (error) {
    console.error('Error general en la función:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error general en la función' }),
    };
  }
};
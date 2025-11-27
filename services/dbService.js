'use strict';
const Prediccion = require('../models/prediction'); // Importamos el modelo del Paso 2

async function guardarPrediccion(datosEntrada, resultado) {
    try {
        // Creamos el objeto con los datos
        const nuevaPrediccion = new Prediccion({
            input_data: datosEntrada,
            prediccion_kwh: resultado
        });
        // Guardamos en Mongo (es asíncrono, por eso await)
        return await nuevaPrediccion.save();
    } catch (err) {
        throw new Error(`Error al guardar en BD: ${err}`);
    }
}

module.exports = {
    guardarPrediccion
};
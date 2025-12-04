'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definimos la estructura de los datos a guardar
const PrediccionSchema = new Schema({
    fecha: { type: Date, default: Date.now }, // Se guarda la fecha automáticamente
    input_data: { type: Object, required: true }, // Los datos que usaste para predecir
    prediccion_kwh: { type: Number, required: true } // El resultado de la IA
});

// Exportamos el modelo para usarlo en el servicio
module.exports = mongoose.model('Prediccion', PrediccionSchema);
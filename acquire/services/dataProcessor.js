const { fetchKunna } = require('./KunnaService');
const PreparedData = require('../models/PreparedData');

async function acquireAndProcessData() {
    // 1. Definir rango de tiempo (ej. últimas 24 horas para asegurar que tenemos 3 datos)
    const timeEnd = new Date();
    const timeStart = new Date();
    timeStart.setDate(timeEnd.getDate() - 5);

    // 2. Obtener datos crudos de Kunna
    const rawData = await fetchKunna(timeStart, timeEnd);
    
    // Necesitamos al menos 3 datos para t, t-1, t-2
    if (!rawData.values || rawData.values.length < 3) {
        throw new Error("No hay suficientes datos históricos para generar features");
    }

    // Identificar columnas (normalmente 'value' es el consumo y 'time_iso' la fecha)
    // Asumiremos que la columna de valor está en un índice específico o la buscamos.
    // NOTA: Dependiendo de la respuesta real de Kunna, ajusta estos índices.
    const valIndex = rawData.columns.indexOf('value'); 
    // Si no encuentra 'value', intenta usar el índice 1 (asumiendo estructura [time, value])
    const activeValIndex = valIndex > -1 ? valIndex : 1; 

    // rawData.values está ordenado DESC (el índice 0 es el más reciente -> t)
    const consumo_t = rawData.values[0][activeValIndex];
    const consumo_t_1 = rawData.values[1][activeValIndex];
    const consumo_t_2 = rawData.values[2][activeValIndex];

    // 3. Extraer características temporales (del momento actual o del último dato)
    const now = new Date();
    const hora = now.getHours();
    const dia_semana = now.getDay(); // 0 (Domingo) a 6 (Sábado)
    const mes = now.getMonth() + 1; // 0-11 -> 1-12
    const dia_mes = now.getDate();

    // 4. Construir vector de features
    // Orden contrato: [consumo_t, consumo_t-1, consumo_t-2, hora, dia_semana, mes, dia_mes]
    const features = [
        consumo_t, 
        consumo_t_1, 
        consumo_t_2, 
        hora, 
        dia_semana, 
        mes, 
        dia_mes
    ];

    // 5. Guardar en MongoDB
    const newData = new PreparedData({
        features: features,
        featureCount: 7
    });

    const savedData = await newData.save();

    return savedData;
}

module.exports = { acquireAndProcessData };
const { fetchKunna } = require('./KunnaService');
const PreparedData = require('../models/PreparedData');

async function acquireAndProcessData() {
    
    // --- INICIO LÓGICA DEL DOCUMENTO targetDate.docx ---
    const now = new Date();
    let targetDate = new Date(now);

    // Definimos si son más de las 23, predecimos mañana, sino predecimos hoy
    if (now.getHours() >= 23) {
        // Sumamos 1 día para que sea mañana
        targetDate.setDate(targetDate.getDate() + 1);
        console.log("🕒 Son más de las 23h: Target es MAÑANA");
    } else {
        // Se queda como hoy
        console.log("🕒 Son menos de las 23h: Target es HOY");
    }

    // Time_end = target date -1
    const timeEnd = new Date(targetDate);
    timeEnd.setDate(targetDate.getDate() - 1);

    // Time_start = time_end – 3
    const timeStart = new Date(timeEnd);
    timeStart.setDate(timeEnd.getDate() - 3);

    console.log(`📅 Rango de datos: ${timeStart.toISOString()} -> ${timeEnd.toISOString()}`);
    // --- FIN LÓGICA ---


    // 2. Obtener datos crudos de Kunna (Usando las nuevas fechas)
    const rawData = await fetchKunna(timeStart, timeEnd);
    
    // Verificación de seguridad (tu código original)
    if (!rawData.values || rawData.values.length < 3) {
        // Ojo: Si Kunna no tiene datos tan precisos, aquí podrías necesitar el mock
        // o ajustar el timeStart un poco más atrás si fuera necesario.
        throw new Error("No hay suficientes datos históricos para generar features");
    }

    // Identificar columnas
    const valIndex = rawData.columns.indexOf('value'); 
    const activeValIndex = valIndex > -1 ? valIndex : 1; 

    // rawData.values está ordenado DESC
    const consumo_t = rawData.values[0][activeValIndex];
    const consumo_t_1 = rawData.values[1][activeValIndex];
    const consumo_t_2 = rawData.values[2][activeValIndex];

    // 3. Extraer características temporales (Usamos targetDate como referencia del "momento")
    // Nota: El documento no especifica qué fecha usar para las features de hora/dia,
    // pero lo lógico es usar el 'now' o el 'targetDate'. Mantendré 'now' como tenías,
    // o puedes cambiarlo a 'targetDate' si las features deben ser del día objetivo.
    const hora = now.getHours();
    const dia_semana = now.getDay();
    const mes = now.getMonth() + 1;
    const dia_mes = now.getDate();

    // 4. Construir vector de features
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
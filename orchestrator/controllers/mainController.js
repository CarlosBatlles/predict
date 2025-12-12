const orchestrationService = require('../services/orchestrationService');

exports.healthCheck = (req, res) => {
    // Respuesta estándar de salud
    res.status(200).json({
        status: "ok",
        service: "orchestrator"
    });
};

exports.runWorkflow = async (req, res) => {
    try {
        // Inicia el flujo completo
        const result = await orchestrationService.executePipeline(); // O la función que llames en tu servicio
        
        // Respuesta 200 OK con el resultado
        res.status(200).json(result);

    } catch (error) {
        console.error("Error en Orchestrator:", error.message);

        // 502 Bad Gateway si falla Acquire o Predict
        if (error.message && (error.message.includes('BAD_STATUS') || error.message.includes('INVALID_RESPONSE'))) {
            return res.status(502).json({
                error: "Bad Gateway",
                message: "Error received from upstream service",
                details: error.message
            });
        }
        
        // 500 Internal Server Error para otros fallos
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
};
const crypto = require('crypto');

const ACQUIRE_URL = process.env.ACQUIRE_URL || "http://acquire:3001";
const PREDICT_URL = process.env.PREDICT_URL || "http://predict:3002";

async function fetchAcquireData() {
  const url = `${ACQUIRE_URL}/data`;
  const headers = { "Content-Type": "application/json" };
  const body = {}; 

  console.log(`-> Calling Acquire: ${url}`);
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error(`ACQUIRE_BAD_STATUS:${response.status}`);

  const json = await response.json();
  if (!json.features || !json.dataId) throw new Error("ACQUIRE_INVALID_RESPONSE");

  return json;
}

async function fetchPrediction(features, dataId) {
  const url = `${PREDICT_URL}/predict`;
  const headers = { "Content-Type": "application/json" };
  const body = {
    features: features,
    meta: {
      featureCount: features.length,
      dataId: dataId,
      source: "orchestrator",
      correlationId: crypto.randomUUID()
    }
  };

  console.log(`-> Calling Predict: ${url}`);
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error(`PREDICT_BAD_STATUS:${response.status}`);
  return await response.json();
}

// ESTA ES LA FUNCION PRINCIPAL QUE LLAMA EL CONTROLLER
exports.executePipeline = async () => {
    // 1. Acquire
    const acquireData = await fetchAcquireData();
    console.log("Data acquired:", acquireData.dataId);

    // 2. Predict
    const predictData = await fetchPrediction(acquireData.features, acquireData.dataId);
    console.log("Prediction received:", predictData.prediction);

    // 3. Respuesta final combinada
    return {
        dataId: acquireData.dataId,
        predictionId: predictData.predictionId,
        prediction: predictData.prediction,
        timestamp: new Date().toISOString()
    };
};
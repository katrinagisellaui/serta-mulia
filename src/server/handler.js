const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "explanation": explanation,
    "suggestion": suggestion,
    "confidenceScore": confidenceScore,
    "createdAt": createdAt
  }

  try {
    await storeData(id, data);
  } catch (error) {
    console.error('Error storing data in Firestore:', error);
    // Optionally return an error response here if you don't want to continue execution after an error
    return h.response({
      status: 'fail',
      message: 'Failed to store prediction data.'
    }).code(500);
  }
   
  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  })
  response.code(201);
  return response;
}
 
module.exports = postPredictHandler;
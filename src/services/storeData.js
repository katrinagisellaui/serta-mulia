const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
    const db = new Firestore();
    const predictCollection = db.collection('prediction');
    try {
      const result = await predictCollection.doc(id).set(data);
      console.log('Data stored successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in storing data:', error);
      throw error;  
    }
  }
  
 
module.exports = storeData;
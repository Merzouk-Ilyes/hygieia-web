const admin = require('firebase-admin');

const serviceAccount = require('../hygeia-312122-firebase-adminsdk-2d6g4-54fa815f71.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
exports.add = async function(title,description,token){
    const docRef = db.collection('notifuser'); 
    await docRef.add({
        title: title,
        description: description,
        token : token,
    });
}


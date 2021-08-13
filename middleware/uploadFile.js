
const {Storage} = require('@google-cloud/storage');
const PDFDocument = require('pdfkit');
const doc = new PDFDocument;

const storage = new Storage({
    keyFilename: "hygeia-312122-firebase-adminsdk-2d6g4-54fa815f71.json"
});
let bucketName = 'hygeia-312122.appspot.com';
// trés important car aprés on va l'utiliser pour écraser ou supprimer il doit étre sauvgardé aussi dans la bdd pour la manipulation

//let filename = 'IdPatient-typeDocument-date(AAAA-MM-JJ).pdf';
//let filename = 'output.pdf'; 

function uploadToStorage(filename) {
    return new Promise(function (resolve, reject){

      storage.bucket(bucketName).upload(filename, {
            metadata: {},
              }).then((err)=> {
                file = storage.bucket(bucketName).file(filename);
                file.getSignedUrl({
                  action: 'read',
                  expires: '03-09-2491'
                }).then(signedUrls => {
                    console.log(signedUrls);
                    resolve(signedUrls[0]);
                  // signedUrls[0] contains the file's public URL
                });
                
                console.log(`${filename} uploaded to ${bucketName}.`);
                });
              })
    
    // Uploads a local file to the bucket
   
}
/* var firebaseConfig = {
    apiKey: "AIzaSyCRps879g4c-uNc0Yqicu5V31cYIweLP-M",
    authDomain: "hygeia-312122.firebaseapp.com",
    storageBucket: "",
    messagingSenderId: "474094447554",
    appId: "1:474094447554:web:c549dc0b18c9643824845b",
    measurementId: "G-8NXMKPBGWS"
  };
  */
  // Initialize Firebase

     
 
  module.exports = {uploadToStorage};
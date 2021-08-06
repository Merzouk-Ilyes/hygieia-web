





var gcloud = require('gcloud')();
 var gcs = gcloud.storage();


const pdfkit = require('pdfkit');
const fs = require('fs');
const admin = require('firebase-admin');


const storage = new gcloud.Storage(
       {
         projectId: "hygeia-312122", 
        keyFilename: "hygeia-312122-firebase-adminsdk-2d6g4-54fa815f71.json"
      }
);

var bucket = gcs.bucket('hygeia-312122.appspot.com');

  

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
  const uploadToStorage = async() => {
    storage.createBucket('octocats', function(err, bucket) {

        // Error: 403, accountDisabled
        // The account for the specified project has been disabled.
    
        // Create a new blob in the bucket and upload the file data.
        var blob = bucket.file("octofez.png");
        var blobStream = blob.createWriteStream();
    
        blobStream.on('error', function (err) {
            console.error(err);
        });
    
        blobStream.on('finish', function () {
            var publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            console.log(publicUrl);
        });
    
        fs.createReadStream("octofez.png").pipe(blobStream);
    });
    
    
}

     
 
  module.exports = {uploadToStorage};
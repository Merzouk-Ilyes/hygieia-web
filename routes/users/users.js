require("dotenv").config();
const fs = require('fs');
const express =require('express')
const router = express.Router()
const adminRoutes = require('./admin')
const patientRoutes = require('./patient')
const usersController = require('../../controllers/users')
const medecinRoutes = require('./medecin')
const nodemailer  = require('nodemailer');
const uploadFile = require('../../middleware/uploadFile');
const PDFDocument = require('pdfkit');


const ejs = require('ejs');


// redirected to the patient route 
router.use("/patient" ,patientRoutes)

//redirected to the admin route
router.use("/admin" ,adminRoutes)


router.use('/medecin',medecinRoutes)
// functions that are the same for all users 
//executing  the login controller GET request (getLogin)

router.get("/login" ,usersController.getLogin)
router.get("/home",usersController.getHome);

//executing  the forget password controller GET request (getForget)
router.get("/forget" ,usersController.getForget)

//executing  the login controller POST request (postLogin)
// router.post("/login" ,usersController.login)
router.post("/login" ,usersController.login)
//executing  the forget password controller POST  request (postForget)
router.get('/changePassword',usersController.changePassword);
router.post('/changePassword',usersController.changePasswordPost);
router.post("/forget" ,usersController.postForget);
//executing  the forget password controller POST  request (postForget)
//router.post("/postConfirm" ,usersController.postForget);
router.get("/Confirm", usersController.postConfirm);
router.post("/reset", usersController.postReset);

router.post("/logout", usersController.logOut);

router.get('/upload',async (req,res,next)=> {
    // document PDF 
    const doc = new PDFDocument();
    // operation sur le PDF ......
    doc.text('hygeia team')
    // .............
    // filename
    let filename = 'IdPatient-typeDocument-date(AAAA-MM-JJ).pdf';
    let out = fs.createWriteStream(filename);
    doc.pipe(out);
    doc.end();
const url = await uploadFile.uploadToStorage(filename);
console.log(url);
});
module.exports = router 
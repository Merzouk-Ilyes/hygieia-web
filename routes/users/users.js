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
const jwt = require("jsonwebtoken");

const add = require('../../util/sendNotif');
router.get('/changePassword',usersController.changePassword);
router.post('/changePassword',usersController.changePasswordPost);
router.use("/patient" ,patientRoutes);
router.get("/login" ,usersController.getLogin)
router.post("/login" ,usersController.login)
router.use("/admin" ,adminRoutes)
router.all('/*',(req,res,next)=> {
    if(req.headers.cookie == null ) {
        res.redirect('/users/login')
        return; 
      }
      const rawCookies = req.headers.cookie.split('; ');
      const parsedCookie = rawCookies[0].split('=')[1];
      // user not connected ; 
      if(parsedCookie == null ) {
        res.redirect('/users/login')
        return; 
      }
      jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
        (err,decodedToken)=> {
          console.log(decodedToken);
       if (decodedToken.role == "médecin") {
          // medecin home provisoire ; 
      next();
        }else {
          res.redirect('/users/admin/gestion')
        }
            }); 

}); 
// redirected to the patient route 


//redirected to the admin route



router.use('/medecin',medecinRoutes)
// functions that are the same for all users 
//executing  the login controller GET request (getLogin)


router.get("/home",usersController.getHome);

//executing  the forget password controller GET request (getForget)
router.get("/forget" ,usersController.getForget)

//executing  the login controller POST request (postLogin)
// router.post("/login" ,usersController.login)

//executing  the forget password controller POST  request (postForget)
router.get('/changePassword',usersController.changePassword);
router.post('/changePassword',usersController.changePasswordPost);
router.post("/forget" ,usersController.postForget);
//executing  the forget password controller POST  request (postForget)
//router.post("/postConfirm" ,usersController.postForget);
router.get("/Confirm", usersController.postConfirm);
router.post("/reset", usersController.postReset);

router.get("/logout", usersController.logOut);

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



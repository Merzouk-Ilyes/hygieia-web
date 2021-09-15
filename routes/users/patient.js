const express =require('express')
const router = express.Router();
const patientController = require('../../controllers/patient');
const patientController2= require('../../controllers/patient2');
const notif = require('../../util/sendNotif');
// executing signup controller POST request (postSignup)
router.post("/signup",  patientController.signupPatient);
// executing activate controller POST request (postActivate)
router.get("/activate", patientController.activatePatientAccount); 
router.post('/validateRdv',patientController2.validateRdv);
// executing login for patient 
router.post("/login" ,patientController.login);
router.post("/getProfile" ,patientController.getProfile);
router.post("/updateProfile" ,patientController.updateProfile);
router.post("/uploadPicture",patientController.uploadPicture);
router.post('/getExamMedicalPatient',patientController2.getExamMedicalPatient);
router.get('/getMedecins', patientController2.getMedecinList);
router.post('/getListRdv',patientController2.getListRdv);
router.post('/addRdv',patientController2.addRdv);
router.get('/getWork',patientController2.getWork);
router.post('/getOrdonnaces',patientController2.getOrdonnaces);
router.post('/updateRdv',patientController2.updateRdv);
router.post('/updateRdvanotherDate',patientController2.updateRdvanotherDate);
router.post('/getDateProposedDate',patientController2.getDateProposedDate);
router.post('/changeDateRdv',patientController2.changeDateRdv);
router.post('/getNotification',patientController2.getNotification);


module.exports = router ;
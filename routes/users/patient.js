const express =require('express')
const router = express.Router();
const patientController = require('../../controllers/patient');
const patientController2= require('../../controllers/patient2');

// executing signup controller POST request (postSignup)
router.post("/signup",  patientController.signupPatient);
// executing activate controller POST request (postActivate)
router.get("/activate", patientController.activatePatientAccount); 
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
module.exports = router ;
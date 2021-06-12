const express =require('express')
const router = express.Router();
const patientController = require('../../controllers/patient');

// executing signup controller POST request (postSignup)
router.post("/signup",  patientController.signupPatient);
// executing activate controller POST request (postActivate)
router.get("/activate", patientController.activatePatientAccount); 
// executing login for patient 
router.post("/login" ,patientController.login)
module.exports = router ;
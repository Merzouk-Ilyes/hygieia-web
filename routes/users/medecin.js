const express = require('express')
const medecinControler  = require("../../controllers/medecin"); 
const router =express.Router();
router.get('/list',medecinControler.getList);
router.get('/examenmedical',medecinControler.getExamFile);
router.get('/medicalFile',medecinControler.getMedicalFile); 
router.get('/medicalfileUpdate',medecinControler.getUpdateMedicalFile);


router.get('/medicalExam' , medecinControler.getExam)

router.post('/addIntoxication', medecinControler.postIntoxication); 
router.post('/deleteIntoxication', medecinControler.deleteIntoxication); 
router.post('/updatePersonalHistory', medecinControler.updatePersonalHistory);
router.post('/addAffection', medecinControler.addAffection);
router.post('/deleteAffection',medecinControler.deleteAffection);
router.post('/addMaladie',medecinControler.addMaladie);
router.post('/deleteMaladie',medecinControler.deleteMaladie);
router.post('/addAllergy',medecinControler.addAlergie);
router.post('/deleteAllergie',medecinControler.deleteAllergie);

module.exports = router ; 
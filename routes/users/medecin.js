const express = require('express')
const medecinControler  = require("../../controllers/medecin"); 
const medecinControler3  = require("../../controllers/medecin3"); 
const medecinControler2  = require("../../controllers/medecin2"); 
const router =express.Router();
router.get('/list',medecinControler.getList);
router.get('/medicalFile',medecinControler.getMedicalFile); 
router.get('/medicalfileUpdate',medecinControler.getUpdateMedicalFile);
router.get('/medicalexam' , medecinControler.getExam);
router.post('/addIntoxication', medecinControler.postIntoxication); 
router.post('/deleteIntoxication', medecinControler.deleteIntoxication); 
router.post('/updatePersonalHistory', medecinControler.updatePersonalHistory);
router.post('/addAffection', medecinControler.addAffection);
router.post('/deleteAffection',medecinControler.deleteAffection);
router.post('/addMaladie',medecinControler.addMaladie);
router.post('/deleteMaladie',medecinControler.deleteMaladie);
router.post('/addAllergy',medecinControler.addAlergie);
router.post('/deleteAllergie',medecinControler.deleteAllergie);
router.get('/getExamen',medecinControler.getMedicalExam);
router.get('/profile',medecinControler.getProfile);
router.get('/getExam',medecinControler.getExam);
router.post('/changePictureFile',medecinControler.changePictureFile);
router.post('/addWork',medecinControler2.addWork);
router.post('/deleteWork',medecinControler2.deleteWork);
router.post('/changePassword',medecinControler2.changePassword);
router.post('/makePDFexam', medecinControler.postExamenMedical);
router.post('/editExam', medecinControler.postEditExam);
router.post('/deleteExamFile',medecinControler.deleteExamFile);
router.get('/updateMedicalExam',medecinControler.getMedicalExam);
router.get('/home',medecinControler.getAcce);
router.post('/seenotifs',medecinControler2.seenotifs);  


//examen medical
router.get("/infoExam",medecinControler3.getinfoExam);
router.get("/infoUpdateExam",medecinControler3.getinfoUpdateExam);
router.post("/addExam",medecinControler3.postaddExam);
router.post("/updateExam",medecinControler3.postupdateExam);
router.post("/addSickness",medecinControler3.postaddSickness);



//examen complemantaire
router.post("/addMedicament",medecinControler3.postMedicament);
router.post("/addExamen",medecinControler3.postExamen);

router.post("/addSicknote",medecinControler3.postSicknote);
router.post("/addOrientation",medecinControler3.postOrientation);
router.post("/addBilan",medecinControler3.postBilan);
router.post("/addEvacuation",medecinControler3.postEvacuation);
router.post("/addCertificatRepos",medecinControler3.postCertificatRepos);
router.post("/addCertificatPratique",medecinControler3.postCertificatPratique);

router.post("/dataSicknote",medecinControler3.postdataSicknote);
router.post("/dataBilan",medecinControler3.postdataBilan);
router.post("/dataOrientation",medecinControler3.postdataOrientation);
router.post("/dataEvacuation",medecinControler3.postdataEvacuation);
router.post("/dataCertificat",medecinControler3.postdataCertificat);

router.post("/updateSicknote",medecinControler3.postupdateSicknote);
router.post("/updateOrientation",medecinControler3.postupdateOrientation);
router.post("/updateBilan",medecinControler3.postupdateBilan);
router.post("/updateEvacuation",medecinControler3.postupdateEvacuation);
router.post("/updateCertificatRepos",medecinControler3.postupdateCertificatRepos);
router.post("/updateCertificatPratique",medecinControler3.postupdateCertificatPratique);

router.post("/deleteSicknote",medecinControler3.postdeleteSicknote);
router.post("/deleteOrientation",medecinControler3.postdeleteOrientation);
router.post("/deleteBilan",medecinControler3.postdeleteBilan);
router.post("/deleteEvacuation",medecinControler3.postdeleteEvacuation);
router.post("/deleteCertificat",medecinControler3.postdeleteCertificat);

router.post("/imprimeSicknote",medecinControler3.postimprimeSicknote);
router.post("/imprimeBilan",medecinControler3.postimprimeBilan);
router.post("/imprimeOrientation",medecinControler3.postimprimeOrientation);
router.post("/imprimeEvacuation",medecinControler3.postimprimeEvacuation);
router.post("/imprimeCertificat",medecinControler3.postimprimeCertificat);


module.exports = router ; 
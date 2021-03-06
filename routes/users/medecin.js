var multer  = require('multer');
const express = require('express')
const medecinControler  = require("../../controllers/medecin"); 
const medecinControler3  = require("../../controllers/medecin3"); 
const medecinControler2  = require("../../controllers/medecin2"); 
const medecinRDV  = require("../../controllers/medecinRDV");
const uploadFile = require('../../middleware/uploadFile');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })
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



// RDV 
router.get('/RDV' ,medecinRDV.getRDV);
router.get('/RdvData' ,medecinRDV.getRdvData);
router.post('/makeRDV', medecinRDV.postRDV); 

router.post('/delRow', medecinRDV.delRow);
router.post('/makeRDVind', medecinRDV.postRDVind);
router.get('/RDVindividuel', medecinRDV.getRDVindividuel);
router.post('/makeCas0', medecinRDV.makeCas0);
router.post('/makeCas3', medecinRDV.makeCas3); 
router.post('/makeCas6', medecinRDV.makeCas6); 
router.post('/makeCas7', medecinRDV.makeCas7);
router.post('/makeCas11', medecinRDV.makeCas11);
router.post('/makeCas14', medecinRDV.makeCas14); 
router.post('/makeCas17', medecinRDV.makeCas17);
router.post('/makeCas18', medecinRDV.makeCas18); 
router.post('/makeCas19', medecinRDV.makeCas19);



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

const medecinControler5  = require("../../controllers/medecin5"); 
router.get('/infoStatrh', medecinControler5.getStatrh);

router.get('/infoStat', medecinControler5.getStat);
router.post('/profile_upload_single', upload.single('profile-file'),async  function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    console.log(JSON.stringify(req.file))
  
    console.log(req.file.path);
 
    const url = await uploadFile.uploadToStorage(req.file.path);

  })
  router.post('/FiltreEtudiant', medecinControler5.postFiltreEtudiant);
router.post('/FiltrePatient', medecinControler5.postFiltrePatient);
router.post('/FiltreEvacuation', medecinControler5.postFiltreEvacuation);
router.post('/FiltreRegulier', medecinControler5.postFiltreRegulier);
router.post('/FiltreIrregulier', medecinControler5.postFiltreIrregulier);
router.post('/FiltreFumeur', medecinControler5.postFiltreFumeur);
router.get('/RDVpromo', medecinControler5.getRDVpromo);
router.post('/makeRDVpromo', medecinControler5.postRDVpromo);
router.post('/editRDVpromo', medecinControler5.editRDVpromo);
router.post('/cancelRDVpromo', medecinControler5.cancelRDVpromo);
module.exports = router ; 
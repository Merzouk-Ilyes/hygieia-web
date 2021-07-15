const express = require('express')
const medecinControler  = require("../../controllers/medecin"); 
const router =express.Router();
router.get('/list',medecinControler.getList);
router.get('/medicalFile',medecinControler.getMedicalFile); 
router.get('/medicalfileUpdate',medecinControler.getUpdateMedicalFile);
module.exports = router ; 
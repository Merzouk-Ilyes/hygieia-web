const express = require('express')
const medecinControler  = require("../../controllers/medecin"); 
const router =express.Router()



router.get('/list',medecinControler.getList);

module.exports = router ; 
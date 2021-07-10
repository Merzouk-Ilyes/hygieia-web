const express = require('express')
const router =express.Router()
const adminController =require('../../controllers/admin');

// executing add  controller POST request (postAdd)
router.post("/add",adminController.addNewUser);

 // executing archive controller POST request (postArchive)
router.post("/archive")
 
// executing status controller GET request (getStatus)
router.get("/status")

// executing status controller POST request (postStatus)
router.post("/status",adminController.postChangeStatus)

//Get the interface ==> Gestion des comptes
router.get("/gestion",adminController.getGestion)

//POST request to delete an account 
router.post("/delete",adminController.postDeleteAccount)


module.exports = router ;
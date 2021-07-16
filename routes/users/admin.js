const express = require('express')
const router =express.Router()
const adminController =require('../../controllers/admin');

//POST data of account 
router.post("/update",adminController.getData)

//POST updata an account 
router.post("/modifier",adminController.postUpdate)

// executing add  controller POST request (postAdd)
router.post("/add", adminController.addUser);

 // executing archive controller POST request (postArchive)
router.post("/archive")
 
router.get("/logout" , adminController.logout)

// executing status controller POST request (postStatus)
router.post("/status",adminController.postChangeStatus)

//Get the interface ==> Gestion des comptes
router.get("/gestion",adminController.getGestion)

//POST request to delete an account 
router.post("/delete",adminController.postDeleteAccount)




module.exports = router ;
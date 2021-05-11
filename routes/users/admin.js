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
router.post("/status")


module.exports = router ;
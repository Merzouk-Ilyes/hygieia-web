const express = require('express')
const router =express.Router()


// executing add controller GET request (getAdd)
router.get("/add")

// executing add  controller POST request (postAdd)
router.post("/add")

 // executing archive controller POST request (postArchive)
router.post("/archive")
 
// executing status controller GET request (getStatus)
router.get("/status")

// executing status controller POST request (postStatus)
router.post("/status")


module.exports = router ;
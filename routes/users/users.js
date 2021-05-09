const express =require('express')
const router = express.Router()
const adminRoutes = require('./admin')
const patientRoutes = require('./patient')

// redirected to the patient route 
router.get("/patient" ,patientRoutes)

//redirected to the admin route
router.get("/admin" ,adminRoutes)
   

// functions that are the same for all users 

//executing  the login controller GET request (getLogin)
router.get("/login" ,)

//executing  the forget password controller GET request (getForget)
router.get("/forget" ,)

//executing  the login controller POST request (postLogin)
router.post("/login" ,)

//executing  the forget password controller POST  request (postForget)
router.post("/forget" ,)

module.exports = router 
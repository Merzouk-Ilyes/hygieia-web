const express =require('express')
const router = express.Router()

// executing signup controller GET request (getSignup)
router.get("/signup")

// executing signup controller POST request (postSignup)
router.post("/signup")


module.exports = router ;
require('dotenv').config();
const express = require('express') ;
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./util/database');
const usersRoutes =require('./routes/users/users')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3000 ;

// Required for using cookies
app.use(cookieParser());

//Required for parsing data
app.use(bodyParser.urlencoded({extended:false})) 
app.use(bodyParser.json());


// redirected to the users route 
//(ALL FUNCTIONS CONCERNING AUTHENTICATION & ACCOUNT MANAGEMENT)
app.use("/users",usersRoutes)


//Syncing the database for changes & listening to the server 
sequelize.sync().then(result => {
 
 app.listen(PORT)
}).catch(err => {
    console.log(err)
})
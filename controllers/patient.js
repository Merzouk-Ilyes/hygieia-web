require('dotenv').config();
const db = require('../util/db').db;
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const signupPatient = async (req,res) =>  {

    const url = 'http://localhost:3000/' ; 
   // check if user already exist
    var exist = await checkIfUserAlreadyexists(req.body.email);
    if(!exist){
        return  res.status(404).send("Ce compte existe déja");
    }else {
    // Insert information into Account table 
    db.query("INSERT INTO account (Email,Pass_word,active) VALUES (?,?,?)",
    [req.body.email,req.body.password,0],(err,result)=> {
        if(err) {
          console.log('error',err); 
        }else {
          // Insert information into Patient table 
          db.query("INSERT INTO patient (Firstname,Lastname,Birthday,Promotion,Phonenumber,Email,Role,Sexe) VALUES (?,?,?,?,?,?,?,?)",[
              req.body.name,req.body.lastname,req.body.birthday,req.body.promotion,
              req.body.phonenumber,req.body.email,req.body.role,req.body.sexe,
        ],(err,result) => {
            if(err) {
              console.log('error',err); 
            } else {
                // Send confirmation email
                const {email,password}= req.body;
                const token = jwt.sign({email,password},process.env.JWT_SECRET_CODE,{expiresIn:'1m'})
                // create transporter
                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: process.env.HYGIEA_EMAIL,
                    pass: process.env.HYGIEA_EMAIL_PASSWORD
                  }
                });
                // adding mailOptions
                var mailOptions = {
                  from: process.env.HYGIEA_EMAIL,
                  to: req.body.email,
                  subject: 'Email de confirmation',
                  html: `
                  <h1>Please click on the given link  to activate your 
                  account</h1>
                  <form method="POST" action="${url}users/patient/activate?token=${token}">
                  <button type="submit"  name="token" value='${token}'>Confirmer</button>
                  </form>
                
                  `
                };
                // send confirmation email using transporter and mailOptions
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    return  res.status(200).send("Votre compte a été créé avec succès");
                  }
                });
            }

        });
        }
});
}}
const activatePatientAccount = async (req,res)=> {
    // read token value
    const token = req.query.token ;
    // decodeToken 
jwt.verify(token,process.env.JWT_SECRET_CODE,(err,decodedToken)=> {
  if(err) {
    console.log('error',err)
  } else {
    db.query("UPDATE account SET active = 1 WHERE Email = ?",
    [decodedToken.email],(err,result)=> {
        if(err) {
            console.log('error',err);
        }else {
            res.send('Votre compte a été activé avec succès');
        }
    });
  }
});
}
async function checkIfUserAlreadyexists(email)  {
    return new Promise(function(resolve, reject){
        db.query(
            "SELECT * FROM account WHERE email = ?",[email],
            function(err, rows){                                                
                if(rows === undefined){
                    reject(new Error("Error rows is undefined"));
                }else{
                    resolve(rows.length == 0);
                }
            }
        )}
    )
}
module.exports = {signupPatient,activatePatientAccount}


require("dotenv").config();
const fs = require('fs');

const db = require("../util/db").db;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passwordHash = require("password-hash");
const {Patient ,Account} = require('../models/user');
const pool = require("../util/db").pool;

const ejs = require('ejs');
 

const uploadPicture = (req,res)=> {
  const image = req.body.image; 
  const email = req.body.email; 
  pool.getConnection(function(err,connection){
    connection.query("Update Patient Set Picture = ? where Email = ? ",
    [image,email],(err,result)=> {
   if(err) {
     return res.send("err")
   }else {
     return res.send("succes");
   }
    })
  })
}
const signupPatient = async (req, res) => {
  console.log(req.body);
  console.log("we rare here");
pool.getConnection(function(err, connection){
  connection.query("select * from Account where Email = ?",
  [req.body.email],(err,resu)=>{
    if(resu.length > 0) {
      return res.status(404).send("Ce compte existe déja");
    }else {
      connection.query(
        "INSERT INTO Account (Email,Password,active,img) VALUES (?,?,?,?)",
        [req.body.email, passwordHash.generate(req.body.password), 0,"https://firebasestorage.googleapis.com/v0/b/hygeia-312122.appspot.com/o/defaultuser.png?alt=media&token=b5b986cd-c0fa-4dc7-875d-5c3b48ac9368"],
        (err, result) => {
          if (err) {
            console.log("error", err);
          } else {
            // Insert information into Patient table
            connection.query(
              "INSERT INTO patient (p_Firstname,p_Lastname,Birthday,Birthplace,Phonenumber,Email,Role,Sexe,IdEstablishment,Bloodgroup,NSS,Wilaya,token_patient,Address,Situation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                req.body.name,
                req.body.lastname,
                req.body.birthday,
                req.body.birthplace,
                req.body.phonenumber,
                req.body.email,
                req.body.role,
                req.body.sexe,
                5, 
                req.body.bloodgroupe, 
                "", 
                req.body.wilaya , 
                req.body.token , 
                req.body.adresse, 
                req.body.situation, 
              
              ],
              (err, result) => {
            
                if(err){
                  console.log('error',err); 
                  return;
                }
                res
                .status(200)
                .send("Votre compte a été créé avec succès");
                
                connection.query("Select IdPatient from Patient where Email =  ? ",
                [req.body.email],(err,IdPatient)=>{
                  if (err) {
                    console.log("error", err);
                  } else {
                    console.log("Role",req.body.role);
                    if(req.body.role =="Etudiant" ){
                      connection.query("insert into student values(?,?,?)",
                      [IdPatient[0].IdPatient,req.body.add,req.body.groupe],);
                    }
                    console.log("Id Patient",IdPatient[0].IdPatient); 
                    connection.query("INSERT INTO personalhistory(Smoke,Cigarette,Chiquer,Boxchique,Token,Boxtoken,Ageoftoken,Smoked,duration,alcohol,other,IdPatient) VALUES (? , ? ,?,?,?,?,?,?,?,?,?,?)",[
                      0,
                      0,
                      0,
                      0, 
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      "",
                      IdPatient[0].IdPatient,] 
                      ,(err,res)=> {
                        connection.release(); 
                  
                   
                        if(err) {
                          console.log(err); 
                        }
                         // Send confirmation email
                    const { email, password } = req.body;
                    const token = jwt.sign(
                      { email, password },
                      process.env.JWT_SECRET_CODE,
                      { expiresIn: "3d" }
                    );
                    const template = fs.readFileSync("views/mail/mailTemplate.ejs").toString();
                    const url = "http://localhost:3000/";
                    const html = ejs.render(template,{
                        "name": req.body.name, 
                        "lastname":req.body.lastname, 
                        "title": "Bienvenue a hygieia",
                        "text": "Vous avez enregistré un compte sur Hygieia, avant de pouvoir utiliser votre compte,vous devez vérifier qu'il s'agit bien de votre adresse e-mail" , 
                        "action": url+"users/patient/activate?token="+token, 
                        "value" : token,
                    });
                    var transporter = nodemailer.createTransport({
                      service: "gmail",
                      auth: {
                        user: process.env.HYGIEA_EMAIL,
                        pass: process.env.HYGIEA_EMAIL_PASSWORD,
                      },
                    });
                    var mailOptions = {
                      from: process.env.HYGIEA_EMAIL,
                      to: req.body.email,
                      subject: "Email de confirmation",
                      html: html, 
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log("finaly")
                       
                      }
                    });
                      }
                    )
                   
                   
                    // create transporter
                   
                    // adding mailOptions
                   
                    // send confirmation email using transporter and mailOptions
                   
                  }
                })
                console.log(result);
                
              }
            );
           
            // Patient.findOne({where : {Email :req.body.email}}).then(patient => {
            //   if(patient !==null) {
            //     Medical_File.create({IdPatient :patient.IdPatient ,
            //        Adddate: Date.now()}).then(result => {
            //          console.log(result.toJSON())
            //        }).catch(err => {
            //          console.log(err)
            //        })
          
          
            //   }
            // }).catch(err => {
            //   console.log(err)
            // })
  
          }
        }
      );

    }

  })
})
 
};
const activatePatientAccount = async (req, res) => {
  // read token value
  const token = req.query.token;
  // decodeToken
  jwt.verify(token, process.env.JWT_SECRET_CODE, (err, decodedToken) => {
    if (err) {
      console.log("error", err);
      res.send("Lien expire, vous devez demander un autre lien d'activation.")
    } else {
      pool.getConnection(function(err, connection) {
        connection.query(
          "UPDATE account SET active = 1 WHERE Email = ?",
          [decodedToken.email],
          (err, result) => {
            if (err) {
              console.log("error", err);
              res.status(404).send("ERROR");
            } else {
              res.send("Votre compte a été activé avec succès");
            }
          }
        );
      })
    
    }
  });
};
async function checkIfUserAlreadyexists(email) {
  return new Promise(function (resolve, reject) {
    db.query(
      "SELECT * FROM Account WHERE Email = ?",
      [email],
      function (err, rows) {
        if (rows === undefined) {
          reject(new Error("Error rows is undefined"));
        } else {
          resolve(rows.length == 0);
        }
      }
    );
  });
}
// cookie will expire in 3 days
const maxAge = 3 * 24 * 60 * 60;
function login(req, res) {
  console.log('we were');
  pool.getConnection(function(err,connection) {
    Account.findOne({ where: { email: req.body.email } })
    .then((account) => {
      if (account === null) {
        res.status(401).json({
          message: "Invalid email!",
        });
      } else {
        if (account.active) {
          let result = passwordHash.verify(req.body.password, account.Password);
          if (result) {
            // get the patient data from patient table
          
            Patient.findOne({ where: { Email: account.Email } })
              .then((patient) => {
                if (patient !== null) {
                  connection.query("Select * from patient,Account where patient.Email = ? and Account.Email = ?", [req.body.email,req.body.email],(err,result)=>{
                    console.log(result[0]);
                              const token = jwt.sign(
                                {
                                IdPatient: result[0].IdPatient,
                                   NSS: result[0].NSS,
            Firstname: result[0].p_Firstname,
            Lastname: result[0].p_Lastname,
            Birthday:result[0].Birthday,
            Sexe: result[0].Sexe,
            Bloodgroup:result[0].Bloodgroup,
            Situation: result[0].Situation,
            Address: result[0].Address,
            Wilaya:result[0].Wilaya,
            Role:result[0].Role,
            token_patient:result[0].token_patient,
            Phonenumber:result[0].Phonenumber,
            Picture:result[0].img,
            Email:result[0].Email,
            Birthplace:result[0]. Birthplace,
            IdEstablishment:result[0].IdEstablishment},
                                process.env.JWT_SECRET_CODE,
                                { expiresIn: maxAge },
                                function (err, token) {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    res.status(200).json({
                                      message:
                                        "Authentification réussie!",
                                      token: token,
                                    });
                                  }
                                }
                              );
                             })
                
               
                } else {
                  res.json({
                    message: "Ce compte n'existe pas !!",
                  });
                }
              })
              .catch((err) => console.log(err));
          } else {
            res.status(401).json({
              message: "Mot de passe incorrect!",
            });
          }
        } else {
          res.json({
            message: "Ce compte est désactivé",
          });
        }
      }
    })
    .catch((error) => {
      res.json({
        message: "Something went wrong!",
        error: error,
      });
    })
  })
 
}
const getProfile = (req,res) => {
  const email = req.body.email ; 
  console.log(req.body.email);
  db.query("SELECT * FROM patient where email = ? ",
  [email],(err,result)=> {
    if(err) {
      console.log('err',err)
    }else {
      return res.send(result);
    }
  })
}
const updateProfile = (req,res)=> {
pool.getConnection(function(err,connection){
 connection.query(
    "Update patient set p_Firstname = ? ,p_Lastname = ? ,Birthday = ?,Birthplace = ? ,Phonenumber = ? ,Email = ? ,Role = ?,Sexe = ?,Picture = ? ,Bloodgroup = ?,NSS = ? ,Wilaya = ? ,token_patient = ?,Address = ? ,Situation = ?",
    [
      req.body.name,
      req.body.lastname,
      req.body.birthday,
      req.body.birthplace,
      req.body.phonenumber,
      req.body.email,
      req.body.role,
      req.body.sexe,
      req.body.picture , 
      req.body.bloodgroupe, 
      "", 
      req.body.wilaya , 
      "", 
      req.body.adresse, 
      req.body.situation, 
    ],(err,result)=> {
      if(err) {
        console.log(err,"error"); 
      } else {
         res.send("Changements effectué avec succée");
      }

    }); 
});
}
module.exports = { signupPatient, activatePatientAccount, login,getProfile ,updateProfile,uploadPicture};
require("dotenv").config();
const db = require("../util/db").db;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passwordHash = require("password-hash");
const {Patient ,Account} = require('../models/user')
const {Medical_File}=require('../models/dossier')

const signupPatient = async (req, res) => {
  console.log(req.body);
  const url = "http://localhost:3000/";
  // check if user already exist
  var exist = await checkIfUserAlreadyexists(req.body.email);
  if (!exist) {
    return res.status(404).send("Ce compte existe déja");
  } else {
    // Insert information into Account table
    db.query(
      "INSERT INTO account (Email,Password,active) VALUES (?,?,?)",
      [req.body.email, passwordHash.generate(req.body.password), 0],
      (err, result) => {
        if (err) {
          console.log("error", err);
        } else {
          // Insert information into Patient table
          db.query(
            "INSERT INTO patient (Firstname,Lastname,Birthday,Birthplace,Phonenumber,Email,Role,Sexe) VALUES (?,?,?,?,?,?,?,?)",
            [
              req.body.name,
              req.body.lastname,
              req.body.birthday,
              req.body.birthplace,
              req.body.phonenumber,
              req.body.email,
              req.body.role,
              req.body.sexe,
            ],
            (err, result) => {
              if (err) {
                console.log("error", err);
              } else {
                // Send confirmation email
                const { email, password } = req.body;
                const token = jwt.sign(
                  { email, password },
                  process.env.JWT_SECRET_CODE,
                  { expiresIn: "3d" }
                );
                // create transporter
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: process.env.HYGIEA_EMAIL,
                    pass: process.env.HYGIEA_EMAIL_PASSWORD,
                  },
                });
                // adding mailOptions
                var mailOptions = {
                  from: process.env.HYGIEA_EMAIL,
                  to: req.body.email,
                  subject: "Email de confirmation",
                  html: `
                  <h1>Please click on the given link  to activate your 
                  account</h1>
                  <form method="POST" action="${url}users/patient/activate?token=${token}">
                  <button type="submit"  name="token" value='${token}'>Confirmer</button>
                  </form>
                
                  `,
                };
                // send confirmation email using transporter and mailOptions
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    return res
                      .status(200)
                      .send("Votre compte a été créé avec succès");
                  }
                });
              }
            }
          );
          //// creation du dossier médical
          Patient.findOne({where : {Email :req.body.email}}).then(patient => {
            if(patient !==null) {
              Medical_File.create({IdPatient :patient.IdPatient ,
                 Adddate: Date.now()}).then(result => {
                   console.log(result.toJSON())
                 }).catch(err => {
                   console.log(err)
                 })
        
        
            }
          }).catch(err => {
            console.log(err)
          })

        }
      }
    );
  }
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
      db.query(
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
    }
  });
};
async function checkIfUserAlreadyexists(email) {
  return new Promise(function (resolve, reject) {
    db.query(
      "SELECT * FROM account WHERE email = ?",
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
                  const token = jwt.sign(
                    {
                      Email: patient.Email,
                      IdPatient: patient.IdPatient,
                    },
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
    });
}
module.exports = { signupPatient, activatePatientAccount, login };

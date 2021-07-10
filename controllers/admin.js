require("dotenv").config();
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const db = require("../util/db").db;
const pool = require("../util/pool");

const addNewUser = (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET_CODE, (err, decodedToken) => {
    if (err) {
      console.log("error", err);
      return res.status(404).send("ERROR");
    } else {
      if (req.body.role == "administrateur") {
        db.query(
          "INSERT INTO account (Email,Password,active) VALUES (?,?,?)",
          [req.body.email, passwordHash.generate(req.body.password), 1],
          (err, result) => {
            if (err) {
              console.log("error", err);
              return res.status(404).send("ERROR");
            } else {
              db.query(
                "INSERT INTO administrator (Lastname,Firstname,Birthday,Sexe,Phonenumber,Email,IdAdmin_Second) VALUES (?,?,?,?,?,?,?)",
                [
                  req.body.lastname,
                  req.body.firstname,
                  req.body.birthday,
                  req.body.sexe,
                  req.body.phonenumber,
                  req.body.email,
                  decodedToken.IdAdmin,
                ],
                (err, result) => {
                  if (err) {
                    console.log("error", err);
                    return res.status(404).send("ERROR");
                  }
                  return res.status(200).send("added successfully");
                }
              );
            }
          }
        );
      } else {
        db.query(
          "INSERT INTO account (Email,Password,active) VALUES (?,?,?)",
          [req.body.email, passwordHash.generate(req.body.password), 1],
          (err, result) => {
            if (err) {
              console.log("error", err);
              return res.status(404).send("ERROR");
            } else {
              db.query(
                "INSERT INTO users (Lastname,Firstname,Birthday,Sexe,Phonenumber,Email,IdAdmin_Second,Role) VALUES (?,?,?,?,?,?,?)",
                [
                  req.body.lastname,
                  req.body.firstname,
                  req.body.birthday,
                  req.body.sexe,
                  req.body.phonenumber,
                  req.body.email,
                  decodedToken.IdAdmin,
                  req.body.role,
                ],
                (err, result) => {
                  if (err) {
                    console.log("error", err);
                    return res.status(404).send("ERROR");
                  }
                  return res.status(200).send("added successfully");
                }
              );
            }
          }
        );
      }
    }
  });
};
let patients, admins, users;
const getGestion = (req, res, next) => {
  pool
    .execute(
      "SELECT * FROM account , patient  where account.Email = patient.Email"
    )
    .then(([rows, fieldData]) => {
      patients = rows;
      pool
        .execute(
          "SELECT * FROM account , administrator admin  where account.Email = admin.Email"
        )
        .then(([rows, fieldData]) => {
          admins = rows;
          pool
            .execute(
              "SELECT * FROM account , users   where account.Email = users.Email"
            )
            .then(([rows, fieldData]) => {
              users = rows;
              return res.render("admin/Gestion_comptes", {
                patients: patients,
                admins: admins,
                meds: users,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};


const postChangeStatus = (req, res, next) => {
  let email = req.body.email; 
  let status = req.body.status;
  console.log("email: " + email)
  console.log("status: " + status)
  if (status == 0) status = 1
  else status = 0;
  pool
    .execute("UPDATE  account SET active = ? WHERE Email = ? ", [status, email])
    .then(([row, fieldData]) => {
      console.log("The status of the account has been changed ! ")
    })
    .catch((err) => {
      console.log(err);
    });
};
const postDeleteAccount = (req,res,next) => {
  const email = req.body.email ;
  console.log(email)
  const query = "DELETE FROM account WHERE Email=?"
  pool.execute(query ,[email]).then(([row,fieldData]) => {
    console.log("ACCOUNT DELETED!!")
     
  }).catch(err => {
    console.log(err)
  })
}
module.exports = {
  addNewUser,
  getGestion,
  postChangeStatus,
  postDeleteAccount,
  
};

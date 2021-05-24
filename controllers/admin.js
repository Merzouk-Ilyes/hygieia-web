require("dotenv").config();
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const db = require("../util/db").db;



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
module.exports = {
  addNewUser,
};

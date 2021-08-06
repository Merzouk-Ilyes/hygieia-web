require("dotenv").config();
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const db = require("../util/db").db;
const pool = require("../util/pool");
const { Account, User, Admin ,Patient} = require("../models/user");
const bodyParser = require("body-parser");

// const addNewUser = (req, res, next) => {
//   const token = req.cookies.token;
//   jwt.verify(token, process.env.JWT_SECRET_CODE, (err, decodedToken) => {
//     if (err) {
//       console.log("error", err);
//       return res.status(404).send("ERROR");
//     } else {
//       if (req.body.role == "administrateur") {
//         db.query(
//           "INSERT INTO account (Email,Password,active) VALUES (?,?,?)",
//           [req.body.email, passwordHash.generate(req.body.password), 1],
//           (err, result) => {
//             if (err) {
//               console.log("error", err);
//               return res.status(404).send("ERROR");
//             } else {
//               db.query(
//                 "INSERT INTO administrator (Lastname,Firstname,Birthday,Sexe,Phonenumber,Email,IdAdmin_Second) VALUES (?,?,?,?,?,?,?)",
//                 [
//                   req.body.lastname,
//                   req.body.firstname,
//                   req.body.birthday,
//                   req.body.sexe,
//                   req.body.phonenumber,
//                   req.body.email,
//                   decodedToken.IdAdmin,
//                 ],
//                 (err, result) => {
//                   if (err) {
//                     console.log("error", err);
//                     return res.status(404).send("ERROR");
//                   }
//                   return res.status(200).send("added successfully");
//                 }
//               );
//             }
//           }
//         );
//       } else {
//         db.query(
//           "INSERT INTO account (Email,Password,active) VALUES (?,?,?)",
//           [req.body.email, passwordHash.generate(req.body.password), 1],
//           (err, result) => {
//             if (err) {
//               console.log("error", err);
//               return res.status(404).send("ERROR");
//             } else {
//               db.query(
//                 "INSERT INTO users (Lastname,Firstname,Birthday,Sexe,Phonenumber,Email,IdAdmin_Second,Role) VALUES (?,?,?,?,?,?,?)",
//                 [
//                   req.body.lastname,
//                   req.body.firstname,
//                   req.body.birthday,
//                   req.body.sexe,
//                   req.body.phonenumber,
//                   req.body.email,
//                   decodedToken.IdAdmin,
//                   req.body.role,
//                 ],
//                 (err, result) => {
//                   if (err) {
//                     console.log("error", err);
//                     return res.status(404).send("ERROR");
//                   }
//                   return res.status(200).send("added successfully");
//                 }
//               );
//             }
//           }
//         );
//       }
//     }
//   });
// };
const addUser = (req, res, next) => {
  // const token = req.cookies.token;
  const status = req.body.role == "administrateur" ? 1:0;
  Account.findOne({ where: { email: req.body.email } }).then((account) => {
    if (account !== null) {
      return res.status(200).json({
        error: "Email already exists ! ",
      });
    } else {
      // jwt.verify(token, process.env.JWT_SECRET_CODE, (err, decodedToken) => {
      //   if (err) {
      //     console.log("error=>", err);
      //     return res.status(404).send("ERROR");
      //   } else {
      Account.create({
        Email: req.body.email,
        Password: passwordHash.generate(req.body.password),
        active: status,
      })
        .then((result) => {
          if (req.body.role == "administrateur") {
            Admin.create({
              Firstname:req.body.firstname,
              Lastname:req.body.lastname ,
              Birthday :req.body.birthday,
              Birthplace:req.body.birthplace,
              Sexe :req.body.sexe,
              Phonenumber:req.body.phone,
              Email:req.body.email,
            })
              .then((result) => {
                console.log("created successfuly" + req.body.email )
                if(result!==null ) {
                  return res.json({
                    message:"Account created successfuly!"
                  })
                }
              })
              .catch((err) => console.log(err));
          }else {
            User.create({
              Firstname:req.body.firstname,
              Lastname:req.body.lastname ,
              Birthday :req.body.birthday,
              Birthplace:req.body.birthplace,
              Sexe :req.body.sexe,
              Role:req.body.role,
              Phonenumber:req.body.phone,
              Email:req.body.email,
              IdAdmin:2,
            })
              .then((result) => {
                if(result!==null ) {
                  return res.json({
                    message:"Account created successfuly!"
                  })
                }
                
              })
              .catch((err) => console.log(err));


          }
        })
        .catch((err) => {
          console.log(err);
        });

      //     }
      // });
    }
  });
};

let patients, admins, users;
const getGestion = (req, res, next) => {

  const token = req.cookies.jwt;
jwt.verify(token, process.env.JWT_SECRET_CODE, (err, decodedToken) => {
        if (err) {
          console.log("error=>", err);
          return res.status(404).send("ERROR");
        }else {
        console.log("token=>",decodedToken.firstname)
     
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
                first:decodedToken.firstname,
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
  }})
};

const postChangeStatus = (req, res, next) => {
  let email = req.body.email;
  let status = req.body.status;
  console.log("email: " + email);
  console.log("status: " + status);
  if (status == 0) status = 1;
  else status = 0;
  pool
    .execute("UPDATE  account SET active = ? WHERE Email = ? ", [status, email])
    .then(([row, fieldData]) => {
      console.log("The status of the account has been changed ! ");
    })
    .catch((err) => {
      console.log(err);
    });
};
const postDeleteAccount = (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  const query = "DELETE FROM account WHERE Email=?";
  pool
    .execute(query, [email])
    .then(([row, fieldData]) => {
      console.log("ACCOUNT DELETED!!");
    })
    .catch((err) => {
      console.log(err);
    });
};



const getData = (req,res,next) => {

  Admin.findOne({ where: { email: req.body.email } }).then((admin) => {
    if (admin !== null) {
      
      return  res.json({ 
        firstname:admin.Firstname,
        lastname:admin.Lastname ,
        birthday :admin.Birthday,
        birthplace:admin.Birthplace,
        sexe :admin.Sexe,
        role:"administrateur",
        phonenumber:admin.Phonenumber,
        email:admin.Email,
      }) ;
    } else {
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user !== null) {
          return  res.json({
            firstname:user.Firstname,
            lastname:user.Lastname ,
            birthday :user.Birthday,
            birthplace:user.Birthplace,
            sexe :user.Sexe,
            role:user.Role,
            phonenumber:user.Phonenumber,
            email:user.Email,
          }) ;
        }else{
          Patient.findOne({ where: { email: req.body.email } }).then((user) => {
            if (user !== null) {
              return  res.json({
                firstname:user.Firstname,
                lastname:user.Lastname ,
                birthday :user.Birthday,
                birthplace:user.Birthplace,
                sexe :user.Sexe,
                role:user.Role,
                phonenumber:user.Phonenumber,
                email:user.Email,
              });
            }
          });
        }
      }); 
    }
  });
};

const postUpdate = (req,res,next) => {
  console.log(req.body.lastname + "wow",
    req.body.firstname + "wow2",
    req.body.birthday,
    req.body.birthplace,
    req.body.sexe,
    req.body.phone,
    req.body.role,
    req.body.email,);
  if (req.body.role == "administrateur") {
    db.query("UPDATE administrator set Firstname = ? , Lastname = ? , Birthday = ?,  Birthplace = ? , Sexe = ? , Phonenumber = ? where Email = ?  ",
      [
        req.body.firstname,
        req.body.lastname,      
        req.body.birthday,
        req.body.birthplace,
        req.body.sexe,
        req.body.phone,
        req.body.email,
      ],(err, result) => {
        if (err) {
          console.log("error", err);
          return res.status(404).send("ERROR");
        }else{
          return res.json({
            message:"Le compte a etait bien modifier !"
            })  
        }
      }
    );
  }else{
    if(req.body.role == "médecin" || req.body.role == "aide-soignant" || req.body.role == "rh"){
      db.query("UPDATE users set Firstname=? and Lastname =? and Birthday=? and Birthplace=? and Sexe=? and Phonenumber =? where Email = ?   ",
      [
        req.body.firstname,
        req.body.lastname,    
        req.body.birthday,
        req.body.birthplace,
        req.body.sexe,
        req.body.phone,
        req.body.email,
      ],(err, result) => {
        if (err) {
          console.log("error", err);
          return res.status(404).send("ERROR");
        }else{
          return res.json({
            message:"Le compte a etait bien modifier !"
            })  
        }
      }
    );
  }else{
    db.query("UPDATE patient set Firstname=? and Lastname =? and Birthday=? and Birthplace=? and Sexe=? and Phonenumber =? where Email = ?   ",
    [
      req.body.firstname,
      req.body.lastname,    
      req.body.birthday,
      req.body.birthplace,
      req.body.sexe,
      req.body.phone,
      req.body.email,
    ],(err, result) => {
      if (err) {
        console.log("error", err);
        return res.status(404).send("ERROR");
      }else{
        return res.json({
          message:"Le compte a etait bien modifier !"
          })  
      }
      }
    );
  }   
  }      
    
  
};

const logout = (req,res,next) => {
  res.cookie('jwt' ,'' ,{maxAge:1})
  return res.redirect("/users/login")
};

module.exports = {
  
  postUpdate,
  getData,
  getGestion,
  postChangeStatus,
  postDeleteAccount,
  addUser,
  logout
};

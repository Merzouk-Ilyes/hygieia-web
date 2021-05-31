require("dotenv").config();
const { Account, User, Admin } = require("../models/user");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const { db } = require("../util/db");


exports.getLogin = (req, res, next) => {
  res.render("auth/index", { error: "" });
};

exports.getForget = (req, res, next) => {
  res.render("auth/forgot");
};

// cookie will expire in 3 days
const maxAge = 3 * 24 * 60 * 60;
let cpt = 0;
//login controller for everyone except patient
exports.login = (req, res) => {
  if (cpt == 3) {
    Account.findOne({ where: { email: req.body.email } }).then((account) => {
      account.active = false;
      account.save();
      return res.render("auth/index", {
        error:
          "votre compte a été désactivé, contactez l'administrateur pour le réactiver",
      });
    });
  }
  Account.findOne({ where: { email: req.body.email } })
    .then((account) => {
      if (account === null) {
        res.render("auth/index", {
          error: "Email incorrect!",
        });
      } else {
        if (account.active) {
          let result = passwordHash.verify(req.body.password, account.Password);
          if (result) {
            // check if it's a normal user (médecin ,aide-soignant ou RH)
            User.findOne({ where: { Email: account.Email } })
              .then((user) => {
                if (user !== null) {
                  //this is a normal user
                  const token = jwt.sign(
                    {
                      email: user.Email,
                      IdUser: user.IdUser,
                    },
                    process.env.JWT_SECRET_CODE,
                    { expiresIn: maxAge },
                    function (err, token) {
                      if (err) {
                        console.log(err);
                      } else {
                        res.cookie("jwt", token, {
                          httpOnly: true,
                          maxAge: maxAge * 1000,
                        });
                        //here happens the redirection
                        res.status(200).json({
                          message:
                            "Authentication successful! you are " + user.Role,
                          token: token,
                        });
                      }
                    }
                  );
                } else {
                  //this is an admin
                  Admin.findOne({ where: { Email: account.Email } })
                    .then((admin) => {
                      if (admin !== null) {
                        const token = jwt.sign(
                          {
                            email: admin.Email,
                            IdAdmin: admin.IdAdmin,
                          },
                          process.env.JWT_SECRET_CODE,
                          { expiresIn: maxAge },
                          function (err, token) {
                            if (err) {
                              console.log(err);
                            } else {
                              res.cookie("jwt", token, {
                                httpOnly: true,
                                maxAge: maxAge * 1000,
                              });

                              res.status(200).json({
                                message:
                                  "Authentication successful! ur an admin",
                                token: token,
                              });
                            }
                          }
                        );
                      }
                    })
                    .catch((err) => console.log(err));
                }
              })
              .catch((err) => console.log(err));
          } else {
            cpt = ++cpt;
            console.log("cpt ==>>", cpt);
            res.render("auth/index", {
              error: "Mot de passe incorrect",
            });
          }
        } else {
          res.render("auth/index", {
            error: "Votre compte est bloqué",
          });
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
exports.changePassword= (req,res)=> {

  res.render('auth/changePassword');
}
exports.changePasswordPost = (req,res)=> {

 if(req.body.password.length == 0  || req.body.password2.length == 0 ) {

 return res.send({
  "message" :"error", 
  "error": "invalid input", 
})
 } else {
db.query("SELECT * FROM ACCOUNT WHERE Email = ?",
["f.djellali@esi-sba.dz"] , (err,result)=> {
  if(result.length == 0) {
    return res.send({
      "message" :"error", 
      "error": "Account d'ont exists", 
    })
  }else {
    const old_password = result[0].Password ; 
    if(old_password != req.body.password) {
      return res.send({
        "message" :"error", 
        "error": "invalid old password", 
      });
     
    }else {
      db.query("UPDATE Account SET Password = ?   where Email = ? ",
      [req.body.password2,"f.djellali@esi-sba.dz"],(err,result) =>{
        console.log(err);
        return res.send({
          "message" :"success", 
          "error": "mot de passe changé avec succées", 
        });
      })


    }
  }

}
)
 }
}

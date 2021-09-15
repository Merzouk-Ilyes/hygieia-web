require("dotenv").config();
const { Account, User, Admin } = require("../models/user");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const { db } = require("../util/db");
const pool = require("../util/db").pool;
const nodemailer  = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const sendNotif = require('../app');

exports.logOut = (req,res,next)=> {
  console.log("wow");
  res.clearCookie("jwt"); 
  res.redirect('/users/login');
 res.status(200).json({
    msg: "Disconnected",
    });
}

exports.getLogin = (req, res, next) => {  

  if(req.headers.cookie == null ) {
    res.render("auth/index", {error : ""}); 
    return; 
  }
  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  // user not connected ; 
  if(parsedCookie == null ) {
    res.render("auth/index", {error : ""}); 
    return; 
  }
  // user connected ;
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    (err,decodedToken)=> {
      console.log(decodedToken);
    if(decodedToken.role == "administrateur")  {
    // res.redirect('/users/home'); admin home 
 return   res.redirect('/users/admin/gestion');
      }else if (decodedToken.role == "médecin") {
   return     res.redirect('/users/medecin/list'); 
    }else if(decodedToken.role =="rh" ) {
      // redirect home rh 
          res.send('<h1> interface rh</h1>'); 
    }else if(decodedToken.role = "aide-soignant") {
      // redirect home aide 
      res.send('<h1> interface aide soignant</h1>'); 
    }else {
      res.render("auth/index", {error : ""}); 
    }
        if (err) {
            console.log('error',err); 
            res.render("auth/index", {error : ""}); 
        }}); 
};
exports.getForget = (req, res, next) => {
  res.render("auth/forgot");
};
exports.getHome = (req,res,next) => {
  if(req.headers.cookie == null ) {
    res.render("auth/index", {error : ""}); 
    return; 
  }
  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  // user not connected ; 
  if(parsedCookie == null ) {
    res.render("auth/index", {error : ""}); 
    return; 
  }
  // user connected ;
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    (err,decodedToken)=> {
      console.log(decodedToken);
    if(decodedToken.role == "administrateur")  {
      res.redirect('/users/admin/gestion'); 
    }else if (decodedToken.role == "médecin") {
     res.redirect('/users/medecin/home'); 
    }else if(decodedToken.role =="rh" ) {
          res.send('<h1> interface rh</h1>'); 
    }else if(decodedToken.role = "aide-soignant") {
      res.send('<h1> interface aide soignant</h1>'); 
    }else {
      res.redirect('/users/login'); 
    }
        if (err) {
            console.log('error',err); 
        }}); 
}

// cookie will expire in 3 days
const maxAge = 3 * 24 * 60 * 60;
let cpt = 0;
//login controller for everyone except patient
exports.login = (req, res) => {
  console.log("called");
  if (cpt == 3) {
    Account.findOne({ where: { email: req.body.email } }).then((account) => {
      account.active = false;
      account.save();
      return res.status(200).json({
        error: "votre compte a été désactivé",
        });
    });
  }
  Account.findOne({ where: { email: req.body.email } })
    .then((account) => {
      if (account === null) {
       return res.status(200).json({
        error: "Email incorrect!",
        });
      } else {
        if (account.active) {

         
          

          
          let result = req.body.password == account.Password ; 
         if(!result ) {
          result = passwordHash.verify(req.body.password, account.Password);
         }

          if (result) {
            // check if it's a normal user (médecin ,aide-soignant ou RH)
            User.findOne({ where: { Email: account.Email } })
              .then((user) => {
                if (user !== null) {
                  //this is a normal user
                  const token = jwt.sign(
                    {
                      firstname:user.Firstname,
                      email: user.Email,
                      IdUser: user.IdUser,
                      role: user.Role, 
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
                        return res.status(200).json({
                          message: "Authentication successful!",
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
                            firstname:admin.Firstname,
                            email: admin.Email,
                            IdAdmin: admin.IdAdmin,
                            role: "administrateur",
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
                              return res.status(200).json({
                                message: "Authentication successful!",
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
            return res.status(200).json({
              error: "Mot de passe incorrect",
              });
          }
        } else {
          return res.status(200).json({
            error: "Votre compte est désactivé",
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
  console.log("mabakich bezzaf");
  console.log(req.body);

 if(req.body.password.length == 0  || req.body.passowrd2.length == 0 ) {

 return res.send({
  "message" :"error", 
  "error": "invalid input", 
})
 } else {
   pool.getConnection(function(err, connection){
    connection.query("SELECT * FROM ACCOUNT WHERE Email = ?",
    [req.body.email] , (err,result)=> {
      if(result.length == 0) {
        console.log("you here 1"); 
        return res.send({
          "message" :"error", 
          "error": "Account d'ont exists", 
        })
      }else {
        const old_password = result[0].Password ; 
        if(old_password != req.body.password) {
          console.log("you here 2"); 
          return res.send({
            "message" :"error", 
            "error": "invalid old password", 
          });
        }else {
          connection.query("UPDATE Account SET Password = ?   where Email = ? ",
          [req.body.password2,req.body.email],(err,result) =>{
            console.log(err);
            console.log("you here 3"); 
            return res.send({
              "message" :"success", 
              "error": "mot de passe changé avec succées", 
            });
          })
        }
      }
    }
    )
   })

 }
}
exports.postForget = (req,res , next) => {
  const url = "http://localhost:3000";
  console.log(req.body.email);
  pool.getConnection(function(err,connection){
    connection.query("SELECT * FROM Account WHERE email = ?",[req.body.email],(err,result) => {
      if(err){
          console.log('error:',err);
      }else{
        console.log('result',result);
        
        if(result.length == 0) {
       return res.status(200).json({
            error : "ce compte n'éxiste pas" , 
          }); 
          // check if it's not a << patient >> 
        } else {
     connection.query("Select * from patient where email = ? ",
     [req.body.email],(err,result2)=> {
       if(result2.length != 0) {
        const email = req.body.email ; 
        const token = jwt.sign(
            {email},
            process.env.JWT_SECRET_CODE,
            { expiresIn: "3d" }
          );      
          const template = fs.readFileSync("views/mail/mailTemplate.ejs").toString();
          const url = "http://localhost:3000/";
          const html = ejs.render(template,{
              "name": req.body.email, 
              "lastname":"", 
              "title": "Mail de récupération",
              "text": "Quelqu'un a demandé que le mot de passe soit réinitialisé pour votre compte , S'il s'agit d'une erreur, ignorez simplement cet e-mail et rien ne se passera." , 
              "action": url+"users/Confirm?token="+token, 
              "value" : token,
          });
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
            subject: "Email de récupération",
            html: html, 
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
            return  res.status(200).json({
                message : "Un mail de récupération vous a été envoyé" , 
              });
            }
          });  
       }else {
        res.status(200).json({
          error : "Ce compte n'éxiste pas" , 
        })
       }
     }
     )
        }    
      }
        
  })
  }); 

}
exports.postConfirm = (req,res, next)=> {
const token = req.query.token;       
return res.render('auth/resetPassword',{token : token}); 
}

exports.postReset = (req,res, next)=> {

  const token = req.query.token;
  jwt.verify(token, process.env.JWT_SECRET_CODE,
      (err,decodedToken) => {
          if (err) {
              console.log('error',err); 
          } else {
              const email = decodedToken.email ; 
              const password = passwordHash.generate(req.body.password)
                pool.getConnection(function(err,connection){
                  pool.query("Update Account set password = ? where email = ? ",
                  [password,email],(err,result)=> {
                      if(err) {
                        console.log('error',err); 
                      }else {
                        res.send("Votre mot de passe est changé");
                      }
    
                  });
                });
             
          }

  }); 

}


exports.download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "resources/static/assets/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
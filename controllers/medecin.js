require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../util/db").db;


exports.getUpdateMedicalFile = (req,res,next)=> {
res.render('medicalfile/updateMedicalFile');

}
exports.getMedicalFile = (req,res,next)=> {
  
  console.log(req.query.id);
  db.query("Select * from Patient,personalhistory where Patient.IdPatient = ? and personalhistory.IdPatient = ? ",
  [req.query.id,req.query.id],
  (err,result1)=> {
    db.query("Select * from haveintoxication where haveintoxication.Idpersonalhistory = ?  ",
    [result1[0].Idpersonalhistory],
    (errors,result2)=> {
      db.query("Select * from medicalsurgicalhistory where medicalsurgicalhistory.IdPatient = ?", 
      [req.query.id,],(err,result3) => {


        res.render("medicalfile/medicalFile",
          {
            dataB : result1[0] ,
            
            dataC: result2,
          }
        
        );
      }

      )
      
    }
    )

  } );

}
exports.logout = (req,res,next)=> {
  res.clearCookie("jwt");
 res.send({
   "message" : "Disconnected" 
 })
}
exports.getList = (req, res, next) => {
  if(req.headers.cookie == null ) {
    res.redirect('/users/login');
    return; 
  }
  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  // user not connected ; 
  if(parsedCookie == null ) {
    res.redirect('/users/login');  
    return; 
  }
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    (err,decodedToken)=> {
      console.log(decodedToken);
    
   if (decodedToken.role == "médecin") {
      // medecin home provisoire ; 
      db.query("Select * from patient",(err,result)=> {
        if(err) {
          console.log('error',err) ; 
    
        }else {
          res.render("medicalfile/list", { listitems: result });
  
        }
      })
    }else {
      res.redirect('/users/home');
    }
        if (err) {
            console.log('error',err); 
            res.render("auth/index", {error : ""}); 
        }}); 
 
  };
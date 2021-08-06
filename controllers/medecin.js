require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../util/db").db;
const pool = require("../util/db").pool;

exports.deleteAffection = (req,res)=> {
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.query("DELETE from  havecongenitalcondition where Idpatient = ? and name_ccondition = ?",
    [ req.body.IdPatient,req.body.name_ccondition],
    (err, result) => {
      console.log(err);
      if(err) {
        return res.send('error'); 
      }else{
        return res.send('done');
      }
    }
);
  }); 
} 
exports.addAffection = (req,res)=>{
  const id_patient = req.body.IdPatient ;
  console.log(req.body.ended);
  pool.getConnection(function(err, connection) {
    connection.query("Select * from havecongenitalcondition where Idpatient  = ?  and  name_ccondition = ?",
    
    [id_patient,req.body.name_ccondition],(err,exist)=> {
      if(exist.length > 0) {
        console.log("exist");
        return res.send('exist'); 
      }else {
      connection.query("INSERT INTO havecongenitalcondition (name_ccondition,ended,Idpatient) values ( ?, ? ,?) ",
      [req.body.name_ccondition, req.body.ended == "Non" ? 0 : 1,id_patient],
      (err, result) => {
        console.log(err);
        console.log(result);
        if(err) {
          return res.send('error'); 
  
        }else{
          return res.send('done');
        }
      }
  );
      }
    })

  
    
  }); 
}
exports.updatePersonalHistory = (req,res)=> {
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.query("Update personalhistory set Token = ? , Smoke = ? , Cigarette =  ? , Chiquer =  ?,Boxchique= ? ,Boxtoken = ? , Ageoftoken = ? ,  Smoked = ?,   duration = ?  , alcohol = ? where Idpersonalhistory = ?"
    ,[
      req.body.token == 'true' ? 1 : 0 ,
      req.body.Smoke == 'true' ? 1 : 0, 
      req.body.Cigarette , 
      req.body.Chiquer  == 'true' ? 1 : 0, 
      req.body.Boxchique, 
      req.body.Boxtoken, 
      req.body.Ageoftoken, 
      req.body.Smoked == 'true' ? 1 : 0 , 
      req.body.duration, 
      req.body.alcohol  == 'true' ? 1 : 0, 
      req.body.Idpersonalhistory,
    ],(err,reslut)=> {
    console.log(err);
      if(err) {
        return res.send('error'); 
      }else{
        return res.send('done');
      }
    }
    ) 
  }); 
}
exports.getUpdateMedicalFile = (req,res,next)=> {
  pool.getConnection(function(err, connection) {
    if (err) throw err; 
    pool.query("Select * from Patient,personalhistory where Patient.IdPatient = ? and personalhistory.IdPatient = ?",
  [req.query.id,req.query.id],(err,result1)=> {
    if(err) {
      console.log(err); 
      res.redirect('/users/medecin/list');
      return; 
    }
    console.log(result1);
    connection.query("Select * from haveintoxication where Idpersonalhistory = ?  ",
    [result1[0].Idpersonalhistory], (err,intoxicationPatient)=> {
    connection.query("Select *  from intervention",
    (err,interventions)=> {
      connection.query("Select *  from intoxication",
      (err,intoxications)=> {
        connection.query("Select *  from congenitalcondition",(err,congenitalconditions)=>{
          connection.query("Select *  from generalillness",(err,generalillness)=> {

            connection.query("Select * from drug",(err,drugs)=> {

             connection.query(" select * from containgeneralillness where Idpatient = ?",
             [req.query.id], 
             (err,containgeneralillnessPatient)=>{

 connection.query(" select * from containintervention where Idpatient = ?",
 [req.query.id],
             (err,containinterventionPatient)=>{
               
              connection.query(" select * from containsdrug where num_sick = ?",
              [req.query.id],
              (err,containsdrugPatient)=>{
                connection.query("select * from havecongenitalcondition where Idpatient = ? ",[
                  req.query.id,
                ],(err,havecongenitalconditionPatient)=> {
                  connection.query("select * from haveallergy  where Idpatient = ?",[req.query.id],(err,allergies)=>{
                    res.render('medicalfile/updateMedicalFile', { 
                      data : result1[0],
                      allergies : allergies, 
                      intoxications : intoxications,
                      congenitalconditions : congenitalconditions, 
                      generalillness : generalillness, 
                      interventions: interventions , 
                      intoxicationPatient :intoxicationPatient,
                      drugs : drugs,
                      containsdrugPatient : containsdrugPatient,  
                      containinterventionPatient: containinterventionPatient,  
                      containgeneralillnessPatient: containgeneralillnessPatient, 
                      havecongenitalconditionPatient : havecongenitalconditionPatient,              
                     });
                  })
                 
                })
                
              })
             });
             });
       
            })
          

          });

        });
      }
      ); 
    }
    ); 
    })
    });
  })

  
 
    
  




}
exports.getMedicalFile = (req,res,next)=> {
  pool.getConnection(function(err, connection) {
    connection.query("Select * from Patient,personalhistory where Patient.IdPatient = ? and personalhistory.IdPatient = ? ",
    [req.query.id,req.query.id],
    (err,result1)=> {
      connection.query("Select * from haveintoxication where haveintoxication.Idpersonalhistory = ?  ",
      [result1[0].Idpersonalhistory],
      (errors,result2)=> {
        connection.query("Select * from medicalsurgicalhistory where medicalsurgicalhistory.IdPatient = ?", 
        [req.query.id,],(err,result3) => {
          connection.query("SELECT * FROM medicalexam WHERE idpatient = ? ", [req.query.id],
      (err,dataa) =>{
        if(err) {
          console.log("error", err);
        }else{
          res.render('medicalfile/medicalFile', { title: 'Exam Data', examdata: dataa, dataB : result1[0] ,
              
          dataC: result2,});
        }
      }
    );
  
          
          
        }
  
        )
        
      }
      )
  
    } );
  });

  

}
exports.postIntoxication = (req,res,next) => {
  
  const id_patient = req.body.IdPatient ;
  pool.getConnection(function(err, connection) {
    connection.query("Select * from haveIntoxication where Idpersonalhistory = (SELECT Idpersonalhistory from personalhistory WHERE Idpatient = ?) and  name_intoxication =?",
    
    [id_patient,req.body.name_intoxication],(err,exist)=> {
      if(exist.length > 0) {
        console.log("exist");
        return res.send('exist'); 

      }else {

      connection.query("INSERT INTO haveIntoxication SET Idpersonalhistory = (SELECT Idpersonalhistory from personalhistory WHERE Idpatient = ?), name_intoxication = ?, degree_intoxication = ?",
      [id_patient, req.body.name_intoxication, req.body.degree_intoxication],
      (err, result) => {
        console.log(err);
        console.log(result);
        if(err) {
          return res.send('error'); 
  
        }else{
          return res.send('done');
        }
      }
  );
      }
    })

  
    
  }); 


}
exports.logout = (req,res,next)=> {
  res.clearCookie("jwt");
 res.send({
   "message" : "Disconnected" 
 })
}
exports.getList = (req, res, next) => {
  pool.getConnection(function(err, connection) {
    connection.query("Select * from patient",(err,result)=> {
      if(err) {
        console.log('error',err) ; 
  
      }else {
        res.render("medicalfile/list", { listitems: result });
  
      }
    });
  }); 

  return ;
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
      });
    }else {
      res.redirect('/users/home');
    }
        if (err) {
            console.log('error',err); 
            res.render("auth/index", {error : ""}); 
        }}); 
 
  };
  exports.deleteIntoxication = (req,res,next)=> {
    console.log('gg');
    pool.getConnection(function(err, connection) {
      connection.query("DELETE from  haveintoxication where Idpersonalhistory = ? and name_intoxication = ?",
      [ req.body.Idpersonalhistory,req.body.name_intoxication],
      (err, result) => {
        if(err) {
          return res.send('error'); 
        }else{
          return res.send('done');
        }
      }
  );
    });
  }
exports.getExamFile = (req,res,next)=> {
    }
exports.addMaladie = (req,res)=>{
      const id_patient = req.body.IdPatient;
      pool.getConnection(function(err, connection) {
        connection.query("Select * from containgeneralillness where Idpatient  = ?  and  name_GIllness = ?",
        
        [id_patient,req.body.name_GIllness],(err,exist)=> {
          if(exist.length > 0) {
            console.log("exist");
            return res.send('exist'); 
          }else {
          connection.query("INSERT INTO containgeneralillness (name_GIllness,dateillness,Idpatient) values ( ?, ? ,?) ",
          [req.body.name_GIllness, req.body.dateillness,id_patient],
          (err, result) => {
            console.log(err);
            console.log(result);
            if(err) {
              return res.send('error'); 
      
            }else{
              return res.send('done');
            }
          }
      );
          }
        })
    
      
        
      }); 
    }


    exports.deleteMaladie = (req,res)=> {
      pool.getConnection(function(err, connection) {
        connection.query("DELETE from  containgeneralillness where IdPatient = ? and name_GIllness = ?",
        [ req.body.IdPatient,req.body.name_GIllness],
        (err, result) => {
          if(err) {
            return res.send('error'); 
          }else{
            return res.send('done');
          }
        }
    );
      });
    }
    exports.addAlergie = (req,res)=>{
      console.log(req.body); 
      const id_patient = req.body.IdPatient;
      pool.getConnection(function(err, connection) {
        connection.query("Select * from haveallergy where Idpatient  = ?  and  name_drug = ?",
        
        [id_patient,req.body.name_drug],(err,exist)=> {
          if(exist.length > 0) {
            console.log("exist");
            return res.send('exist'); 
          }else {
          connection.query("INSERT INTO haveallergy (name_drug,type,Idpatient) values ( ?, ? ,?) ",
          [req.body.name_drug, req.body.type,id_patient],
          (err, result) => {
            console.log(err);
            console.log(result);
            if(err) {
              return res.send('error'); 
            } else{
              return res.send('done');
            }
          }
      );
          }
        })   
      }); 
    }
    exports.deleteAllergie = (req,res)=> {
      pool.getConnection(function(err, connection) {
        connection.query("DELETE from  haveallergy where Idpatient = ? and name_drug = ?",
        [ req.body.IdPatient,req.body.name_drug],
        (err, result) => {
          console.log(err);
          if(err) {
            return res.send('error'); 
          }else{
            return res.send('done');
          }
        }
    );
      });
    }
require("dotenv").config();
const jwt = require("jsonwebtoken");
var moment = require('moment');

var dateFormat = require('dateformat');
const db = require("../util/db").db;
const PDFDocument = require('../util/pdfkit-tables');
const doc = new PDFDocument({compress:false});
const fs = require('fs');
const path = require('path');
const pool = require("../util/db").pool;
const uploadFile = require('../middleware/uploadFile');
exports.getAcce = (req,res,next)=> { 
  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    (err,decodedToken)=> {
      pool.getConnection(function(err,connection) {
        var rdv_today = 0 ; 
            var rdv_reprogrammation  = 0 ; 
        var rdv_demande = 0 ; 
        connection.query("select * from rdv where date_rdv between date_sub(now(),INTERVAL 1 DAY) and now() and situation_rdv in ('14','3','7','19') and iduser = ? ",[decodedToken.IdUser],(err,result_today)=> {
          console.log('rdv today',result_today,decodedToken.idUser);
          rdv_today = result_today.length ; 
          connection.query("select * from rdv where situation_rdv = '17' and iduser = ? ",[decodedToken.idUser],(err,result_reprogrammation)=> {
            rdv_reprogrammation = result_reprogrammation.length ; 
          });
          connection.query("select * from rdv where situation_rdv = '0' and iduser = ?",[decodedToken.IdUser],(err,result_demande)=> {
            connection.query("select * from rdv,patient where rdv.iduser = ? and  rdv.date_rdv between date_sub(now(),INTERVAL 1 DAY) and now() and rdv.situation_rdv in ('14','3','7','19') and rdv.idpatient = patient.idpatient order by rdv.date_rdv DESC limit 4 ",
            [decodedToken.IdUser],(err,rdvs)=> {
              console.log("rdvs",rdvs);
              rdv_demande = result_demande.length; 
              connection.query("select * from notification  where iduser = ? and sent_by = 'patient' order by date_notif DESC ",[decodedToken.IdUser],
              (err,notifs)=> {
                console.log(err);
              connection.query("select * from notification where iduser = ? and sent_by = 'patient' and opened = 0",
              [decodedToken.IdUser],
              (err,notifssee)=> {
                console.log(err);
                connection.release(); 
                console.log("idUser",decodedToken.IdUser);
                res.render('home/home',{
                  'rdv_demande':rdv_demande,
                  'rdv_today':rdv_today, 
                  'rdv_reprogrammation':rdv_reprogrammation, 
                   'rdvs'  :rdvs, 
                   'moment' : moment,
                   'notifs' : notifs, 
                   'iduser' : decodedToken.IdUser,
                    'notifssee' : notifssee.length, 
                }); 
              })
   
              })
 
           
           
           
           
            })
         
          });
        }); 
      })
    });


}
exports.changePictureFile = (req,res,next) => {
  console.log('ds');
  console.log(req,res);
}
exports.getExam = (req,res,next) => {
  pool.getConnection(function(err, connection) {
    console.log('wiw');
    console.log("here we go");
    console.log(req.query.id);
    connection.query("SELECT * FROM patient WHERE idpatient = ? ",
    [req.query.id],
    (err,result)=> {
      console.log(result);
      if(err) {
        console.log("error", err);
      }else{
        res.render('MedicalExam/MedicalExam', { title: 'Exam insertion', insertexam: result[0],});
      }
    });
  });
}
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
  [req.query.id,req.query.id,req.query.id],(err,result1)=> {
    if(err) {
      console.log(err); 
      res.redirect('/users/medecin/list');
      return; 
    }

    connection.query("Select * from medicalexam where idpatient = ? ",[req.query.id],(err,exams)=>{
 
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
                        exams : exams,
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
      });
    })
   
    });
  })

  
 
    
  




}
exports.getMedicalFile = (req,res,next)=> {
  pool.getConnection(function(err, connection) {
    id_patient = req.query.id;
    connection.query("Select * from Patient,personalhistory where Patient.IdPatient = ? and personalhistory.IdPatient = ? ",
    [req.query.id,req.query.id],
    (err,result1)=> {
      connection.query("Select * from haveintoxication where haveintoxication.Idpersonalhistory = ?  ",
      [result1[0].Idpersonalhistory],
      (errors,result2)=> {
        connection.query("Select * from medicalsurgicalhistory where medicalsurgicalhistory.IdPatient = ?", 
        [req.query.id,],(err,result3) => {
          connection.query("SELECT *,DATE_FORMAT(date_medicalexam, '%Y-%m-%d') as date_exam FROM medicalexam inner join users ON medicalexam.iduser = users.IdUser WHERE idpatient = ? ", [req.query.id],
      (err,dataa) =>{
        if(err) {
          console.log("error", err);
        }else{
     
          res.render('medicalfile/medicalFile', { title: 'Exam Data', examdata: dataa, dataB : result1[0] ,dataC: result2,});
        }
      }
    );})
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
exports.getProfile = (req,res,next)=> {
  const days  = ['dimanche','lundi','mardi','mercredi','jeudi']; 
  const heure = ['8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23',];
  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    (err,decodedToken)=> {
      pool.getConnection(function(err, connection) {
        connection.query("Select * from Work where iduser = ?",
        [decodedToken.IdUser],(err,workTime)=>{
          connection.query("Select * from users where Email = ?",
          [decodedToken.email],(err,infoPer)=>{
            console.log(infoPer);
            res.render('auth/profile',{days:days, heure:heure,infoPer:infoPer[0],workTime:workTime}); 
          })
        }); 
      })

    });

 
}
exports.getList = (req, res, next) => {
  pool.getConnection(function(err, connection) {
    connection.query("Select * from patient",(err,result)=> {
      const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    (err,decodedToken)=> {
      connection.query("select * from notification where iduser = ? and sent_by = 'patient' and opened = 0",
      [decodedToken.IdUser],

      (err,notifssee)=> {
        console.log('notifssee' , notifssee) ;
        connection.query("select * from notification  where iduser = ? and sent_by = 'patient' order by date_notif DESC ",[decodedToken.IdUser],
        (err,notifs)=> {
          connection.release();
          res.render("medicalfile/list", { 
            listitems: result,
            'notifssee' : notifssee.length, 
          'notifs' : notifs,
          'moment' :moment,
          'iduser' :decodedToken.IdUser,
          });

        })

      });
  

    })

      
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

    exports.getMedicalExam = (req,res,next)=> {
      pool.getConnection(function(err, connection) {
        console.log(req.query.id);
        console.log(req.query.med);
        console.log(req.query.date);
        acc_med = req.query.med;
        acc_id = req.query.id;
        acc_date = req.query.date;
        connection.query("SELECT *, patient.Role as p_role FROM patient inner join medicalexam inner join users ON patient.IdPatient = medicalexam.idpatient and medicalexam.iduser = users.IdUser WHERE medicalexam.iduser = ? and medicalexam.idpatient = ? and date_medicalexam = ?"
        ,[req.query.med, req.query.id, req.query.date], 
        (err, resultat2) =>{
          if(err){
            console.log("error", err);
          }else{
            res.render('MedicalExam/updateMedicalExam', { title: 'Exam Data', data: resultat2[0] });
          }
        }
        );
    })} 
    
    exports.getMedicalExam = (req,res,next)=> {
      pool.getConnection(function(err, connection) {
        console.log(req.query.id);
        console.log(req.query.med);
        console.log(req.query.date);
        connection.query("SELECT * FROM medicalexam WHERE iduser = ? and idpatient =? and date_medicalexam = ?"
        ,[req.query.id, req.query.med, req.query.date],
        (err, resultat2) =>{
          if(err){
            console.log("error", err);
          }else{
            console.log(resultat2);
            res.render('medicalfile/updateMedicalExam', { title: 'Exam Data', data: resultat2 });
          }
        }
        );
    })}

    exports.postEditExam = (req,res,next) =>{
      db.query("UPDATE medicalexam SET weight = ?, height= ?, TA=?, blood_sugar= ?, imc=?, hearing_l=?, hearing_r=?, visual_l=?, visual_r=?,c_visual_l=?,c_visual_r=?, Skin_disorders=?,else_Skin_disorders=?,skin_exam=?,tearing=?,pain=?,redness=?,spot_eyes=?,else_ophthalmo=?,ophthalmo_exam=?,whistling=?,angina=?,epistaxis=?,rhinorrhea=?,else_orl=?,orl_exam=?,muscleache=?,jointache=?,spinalache=?,Neuroloache=?,else_locomo=?, Movement_discomfort=?, fatigability=?,locomo_exam=?,cough=?,nocturn_dyspnea=?,daytime_dyspnea=?,expectorations=?,chest_pain=?,else_thoracic=?,respir_rate=?,respir_exam=?,palpitation=?, edema=?, cyanosis=?, walking_pain=?, resting_pain=?, exertion_pain=?, permanent_pain=?, else_cardio=?, pulse=?, cardio_exam=?, appetite=?, transit=?, selles=?, pyrosis=?,vomiting=?, rectal_bleeding=?,abdo_pain=?, else_digestive=?, carie=?, gingivopathy=?, abdomens=?, hernie=?, liver=?, else_dig=?, digestive_exam=?, pollakiuria=?, dysurie=?, hematuria=?, urination_burns=?, renal_colic=?, losses=?, cycle=?, else_genito=?, bourses=?, breasts=?, tr=?, tv=?, genito_exam=?, sleep=?, headache=?, dizziness=?, emptiness_fear=?, consciousness_loss=?, paresis=?, paresthesia=?, else_neuro=?, tremor=?, reflexes=?, romberg=?, coordination=?, sensitivity=?, achilles_l=?, achilles_r=?, motor_skills=?, Oculaire_l=?, oculaire_r=?, neuro_exam=?, ecchymose=?, bleeding_tendencies=?, else_hemato=?, petechia=?, purpura=?, rate=?, cervical_ganglia=?, subaux_ganglia=?, Subclavicular_ganglia=?, inguin_ganglia=?, hemato_exam=?, fam_obesity=?, fam_thinness=?, else_endo=?, Thyroid=?, testicles=?, mam_glands=?, endo_exam=?, respiratory_func=?, circulatory_func=?, motrice_func=? WHERE iduser =? AND idpatient =? AND date_medicalexam =?", 
      [req.body.poids,req.body.taille,req.body.TA, req.body.Glycemie, req.body.ICM, req.body.Audition_OG, req.body.Audition_OD, req.body.sans_OG, req.body.sans_OD, req.body.avec_OG, req.body.avec_OD, req.body.value_Affection, req.body.affection_autre, req.body.peau_exam,req.body.value_Larmoiement, req.body.value_Douleurs,req.body.value_Rougeurs, req.body.value_Tache,req.body.ophtalmo_autre,req.body.ophtalmo_exam, req.body.value_Sifflements, req.body.value_Angines, req.body.value_Epistaxis, req.body.value_Rhinorhee, req.body.orl_autre, req.body.orl_exam, req.body.value_Musculaires,req.body.value_Articulaires,req.body.value_Vertebrales,req.body.value_Neurologiques,req.body.locomo_autre,req.body.value_Mouvements,req.body.value_Fatigabilite,req.body.locomo_exam,req.body.value_Toux,req.body.value_Nocturne,req.body.value_Diurne,req.body.value_Expectorations,req.body.value_Thoraciques,req.body.respi_autres,req.body.frequence,req.body.respi_exam,req.body.value_Palpitation,req.body.value_Oedemes,req.body.value_Cyanose, req.body.value_Marche, req.body.value_Repos,req.body.value_Effort,req.body.value_Permanents,req.body.cardio_autres,req.body.Pouls,req.body.cardio_exam,req.body.Appetit,req.body.Transit,req.body.Selles,req.body.value_Pyrosis,req.body.value_Vomissements,req.body.Rectorragies,req.body.DouleurAbdo,req.body.digestif_autres,req.body.value_carie,req.body.value_Gingivopathie,req.body.Abdomens,req.body.Hernie,req.body.Foie,req.body.dig_autres,req.body.digestif_exam,req.body.value_Pollakiurie,req.body.value_Dysurie, req.body.value_Hematurie, req.body.value_Brulures,req.body.value_Coliques,req.body.Pertes,req.body.value_Cycles,req.body.genito_autres,req.body.Bourses,req.body.Seins,req.body.TR,req.body.TV,req.body.genito_exam,req.body.Sommeil,req.body.value_Cephaliees,req.body.value_Vertiges,req.body.value_Vide,req.body.value_Connaissance,req.body.value_Paresie,req.body.value_Paresthesie,req.body.Neuro_autres,req.body.Tremblement,req.body.value_Reflexes,req.body.value_Romberg,req.body.value_Coordination,req.body.value_Sensibilite,req.body.value_GAchil,req.body.value_DAchil,req.body.Motricite,req.body.value_GOcul,req.body.value_DOcul,req.body.Neuro_exam,req.body.value_Ecchymoses,req.body.value_Hemo,req.body.Hemato_autres,req.body.Petechies,req.body.Purpura,req.body.Rate,req.body.value_Cervicaux,req.body.value_Auxi,req.body.value_Clavi,req.body.value_Inguinaux,req.body.hemato_exam,req.body.value_Obese,req.body.value_Maigre,req.body.Endo_autres,req.body.Tyroide,req.body.Testicules,req.body.Glandes,req.body.Endo_exam,req.body.respire,req.body.circule,req.body.Fmotrice,acc_med, acc_id, acc_date],
      (err, resultat3) => {
        if(err) {
          console.log("error", err);
        }else{
          console.log('medical exam data updated !');
          console.log(acc_med);
          console.log(acc_id);
          console.log(acc_date);
        }
      })
    }
    
    exports.deleteExamFile = (req,res,next) =>{
      console.log('you are in the delete exam file');
    
 console.log(req.body);
 var day=dateFormat(req.body.exdate,"yyyy-mm-dd");
 console.log(day);
 db.query("DELETE FROM medicalexam WHERE iduser = ? AND idpatient =? AND date_medicalexam = ? ", 
 [req.body.med,req.body.pat,day],
   (err, result) =>{
     console.log(result);
     if(err){
       console.log(err);
     return res.send({'msg' : 'erreur','err':true});
     }else{
       return res.send({'msg' : 'Examen médical supprimé avec succées','err':false});
     }
   }
 ); 
    
    }

    exports.postExamenMedical = (req,res,next) => {

  
      console.log('you r in the post med exam');
      let today = new Date();
      let month = today.getMonth() +1;
      let year = today.getFullYear();
      let date = today.getDate();
      let minutes = today.getMinutes(); 
      let seconds = today.getSeconds(); 
      let db_date = year + '-'+ month + '-' + date;
      console.log('db-date',db_date); 
      id_patient = req.query.id;
      console.log('id_patient officiel', id_patient);
      console.log(req.headers.cookie);
      const rawCookies = req.headers.cookie.split('; ');
      const parsedCookie = rawCookies[0].split('=')[1];
      jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
      async (err,decodedToken)=>   {
        console.log(decodedToken,'here');
        const id_medecin = decodedToken.IdUser;
        insertExam(req,res,next,db_date,id_patient,id_medecin);
      });
    }

    function insertExam(req,res,next,db_date,id_patient,id_medecin){
      pool.getConnection(function(err, connection) {
        const rawCookies = req.headers.cookie.split('; ');
        const parsedCookie = rawCookies[0].split('=')[1];
        jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
          (err,decodedToken)=> {
    
            console.log(decodedToken);
            console.log(id_medecin,id_patient,db_date)
         connection.query('select * from medicalexam where iduser = ? and  idpatient = ? and date_medicalexam = ?',  [id_medecin,id_patient,db_date],
         (err,check)=>{
          if(check.length > 0) {
         return   res.send({
              'err' : true , 
              'message' : 'il existe déja un examen médical',
            })
          }
          connection.query("SELECT * FROM patient WHERE idpatient = ?", [id_patient],
          (err, result) => {
            if(err) {
              console.log("error", err);
            }else{
              console.log('Robish first');
              connection.query("SELECT * FROM users WHERE IdUser = ?", [id_medecin],
              (err, resultt) =>{
              if(err) {
                console.log("error", err);
              }else{
                console.log('post request can start');
                console.log(req.body);
                connection.query("INSERT INTO medicalexam SET iduser = ?, idpatient = ?, date_medicalexam = ?, weight = ?, height= ?, TA=?, blood_sugar= ?, imc=?, hearing_l=?, hearing_r=?, visual_l=?, visual_r=?,c_visual_l=?,c_visual_r=?, Skin_disorders=?,else_Skin_disorders=?,skin_exam=?,tearing=?,pain=?,redness=?,spot_eyes=?,else_ophthalmo=?,ophthalmo_exam=?,whistling=?,angina=?,epistaxis=?,rhinorrhea=?,else_orl=?,orl_exam=?,muscleache=?,jointache=?,spinalache=?,Neuroloache=?,else_locomo=?, Movement_discomfort=?, fatigability=?,locomo_exam=?,cough=?,nocturn_dyspnea=?,daytime_dyspnea=?,expectorations=?,chest_pain=?,else_thoracic=?,respir_rate=?,respir_exam=?,palpitation=?, edema=?, cyanosis=?, walking_pain=?, resting_pain=?, exertion_pain=?, permanent_pain=?, else_cardio=?, pulse=?, cardio_exam=?, appetite=?, transit=?, selles=?, pyrosis=?,vomiting=?, rectal_bleeding=?,abdo_pain=?, else_digestive=?, carie=?, gingivopathy=?, abdomens=?, hernie=?, liver=?, else_dig=?, digestive_exam=?, pollakiuria=?, dysurie=?, hematuria=?, urination_burns=?, renal_colic=?, losses=?, cycle=?, else_genito=?, bourses=?, breasts=?, tr=?, tv=?, genito_exam=?, sleep=?, headache=?, dizziness=?, emptiness_fear=?, consciousness_loss=?, paresis=?, paresthesia=?, else_neuro=?, tremor=?, reflexes=?, romberg=?, coordination=?, sensitivity=?, achilles_l=?, achilles_r=?, motor_skills=?, Oculaire_l=?, oculaire_r=?, neuro_exam=?, ecchymose=?, bleeding_tendencies=?, else_hemato=?, petechia=?, purpura=?, rate=?, cervical_ganglia=?, subaux_ganglia=?, Subclavicular_ganglia=?, inguin_ganglia=?, hemato_exam=?, fam_obesity=?, fam_thinness=?, else_endo=?, Thyroid=?, testicles=?, mam_glands=?, endo_exam=?, respiratory_func=?, circulatory_func=?, motrice_func=?",
                [id_medecin,id_patient,db_date,req.body.poids,req.body.taille,req.body.TA, req.body.Glycemie, req.body.ICM, req.body.Audition_OG, req.body.Audition_OD, req.body.sans_OG, req.body.sans_OD, req.body.avec_OG, req.body.avec_OD, req.body.value_Affection, req.body.affection_autre, req.body.peau_exam,req.body.value_Larmoiement, req.body.value_Douleurs,req.body.value_Rougeurs, req.body.value_Tache,req.body.ophtalmo_autre,req.body.ophtalmo_exam, req.body.value_Sifflements, req.body.value_Angines, req.body.value_Epistaxis, req.body.value_Rhinorhee, req.body.orl_autre, req.body.orl_exam, req.body.value_Musculaires,req.body.value_Articulaires,req.body.value_Vertebrales,req.body.value_Neurologiques,req.body.locomo_autre,req.body.value_Mouvements,req.body.value_Fatigabilite,req.body.locomo_exam,req.body.value_Toux,req.body.value_Nocturne,req.body.value_Diurne,req.body.value_Expectorations,req.body.value_Thoraciques,req.body.respi_autres,req.body.frequence,req.body.respi_exam,req.body.value_Palpitation,req.body.value_Oedemes,req.body.value_Cyanose, req.body.value_Marche, req.body.value_Repos,req.body.value_Effort,req.body.value_Permanents,req.body.cardio_autres,req.body.Pouls,req.body.cardio_exam,req.body.Appetit,req.body.Transit,req.body.Selles,req.body.value_Pyrosis,req.body.value_Vomissements,req.body.Rectorragies,req.body.DouleurAbdo,req.body.digestif_autres,req.body.value_carie,req.body.value_Gingivopathie,req.body.Abdomens,req.body.Hernie,req.body.Foie,req.body.dig_autres,req.body.digestif_exam,req.body.value_Pollakiurie,req.body.value_Dysurie, req.body.value_Hematurie, req.body.value_Brulures,req.body.value_Coliques,req.body.Pertes,req.body.value_Cycles,req.body.genito_autres,req.body.Bourses,req.body.Seins,req.body.TR,req.body.TV,req.body.genito_exam,req.body.Sommeil,req.body.value_Cephaliees,req.body.value_Vertiges,req.body.value_Vide,req.body.value_Connaissance,req.body.value_Paresie,req.body.value_Paresthesie,req.body.Neuro_autres,req.body.Tremblement,req.body.value_Reflexes,req.body.value_Romberg,req.body.value_Coordination,req.body.value_Sensibilite,req.body.value_GAchil,req.body.value_DAchil,req.body.Motricite,req.body.value_GOcul,req.body.value_DOcul,req.body.Neuro_exam,req.body.value_Ecchymoses,req.body.value_Hemo,req.body.Hemato_autres,req.body.Petechies,req.body.Purpura,req.body.Rate,req.body.value_Cervicaux,req.body.value_Auxi,req.body.value_Clavi,req.body.value_Inguinaux,req.body.hemato_exam,req.body.value_Obese,req.body.value_Maigre,req.body.Endo_autres,req.body.Tyroide,req.body.Testicules,req.body.Glandes,req.body.Endo_exam,req.body.respire,req.body.circule,req.body.Fmotrice],
                (err,examresult) =>{
                  if(err){
                    console.log('query insert error', err);
                  }else{
                    createPDF(req,res,next,id_medecin,id_patient,db_date);
                    console.log('Medical exam inserted!');
                  }
                }); 
              }}); 
            }
          });
         })
           
          });
        
      });
     
    }
    function createPDF(req,res,next,id_medecin,id_patient,db_date) {
      pool.getConnection(function(err, connection) {
        console.log('info res requete',id_medecin,id_patient,db_date );
        connection.query("select * from patient inner join medicalexam inner join users on patient.IdPatient = medicalexam.idpatient AND users.iduser = medicalexam.iduser WHERE medicalexam.iduser = ? AND medicalexam.idpatient =? AND medicalexam.date_medicalexam = ?", 
        [id_medecin, id_patient,db_date],
        async(err, resultat) => {
          console.log(resultat,'resultat de la requete bug');
          if(err) {
            console.log("error query innerjoin ", err);
          }else{
            console.log('every info selected');
            
            console.log('medical exam info selected 3');
            const doc = new PDFDocument({compress:false});
            name_file = 'Dr.'+resultat[0].Lastname + '_' +resultat[0].Firstname +'_' +db_date+ '.pdf';
    
            var column1 = 'Nom: ' + resultat[0].p_Lastname + '\nPrénom: ' + resultat[0].p_Firstname + '\nT.A: ' + resultat[0].TA +' mmHg';
            var column2 = 'Poids: ' + resultat[0].weight + ' kgs' +'\nTaillse: ' + resultat[0].height +' cms'+'\nGlycémie: ' + resultat[0].blood_sugar + ' G/L';
            var column3 = 'Date: ' +db_date+ '\nMédecin: ' + resultat[0].Lastname + ' ' + resultat[0].Firstname + '\nICM: ' + resultat[0].imc + ' kgs';
         const file =   fs.createWriteStream(name_file); 
         try {
          doc.pipe(file);
         }catch(e) {
           if(e) {
             console.log(e);
           }
         }
         
            doc
              .fontSize(19)
              .font('Times-Bold')
              .text('UMP de l\'Ecole Nationale Supérieure d\'Informatique de Sidi Bel Abbès', {align: 'center'});
                        
              doc.moveDown();
                      
              const personnal = {
                headers: ['','',''],
                rows: [[column1,column2,column3]]
              };
            
              doc.table(personnal, {
                prepareHeader: () => doc.font('Times-Bold'),
                prepareRow: (row, i) => doc.font('Times-Roman').fontSize(12)
              });
                                      
              doc.moveDown();                 
              doc.moveDown();
      
              const informationTab = {
                headers: ['Audition', 'Acuité Visuelle'],
                rows: [
                  ['Oreille Droite : ' +resultat[0].hearing_r + '\nOreille Gauche : ' +resultat[0].hearing_l, 
                    'Sans Corrections :' + '\nOeil Droite : ' +resultat[0].visual_r + '\nOeil Gauche : ' +resultat[0].visual_l
                    + '\n\nAvec Corrections :' + '\nOeil Droite : ' +resultat[0].c_visual_r + '\nOeil Gauche : ' +resultat[0].c_visual_l]
                  ]};
      
              doc.table(informationTab, {
                prepareHeader: () => doc.font('Times-Bold'),
                prepareRow: (row, i) => doc.font('Times-Roman').fontSize(12)
              });
              doc.moveDown();
              function yesnofunc(x){
                if (x == 1) {
                  return 'Oui';
                }else{
                  return 'Non';
                }
              }   
            function regul(x){
                if (x == 1) {
                  return 'Régulier';
                }else{
                  return 'Irrégulier';
                }
              }
              const examen = {
                headers: ['Appareils', 'Interrogatoire', 'Examens Clinique'],
                rows: [
                    ['Peau et Muqueuse', 'Affections cutanées: ' + yesnofunc(resultat[0].Skin_disorders) + '\nAutres: ' + resultat[0].else_Skin_disorders, resultat[0].skin_exam],
                    ['Ophtalmologique', 'Larmoiement: '+yesnofunc(resultat[0].tearing)+'\nDouleurs: '+yesnofunc(resultat[0].pain)+'\nRougeurs: ' + yesnofunc(resultat[0].redness) +'\nTâches devant les yeux: '
                      +yesnofunc(resultat[0].spot_eyes) + '\nAutres: ' + resultat[0].else_ophthalmo, resultat[0].ophthalmo_exam],
                    ['O.R.L', 'Sifflements: '+yesnofunc(resultat[0].whistling)+'\nAngines répétées: '+ yesnofunc(resultat[0].angina)+'\nEpistaxis: ' 
                      +yesnofunc(resultat[0].epistaxis)+'\nRhinorhée:'+yesnofunc(resultat[0].rhinorrhea)+'\nAutres: '+resultat[0].else_orl, resultat[0].orl_exam],
                    ['Locomoteur', 'Douleurs: \nMusculaires: '+yesnofunc(resultat[0].muscleache)+'\nArticulaires: '+yesnofunc(resultat[0].jointache)+'\nVertébrales: '
                      +yesnofunc(resultat[0].spinalache)+'\nNeurologiques: '+yesnofunc(resultat[0].Neuroloache)+'\nAutres: '+resultat[0].else_locomo, 
                      '\nGênée de Mouvements: '+ yesnofunc(resultat[0].Movement_discomfort) + '\nFatigabilité: '+ yesnofunc(resultat[0].fatigability) + '\n\nRemarques: '+resultat[0].locomo_exam],
                    ['Respiratoire', 'Toux: '+yesnofunc(resultat[0].cough)+'\nDyspnée Nocturne: '+yesnofunc(resultat[0].nocturn_dyspnea)+'\nDyspnée Diurne: '
                      +yesnofunc(resultat[0].daytime_dyspnea)+'\nExpectorations: '+yesnofunc(resultat[0].expectorations)+'\nDouleurs Thoraciques: '+yesnofunc(resultat[0].chest_pain)+
                      '\nAutres: '+resultat[0].else_thoracic, 'Fréquence Réspiratoire: ' +resultat[0].respir_rate +'\n\nRemarques: '+ resultat[0].respir_exam],
                    ['Cardio-Vasculaire', 'Palpitation: ' + yesnofunc(resultat[0].palpitation)+ '\nOedèmes: ' + yesnofunc(resultat[0].edema) +'\nCyanose: '
                      +yesnofunc(resultat[0].cyanosis) + '\nDouleurs: \nÀ la marche: ' +yesnofunc(resultat[0].walking_pain)+ '\nAu repos: '+yesnofunc(resultat[0].resting_pain)
                      +'\nÀ l\'efforts: '+yesnofunc(resultat[0].exertion_pain)+ '\nPermanents: '+yesnofunc(resultat[0].permanent_pain) +'\n\nAutres:'+resultat[0].else_cardio, 
                      '\nPouls: ' + resultat[0].pulse + '\n\nRemarques: '+resultat[0].cardio_exam],
                    ['Digestif','Appétit: ' +resultat[0].appetite+ '\nTransit: ' +resultat[0].transit+ '\nSelles: '+ resultat[0].selles + '\nPyrosis: '
                      + yesnofunc(resultat[0].pyrosis) + '\nVomissements: '+yesnofunc(resultat[0].vomiting)+ '\nRectorragies: '+resultat[0].rectal_bleeding+ '\nDouleur abdominales: '
                      + resultat[0].abdo_pain + '\nAutres: ' +resultat[0].else_digestive, 'Denture: Carie: '+yesnofunc(resultat[0].carie)+ '\nGingivopathie: '
                      + yesnofunc(resultat[0].gingivopathy) + '\nAbdomens: ' +resultat[0].abdomens+ '\nHernie: ' + resultat[0].hernie+ '\nFoie: '+resultat[0].liver+ 
                      '\nAutres: ' + resultat[0].else_dig + '\n\nRemarques: '+resultat[0].digestive_exam],
                    ['Genito-Urinaire', 'Miction\nPollakiurie: ' +yesnofunc(resultat[0].pollakiuria) + '\nDysurie: '+yesnofunc(resultat[0].dysurie)+ '\nHématurie: ' +yesnofunc(resultat[0].hematuria)
                      +'\nBrûlures mictionnelles: ' +yesnofunc(resultat[0].urination_burns) + '\nColiques néphrétiques: ' +yesnofunc(resultat[0].renal_colic) + '\nPertes: ' +resultat[0].losses
                      + '\nCycles: '+regul(resultat[0].cycle)+'\nAutres: '+resultat[0].else_genito, 'Bourses: '+ resultat[0].bourses + '\nSeins: ' +resultat[0].breasts + '\nT.R: '+resultat[0].tr + '\nT.V: '+resultat[0].tv+ '\n\nRemarques: ' +resultat[0].genito_exam],                   
                    ['Neurologique et Psychisme', 'Sommeil: ' +resultat[0].sleep+ '\nCéphaliées: '+ yesnofunc(resultat[0].headache) +'\nVertiges: '+yesnofunc(resultat[0].dizziness)
                      + '\nPeur du vide: '+yesnofunc(resultat[0].emptiness_fear)+ '\nPerte de connaissance: ' +yesnofunc(resultat[0].consciousness_loss)+ '\nParésie: ' +yesnofunc(resultat[0].paresis)
                      + '\nParesthésie: '+yesnofunc(resultat[0].paresthesia)+ '\nAutres: '+resultat[0].else_neuro, 'Tremblement: '+resultat[0].tremor+ '\nRéflexes: '
                      + yesnofunc(resultat[0].reflexes) + '\nRomberg: ' + yesnofunc(resultat[0].romberg) + '\nCoordination: ' + yesnofunc(resultat[0].coordination) +'\nSensibilité: '
                      + yesnofunc(resultat[0].sensitivity)+ '\nAchilléen:\nDroit: '+ yesnofunc(resultat[0].achilles_r)+ ' Gauche: ' + yesnofunc(resultat[0].achilles_l) +'\nMotricité: '+ resultat[0].motor_skills
                      +'\nOculaires:\nDroit: ' +yesnofunc(resultat[0].oculaire_r) +' Gauche: ' +yesnofunc(resultat[0].oculaire_l) + '\n\nRemarques: ' +resultat[0].neuro_exam],
                    ['Hematologique et Ganglionnaire', 'Ecchymoses: '+yesnofunc(resultat[0].ecchymose)+'\nTendances aux hémorragies: '+yesnofunc(resultat[0].bleeding_tendencies)
                      +'\nAutres: ' +resultat[0].else_hemato , 'Pétéchies: ' +resultat[0].petechia + '\nPurpura: '+resultat[0].purpura + '\nRate: '+resultat[0].rate
                      +'\n\nGanglions:\nCervicaux: '+yesnofunc(resultat[0].cervical_ganglia)+ '\nSous Auxiliaires: '+yesnofunc(resultat[0].subaux_ganglia)+ '\nSous Claviculaires: '+yesnofunc(resultat[0].Subclavicular_ganglia)
                      +'\nInguinaux: '+yesnofunc(resultat[0].inguin_ganglia)+ '\n\nRemarques: '+resultat[0].hemato_exam],
      
                    ['Endocrinologie', 'Obésité familiale: ' +yesnofunc(resultat[0].fam_obesity) + '\nMaigreur familiale: ' + yesnofunc(resultat[0].fam_thinness) + '\nAutres: '
                      + resultat[0].else_endo, 'Tyroide: '+ resultat[0].Thyroid + '\nTesticules: ' +resultat[0].testicles + '\nGlandes mammaires: ' + resultat[0].mam_glands
                      + '\n\nRemarques: '+ resultat[0].endo_exam] 
                ]
              };
                                      
              doc.moveDown().table(examen);
      
              doc.addPage();
      
              doc
                .fontSize(16)
                .font('Times-Bold')
                .text('Explorations Foctionnelles',{align: 'center'});
      
              doc.moveDown();
      
              const ExplorationsTab = {
                headers: ['Fonction Respiratoire', 'Fonction Circulatoire', 'Fonction Motrice'],
                rows: [
                  [resultat[0].respiratory_func, resultat[0].circulatory_func, resultat[0].motrice_func]]
                };
      
                doc.moveDown().table(ExplorationsTab, {
                  prepareHeader: () => doc.font('Times-Bold').fontSize(12),
                  prepareRow: (row, i) => doc.font('Times-Roman').fontSize(12)
                });
              doc.end();
              const url = await uploadFile.uploadToStorage(name_file);
              console.log(url,"this is the url");
              connection.query("UPDATE medicalexam SET medical_exam = ? WHERE iduser =? AND idpatient =? AND date_medicalexam =?",
              [url,id_medecin, id_patient, db_date],
              (err, finalres)=>{
                if(err){
                  console.log("error", err);
                }else{
                  return   res.send({
                    'err' : false , 
                    'message' : 'Opération éffectué avec succées',
                  })
                  
                  console.log("Link updated wallah !");
                }}
              )
          }
        });
      })
    }
 
    
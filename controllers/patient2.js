require("dotenv").config();
const fs = require('fs');
const db = require("../util/db").db;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passwordHash = require("password-hash");
const {Patient ,Account} = require('../models/user')
const {Medical_File}=require('../models/dossier');
const ejs = require('ejs');
var moment = require('moment');
const pool = require("../util/db").pool;
const sendNotif = require('../app');

exports.getWork = (req,res)=> {
    pool.getConnection(function(err,connection){
        connection.query("SELECT  * from work",
        (err,result)=> {
            if(err) {
                connection.release();
                return res.send({"error" : err});
            }else {
             console.log(result); 
             connection.release(); 
            return res.send({
            'result' : result, 
            }); 
            }
        }); 
    }); 

}
exports.getExamMedicalPatient = async (req,res) => {

    const id_patient  = req.body.IdPatient; 
    console.log(id_patient);
    pool.getConnection(function(err,connection){
        connection.query("SELECT  * from sicknote where idpatient = ?",
        [id_patient,],(err,sickNote)=> {
            if(err) {
                return res.send({"error" : err})
            }else {
         
             connection.query("select * from medicalexam,doctor,users where idpatient = ? and medicalexam.iduser = doctor.iduser and users.iduser = doctor.iduser;",
             [id_patient],(err,result)=> {
                connection.query("SELECT  * from orientation where idpatient = ?",
                [id_patient],(err,orientation)=> {
                    connection.query("SELECT  * from medical_checkup where idpatient = ?",
                    [id_patient],(err,medical_checkup)=> {
                        connection.query("SELECT  * from prescription where idpatient = ?",
       [id_patient],(err,prescription)=> {
           if(err) {
          
               return res.send({"error" : err})
           }else {
         
connection.release(); 
console.log( 'result' , result, 
'medical_checkup' , medical_checkup, 
'orientation' , orientation,
'prescription' , prescription, 
'sicknote'  ,sickNote, )
           return res.send({
           'result' : result, 
           'medical_checkup' : medical_checkup, 
           'orientation' : orientation,
           'prescription' : prescription, 
           'sicknote' : sickNote, 
           });
           }
       }); 
                        if(err) {
                            return res.send({"error" : err})
                        }else {
                     
                      
                        }
                    }); 
                    if(err) {
                        return res.send({"error" : err})
                    }else {
                
                 
                    }
                }); 
                 if(err) {
                
                     return res.send({"error" : err});
                 }else {
        
     
     
                 }
             }); 
       
            }

        }); 
       
    }); 

}

exports.getSickNote = async (req,res) => {
    const id_patient  = req.body.id; 
    const date_medicalexam = req.body.date ; 
     pool.getConnection(function(err,connection){
        connection.query("SELECT  * from sicknote where idpatient = ?",
        [id_patient,],(err,result)=> {
            if(err) {
                return res.send({"error" : err})
            }else {
             console.log(result); 
            return res.send({
            'result' : result[0], 
            }); 
            }

        }); 
    }); 

}


exports.getOrientation= async (req,res) => {
    const id_patient  = req.body.id; 
     pool.getConnection(function(err,connection){
        connection.query("SELECT  * from orientation where idpatient = ?",
        [id_patient],(err,result)=> {
            if(err) {
                return res.send({"error" : err})
            }else {
             console.log(result); 
            return res.send({
            'result' : result[0], 
            }); 
            }
        }); 
    }); 
}
exports.getEvacuation= async (req,res) => {
    const id_patient  = req.body.id; 
     pool.getConnection(function(err,connection){
        connection.query("SELECT  * from evacuation where idpatient = ?",
        [id_patient],(err,result)=> {
            if(err) {
                return res.send({"error" : err})
            }else {
             console.log(result); 
            return res.send({
            'result' : result[0], 
            }); 
            }
        }); 
    }); 
}
exports.getOrdonnaces = async (req,res)=> {
    const id_patient  = req.body.id; 
    pool.getConnection(function(err,connection){
       connection.query("SELECT  * from prescription where idpatient = ?",
       [id_patient],(err,result)=> {
           if(err) {
            connection.release();
               return res.send({"error" : err})
           }else {
            connection.release();
            console.log(result); 
           return res.send({
           'result' : result, 
           }); 
           }
       }); 
   }); 
}
exports.getMedecinList = async (req,res)=> {
    console.log("we");
     pool.getConnection(function(err,connection){
         connection.query("select * from users,doctor,Account where users.IdUser = doctor.iduser and users.Email = Account.Email",(err,result)=>{
            if(err) {
                connection.release();
                return res.send({"error" : err})
            }else {
                connection.release();
             console.log(result); 
            return res.send({
            'result' : result, 
            }); 
            }
        })
     }); 
}
exports.getListRdv = (req,res)=> {
    console.log("we are there");
    const id_patient  = req.body.id; 
    console.log(id_patient); 
    pool.getConnection(function(err,connection){
        connection.query("SET  time_zone = '+0:00' ",(err,result)=> {
            connection.query("SELECT  * from rdv,users where rdv.idpatient = ? and  users.iduser = rdv.iduser order by date_rdv ASC ",
            [id_patient],(err,result)=> {

                if(err) {
                    console.log(err);
                    connection.release();
                    return res.send({"error" : err})
                }else {
                    connection.release();
                    console.log('from the get rv')
                 console.log(result); 
                return res.send({
                'result' : result, 
                }); 
            }
            }); 
        })
       
    }); 
}
exports.getMedicalCheckUp= async (req,res) => {
    const id_patient  = req.body.id; 
  
}

exports.changeDateRdv = async (req,res)=> {
    const idPatient = req.body.idPatient; 
    const idUser = req.body.idUser; 
    const date = req.body.date; 
    const new_date = req.body.new_date ; 
    console.log(idPatient, idUser, date, new_date);
    pool.getConnection(function(err,connection){
        connection.query("delete from haveproposition where date_rdv = ? and  idpatient = ? and iduser = ?",
        [date,idPatient,idUser,],(err,result)=> {
            console.log(err);
            connection.query("update rdv set date_rdv = ? where idpatient = ? and iduser = ? and date_rdv = ?",
            [new_date,idPatient,idUser,date,], 
            (err,result)=>{
                if(err){
                    console.log(err);
                    return res.send({"error" : err})
                }else {
                    connection.query("Select * from rdv,patient where date_rdv = ? and rdv.idpatient = ? and iduser = ? and patient.IdPatient = rdv.idpatient ",
                    [new_date,idPatient,idUser],(err,result)=> {
                        var next ;
                        if(result[0].situation_rdv == "6") {
                            sendNotifToMedecin("Reprogrammation du rendez-vous",
                            "le rendez-vous du patient"+ result[0].p_Lastname+ "a été reprogrammé le"+ new_date,
                            req.body.idUser,req.body.idPatient); 
                        next = "7";
                        }else if(result[0].situation_rdv =="18") {
                            
                            sendNotifToMedecin("Reprogrammation du rendez-vous",
                            "le rendez-vous du patient"+ result[0].p_Lastname+ "a été reprogrammé le"+ new_date,
                            req.body.idUser,req.body.idPatient); 
                       next = "19" ; 
                        }
                        connection.query("update rdv set situation_rdv = ? where idpatient = ? and iduser = ? and date_rdv = ?",
                        [next,idPatient,idUser,new_date],(err,result)=> {
                            if(err){
                                return res.send({"error" : err})
                            }else {
                                return res.send({"success" : 'success'})
                            }
                        })
                  
                    });
                }
        }) ;  
        })
     
})
};

exports.getDateProposedDate = async (req,res)=> {
    const idPatient = req.body.idPatient; 
    const idUser = req.body.idUser; 
    const date = req.body.date; 
    pool.getConnection(function(err,connection){
        connection.query("select * from rdv where date_rdv = ? and idpatient = ? and iduser = ?",
        [date,idPatient,idUser], 
        (err,result)=>{
            connection.query("select date_pro from haveproposition where date_rdv = ? and idpatient = ? and iduser = ?",
            [date,idPatient,idUser], 
            (err,result) => {
                return res.send({'proposition':result});
            });
        })
      


    }) ;  
}
exports.updateRdvanotherDate  =async (req,res)=> {
    const idPatient = req.body.idPatient; 
    const idUser = req.body.idUser; 
    const date = req.body.date;
    console.log('hi');
    console.log(req.body,idPatient,idUser,date);
    pool.getConnection(function(err,connection){
        connection.query("select * from rdv,patient where date_rdv = ? and rdv.idpatient = ? and iduser = ? and patient.IdPatient= rdv.IdPatient",

        [date,idPatient,idUser], 
        (err,result2)=>{
            console.log(err);
 
              connection.query("update rdv set situation_rdv = '17' where idpatient = ? and iduser = ? and date_rdv = ?",
                [idPatient,idUser,date],(err,result)=> {

                    sendNotifToMedecin("Demande de reprogrammation",
                    "Le patient"+ result2[0].p_Firstname +"vous demande une" +
"reprogrammation et est entrain d’attendre vos propositions"

                    ,req.body.iduser,req.body.idpatient); 
                    if(err){
                        return res.send({"error" : err})
                    }else {
                        return res.send({"success" : err})
                    }
                })
        

           
        })
    }) ; 
}
exports.validateRdv  =async (req,res)=> {
    const idPatient = req.body.idPatient; 
    const idUser = req.body.idUser; 
    const date = req.body.date;
    console.log('hi');
    console.log(req.body,idPatient,idUser,date);
    pool.getConnection(function(err,connection){
        connection.query("select * from rdv,patient where date_rdv = ? and rdv.idpatient = ? and iduser = ? and patient.IdPatient= rdv.IdPatient",

        [date,idPatient,idUser], 
        (err,result2)=>{
            console.log(err);
 
              connection.query("update rdv set situation_rdv = '14' where idpatient = ? and iduser = ? and date_rdv = ?",
                [idPatient,idUser,date],(err,result)=> {
                    sendNotifToMedecin("rendez-vous validée",
                    "Le patient"+ result2[0].p_Firstname +"a validé" +
"son rendez-vous"
                    ,req.body.iduser,req.body.idpatient); 
                    if(err){
                        return res.send({"error" : err})
                    }else {
                        return res.send({"success" : err})
                    }
                })
        

           
        })
    }) ; 
}
exports.updateRdv  =async (req,res)=> {
    const idPatient = req.body.idPatient; 
    const idUser = req.body.idUser; 
    const date = req.body.date;

    console.log(req.body,idPatient,idUser,date);
    pool.getConnection(function(err,connection){
        connection.query("select * from rdv,patient where date_rdv = ? and rdv.idpatient = ? and iduser = ? and patient.IdPatient = ?",
        [date,idPatient,idUser,idPatient], 
        (err,result)=>{
            if(err){
                console.log(err);
            }
            console.log("wow",result);
          
            var next = ""; 
            if(result[0].situation_rdv == "0"){
                sendNotifToMedecin("Annulation du rendez-vous","le patient" +result[0].p_Lastname +"a annulé le rendez-vous demandé avant que vous ne puissiez faire une action",
                req.body.idUser,req.body.idPatient);
                next = "1"; 
            }else if(result[0].situation_rdv == "3"){
                
                sendNotifToMedecin("Annulation de rendez-vous","le rendez-vous que vous avez confirmé avec "+result[0].p_lastname +" a été annulé.",
           req.body.idUser,req.body.idPatient);
                next = "5"; 
            }else if(result[0].situation_rdv == "6"){
                sendNotifToMedecin("Annulation de rendez-vous","le rendez-vous dont vous avez proposé une reprogrammation avec "+result[0].p_lastname +" été annulé."
    ,req.body.idUser,req.body.idPatient);
                next = "10";
            }else if(result[0].situation_rdv == "7"){
                sendNotifToMedecin("Annulation du rendez-vous reprogrammé",
                "le rendez-vous reprogrammé le" +date+ "avec le patient"+result[0].p_lastname +" été annulé."
                ,req.body.idUser,req.body.idPatient);
                next = "9"; 
            }else if(result[0].situation_rdv == "11"){
                sendNotifToMedecin("Annulation du rendez-vous",
                "le rendez-vous vous avez programmé le" +date+ "avec le patient"+result[0].p_Lastname +" été annulé."
                ,req.body.idUser,req.body.idPatient);
                next = "13"; 
            }else if(result[0].situation_rdv == "14"){
                sendNotifToMedecin("Annulation du rendez-vous",
                "Le rendez-vous confirmé que vous avez programmé"+
                "le"+date+ "avec"+  result[0].p_Lastname + "a été annulé"
                                ,req.body.idUser,req.body.idPatient);
                next = "15" ;
            }else if(result[0].situation_rdv == "19"){
                sendNotifToMedecin("Annulation du rendez-vous reprogrammé.",
                
                "Le patient" +  result[0].p_Lastname +  "a annulé le rendez-vous reprogrammé"
              
        
                                ,req.body.idUser,req.body.idPatient);
                next = "20" ;
            }else if(result[0].situation_rdv == "18"){
                sendNotifToMedecin("Annulation du rendez-vous reprogrammé.",
                "Le patient" +  result[0].p_Lastname +  "a annulé le rendez-vous reprogrammé"
                                ,req.body.idUser,req.body.idPatient);
                next = "22" ;
            }else if(result[0].situation_rdv == "17"){
                sendNotifToMedecin("Annulation du rendez-vous reprogrammé.",
                "Le patient" +  result[0].p_Lastname +  "a annulé le rendez-vous qui l'a demander reprogrammé"
                                ,req.body.idUser,req.body.idPatient);
                next = "20" ;
            }
            connection.query("update rdv set situation_rdv = ? where idpatient = ? and iduser = ? and date_rdv = ?",
            [next,idPatient,idUser,date],(err,result)=> {
                if(err){
                    return res.send({"error" : err})
                }else {
                    return res.send({"success" : err})
                }
            })
        })
      


    }) ; 
}
exports.addRdv = async (req,res)=> {
    pool.getConnection(function(err,connection){
        connection.query("insert into rdv values(?,?,?,?,?,?,?,?)",[
            req.body.iduser,
            req.body.idpatient,
            req.body.date_rdv, 
             req.body.description,
             '0',
             req.body.typeRDV, 
             '0',
             'patient'
             
        ],(err,result)=> {
            if(err) {
             console.log(err);
                console.log("error",err); 
                return res.send({"error" : err})
            }else {
          
                console.log('from the get rv')
          connection.query("SELECT * FROM patient where IdPatient = ?",[req.body.idpatient],
          (err,result2)=> {
        console.log("result2",result2);
           var  date = new Date();
         var   date2 =  moment(date).format('YYYY-MM-DD hh:mm')
         connection.release();
         sendNotifToMedecin("Demande de rendez-vous",result2[0].p_Lastname +" a demandé un rendez-vous"+ date2.toString()+ 
         "et est entrain d’attendre votre décision",req.body.iduser,req.body.idpatient);
         return res.send({'result' : 'added', }); 
   
    
          
          })
           
            }
        })
    }); 
   
}
function sendNotifToMedecin(title,description,idUser,idPatient) {
 pool.getConnection(function(err,connection) {
    let date = new Date();
    connection.query("insert into notification values(?,?,?,?,?,'patient',0)",
    [idUser,idPatient,date, title,description], (err,result)=> {
        console.log("hna");
    if(err) {
        console.log("hahouwa");
        console.log(err);
    }
    connection.release();
    sendNotif.sendNotif(title,description,idUser);
    }    
    )   
 })
 

    

}
exports.getNotification = (req,res,next)=> {
    const idPatient = req.body.IdPatient;
    pool.getConnection(function (err,connection){
        connection.query("select * from notification where idpatient = ? and sent_by = 'médecin'",[idPatient], 
        (err,result)=>{

            console.log("notis",result,idPatient);
            return res.send({
                "result" : result,
            })
        });

    })
}
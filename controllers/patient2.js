require("dotenv").config();
const fs = require('fs');
const db = require("../util/db").db;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passwordHash = require("password-hash");
const {Patient ,Account} = require('../models/user')
const {Medical_File}=require('../models/dossier');
const ejs = require('ejs');
const pool = require("../util/db").pool;

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
                    connection.query("SELECT  * from evacuation where idpatient = ?",
                    [id_patient],(err,evacuation)=> {
                        connection.query("SELECT  * from prescription where idpatient = ?",
       [id_patient],(err,prescription)=> {
           if(err) {
          
               return res.send({"error" : err})
           }else {
         
connection.release(); 
console.log( 'result' , result, 
'evacuation' , evacuation, 
'orientation' , orientation,
'prescription' , prescription, 
'sicknote'  ,sickNote, )
           return res.send({
           'result' : result, 
           'evacuation' : evacuation, 
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
    const id_patient  = req.body.id; 
    console.log(id_patient); 
    pool.getConnection(function(err,connection){
        connection.query("SET  time_zone = '+0:00' ",(err,result)=> {
            connection.query("SELECT  * from rdv,users where rdv.idpatient = ? and  users.iduser = rdv.iduser order by date_rdv DESC ",
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
exports.updateRdv  =async (req,res)=> {
    const idPatient = req.body.idPatient; 
    const idUser = req.body.idUser; 
    const date = req.body.date;
    console.log('hi');
    console.log(req.body,idPatient,idUser,date);
    pool.getConnection(function(err,connection){
        connection.query("select * from rdv where date_rdv = ? and idpatient = ? and iduser = ?",
        [date,idPatient,idUser], 
        (err,result)=>{
            console.log(result);
          
            var next = ""; 
            if(result[0].situation_rdv == "0"){
                next = "1"; 
            }else if(result[0].situation_rdv == "3"){
                next = "5"; 
            }else if(result[0].situation_rdv == "6"){
                next = "10";
            }else if(result[0].situation_rdv == "7"){
                next = "9"; 
            }else if(result[0].situation_rdv == "11"){
                next = "13"; 
            }else if(result[0].situation_rdv == "14"){
                next = "15" ;
            }else if(result[0].situation_rdv == "19"){
                next = "20" ;
            }else if(result[0].situation_rdv == "18"){
                next = "22" ;
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
                    connection.query("Select * from rdv where date_rdv = ? and idpatient = ? and iduser = ?",
                    [new_date,idPatient,idUser],(err,result)=> {
                        var next ; 
                        if(result[0].situation_rdv =="6") {
                        next = "7";
                        }else if(result[0].situation_rdv =="18") {
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
        connection.query("select * from rdv where date_rdv = ? and idpatient = ? and iduser = ?",
        [date,idPatient,idUser], 
        (err,result)=>{
            console.log(result);
            connection.query("update rdv set situation_rdv = '17' where idpatient = ? and iduser = ? and date_rdv = ?",
            [idPatient,idUser,date],(err,result)=> {
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
        connection.query("insert into rdv values(?,?,?,?,?,?,?)",[
            req.body.iduser,
            req.body.idpatient,
            req.body.date_rdv, 
             req.body.description,
             '0',
             req.body.typeRDV, 
             'patient'
             
        ],(err,result)=> {
            if(err) {
                connection.release();
                console.log("error",err); 
                return res.send({"error" : err})
            }else {
                connection.release();
                console.log('from the get rv')
             console.log(result); 
            return res.send({
            'result' : 'added', 
            }); 
            }
        })
    }); 
   
}
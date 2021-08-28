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
        connection.query("SELECT  iduser,date_medicalexam from medicalexam where idpatient = ? order by date_medicalexam",
        [id_patient],(err,result)=> {
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
        connection.query("SELECT  * from rdv where idpatient = ?",
        [id_patient],(err,result)=> {
            if(err) {
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
    }); 
}
exports.getMedicalCheckUp= async (req,res) => {
    const id_patient  = req.body.id; 
  
}
exports.addRdv = async (req,res)=> {
    pool.getConnection(function(err,connection){
        connection.query("insert into rdv values(?,?,?,?,?,?,?,?)",[
            req.body.iduser,
            req.body.idpatient,
            req.body.date_rdv, 
            req.body.time_start,
             req.body.time_end,
             req.body.description,
             req.body.situation,
             req.body.typeRDV, 
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
    }) 
   
}
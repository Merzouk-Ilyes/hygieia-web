require("dotenv").config();
const jwt = require("jsonwebtoken");
var dateFormat = require('dateformat');
const db = require("../util/db").db;
const PDFDocument = require('../util/pdfkit-tables');
const doc = new PDFDocument({compress:false});
const fs = require('fs');
const path = require('path');
const pool = require("../util/db").pool;
var moment = require('moment');
const uploadFile = require('../middleware/uploadFile');

exports.getStat = (req,res,next) => {

  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    (err,decodedToken)=> {
      pool.getConnection(function(err,connection) {
        connection.query("select count(*) as data from patient",
        (err,data)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(Smoke) as smoke from personalhistory where Smoke = 1;",
        (err,smoke)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(Chiquer) as chique from personalhistory where Chiquer = 1;",
        (err,chique)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(Token) as token from personalhistory where Token = 1;",
        (err,token)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(Smoked) as smoked from personalhistory where Smoked = 1;",
        (err,smoked)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(alcohol) as alcohol from personalhistory where alcohol = 1;",
        (err,alcohol)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select sexe,count(num_ev) as nombre,year(date_medicalexam) as y2,(year(current_date())-1) as y1  from evacuation e inner join patient p on e.idpatient=p.IdPatient where year(date_medicalexam)>=(year(current_date())-1) and sexe='Homme' ;",
        (err,evacuation)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(num_ev)as total from evacuation e inner join patient p on e.idpatient=p.IdPatient where year(date_medicalexam)>=(year(current_date())-1) ;",
        (err,totalevacuation)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as rdvreguliere ,year(date_rdv) as y2,(year(current_date())-1) as y1 from rdv where created_by='medecin' and year(date_rdv)>=(year(current_date())-1) and (date_rdv)>=(current_date()) and deleted_rdv = 0 ;",
        (err,rdvreguliere)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as rdvirreguliere ,year(date_rdv) as y2,(year(current_date())-1) as y1 from rdv where created_by='patient' and year(date_rdv)>=(year(current_date())-1) and (date_rdv)>=(current_date()) and deleted_rdv = 0 ;",
        (err,rdvirreguliere)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as rdvreguliere from rdv e inner join patient p on e.idpatient=p.IdPatient where created_by='medecin' and year(date_rdv)>=(year(current_date())-1) and (date_rdv)>=(current_date()) and deleted_rdv = 0 and sexe='Homme';",
        (err,rdvreguliereh)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as rdvirreguliere from rdv  e inner join patient p on e.idpatient=p.IdPatient where created_by='patient' and year(date_rdv)>=(year(current_date())-1) and (date_rdv)>=(current_date()) and deleted_rdv = 0 and sexe='Homme';",
        (err,rdvirreguliereh)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(patient.IdPatient) as cpt from medicalfile inner join patient inner join student on medicalfile.idpatient = patient.IdPatient AND patient.IdPatient = student.idpatient WHERE promotion = '1CP';",
        (err,cpt)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(patient.IdPatient) as cp from medicalfile inner join patient inner join student on medicalfile.idpatient = patient.IdPatient AND patient.IdPatient = student.idpatient WHERE promotion = '1CP' and sexe='Homme' ;",
        (err,cp)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as pat From patient p inner join student s on p.IdPatient=s.IdPatient ;",
        (err,pat)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as path From patient p inner join student s on p.IdPatient=s.IdPatient where sexe = 'homme';",
        (err,path)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as patcp From patient p inner join student s on p.IdPatient=s.IdPatient where promotion= '1cp';",
        (err,patcp)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as patcph From patient p inner join student s on p.IdPatient=s.IdPatient where sexe = 'homme' and promotion= '1cp';",
        (err,patcph)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(distinct(idpatient)) as rgig from medicalexam where imc < 18.5 ;",
        (err,rgig)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(distinct(idpatient)) as nrml from medicalexam where imc < 25 and imc >= 18.5;",
        (err,nrml)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(distinct(idpatient)) as suppoid from medicalexam where imc < 30 and imc >= 25;",
        (err,suppoid)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(distinct(idpatient)) as smin from medicalexam where imc >= 30 ;",
        (err,smin)=> {
        if(err) {
        console.log("error", err);
        }else{
    
    //===============================================================================================================
    
    connection.query("SELECT havesickness.name_sickness as name,sexe,count(*) as occurence from havesickness inner join patient on patient.IdPatient = havesickness.IdPatient inner join sickness on sickness.name_sickness=havesickness.name_sickness where type_sickness=? GROUP BY havesickness.name_sickness,sexe;",
      ["chronique"],
      (err, chronique) => {
      if (err) {
      console.log('error', err);
      } else {
        connection.query("SELECT havesickness.name_sickness as name,sexe,count(*) as occurence from havesickness inner join patient on patient.IdPatient = havesickness.IdPatient inner join sickness on sickness.name_sickness=havesickness.name_sickness where type_sickness=? GROUP BY havesickness.name_sickness,sexe;",
      ["cardio-vasculaire"],
      (err, cardio) => {
      if (err) {
      console.log('error', err);
      } else {
        connection.query("SELECT havesickness.name_sickness as name,sexe,count(*) as occurence from havesickness inner join patient on patient.IdPatient = havesickness.IdPatient inner join sickness on sickness.name_sickness=havesickness.name_sickness where type_sickness=? GROUP BY havesickness.name_sickness,sexe;",
        ["rhumatologique"],
      (err, rhumatologique) => {
      if (err) {
      console.log('error', err);
      } else {
        connection.query("SELECT havesickness.name_sickness as name,sexe,count(*) as occurence from havesickness inner join patient on patient.IdPatient = havesickness.IdPatient inner join sickness on sickness.name_sickness=havesickness.name_sickness where type_sickness=? GROUP BY havesickness.name_sickness,sexe;",
      ["digestive"],
      (err, digestive) => {
      if (err) {
      console.log('error', err);
      } else {
        connection.query("SELECT havesickness.name_sickness as name,sexe,count(*) as occurence from havesickness inner join patient on patient.IdPatient = havesickness.IdPatient inner join sickness on sickness.name_sickness=havesickness.name_sickness where type_sickness=? GROUP BY havesickness.name_sickness,sexe;",
      ["infectieuse"],
      (err, infectieuse) => {
      if (err) {
      console.log('error', err);
      } else {
        connection.query("SELECT havesickness.name_sickness as name,sexe,count(*) as occurence from havesickness inner join patient on patient.IdPatient = havesickness.IdPatient inner join sickness on sickness.name_sickness=havesickness.name_sickness where type_sickness!=? and type_sickness!=? and type_sickness!=? and type_sickness!=? and type_sickness!=? GROUP BY havesickness.name_sickness,sexe;",
      ["chronique","cardio-vasculaire","digestive","infectieuse","rhumatologique"],
      (err, maladie) => {
      if (err) {
      console.log('error', err);
      } else {
        connection.query("select * from notification  where iduser = ? and sent_by = 'patient' order by date_notif DESC ",[decodedToken.IdUser],
        (err,notifs)=> {
          connection.query("select * from notification where iduser = ? and sent_by = 'patient' and opened = 0",
          [decodedToken.IdUser],
          (err,notifssee)=> {
            connection.query("Select * from users where Email = ?",
            [decodedToken.email],(err,infoPer)=>{
              connection.release();
              res.render('static/static', {
                data : data,
                smoke : smoke,
                notifs : notifs,
                notifssee : notifssee.length, 
                chique :chique,
                token : token,
                smoked : smoked,
                alcohol : alcohol,
                evacuation : evacuation,
                totalevacuation : totalevacuation,
                rdvreguliere : rdvreguliere,
                rdvirreguliere : rdvirreguliere,
                rdvreguliereh : rdvreguliereh,
                rdvirreguliereh : rdvirreguliereh,
                cpt : cpt,
                cp : cp,
                pat : pat,
                path : path,
                patcp : patcp,
                patcph : patcph,
                rgig : rgig,
                nrml : nrml,
                suppoid : suppoid,
                smin : smin,
               user : infoPer[0],
                chronique: chronique,
                maladie: maladie,
                cardio: cardio,
                digestive: digestive,
                infectieuse: infectieuse,
                rhumatologique: rhumatologique,
                moment : moment,
                });
            })
            
         
          })});

                                             
    
    
        }
        });
    }
    });
    }
    });
    }
    });
    }
    });
    }
    });
    }
    });
    
    
    
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
        });
        }
    });
      })
    });
 


    }
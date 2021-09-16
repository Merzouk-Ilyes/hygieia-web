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
        connection.query("select count(*) as data from patient p inner join personalhistory h on h.IdPatient=p.IdPatient",
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
          connection.query("select count(*) as patcp From patient p ;",
        (err,patcp)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as patcph From patient p where sexe = 'homme';",
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

exports.getStatrh = (req,res,next) => {
console.log("dkhla stat rh");
  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    (err,decodedToken)=> {
      pool.getConnection(function(err,connection) {
        connection.query("select count(*) as data from patient p inner join personalhistory h on h.IdPatient=p.IdPatient",
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
          connection.query("select count(*) as patcp From patient p ;",
        (err,patcp)=> {
        if(err) {
        console.log("error", err);
        }else{
          connection.query("select count(*) as patcph From patient p where sexe = 'homme';",
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
              res.render('static/staticrh', {
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

exports.postFiltreEtudiant = (req,res,next) => {
  pool.getConnection(function(err, connection) {
    if(req.body.etu == 'tous'){
      connection.query("select sexe,count(*) as pat From patient p inner join student s on p.IdPatient=s.IdPatient Group by sexe;",
    [req.body.etu],
    (err,liste)=> {
      if(err) {
        console.log("error", err);
      }else{
        var femme =0;
        var homme =0;

        for(var i=0;i<liste.length;i++){
          if(liste[i].sexe == 'Femme'){
            femme = liste[i].pat;
          }
          if(liste[i].sexe == 'Homme'){
            homme = liste[i].pat;
          }
        }
        connection.release();
        return res.send({
           femme: femme,
           homme: homme,
        })
      }
    });
    }else{
      connection.query("select sexe,count(*) as pat From patient p inner join student s on p.IdPatient=s.IdPatient where promotion=? Group by sexe;",
    [req.body.etu],
    (err,liste)=> {
      if(err) {
        console.log("error", err);
      }else{
        var femme =0;
        var homme =0;

        for(var i=0;i<liste.length;i++){
          if(liste[i].sexe == 'Femme'){
            femme = liste[i].pat;
          }
          if(liste[i].sexe == 'Homme'){
            homme = liste[i].pat;
          }
        }
        connection.release();
        return res.send({
           femme: femme,
           homme: homme,
        })
      }
    });
    }
  });
}

exports.postFiltrePatient = (req,res,next) => {
  pool.getConnection(function(err, connection) {
    if(req.body.patient == 'tous'){
      connection.query("select sexe,count(*) as pat From patient Group by sexe;",
    [req.body.patient],
    (err,liste)=> {
      if(err) {
        console.log("error", err);
      }else{
        var femme =0;
        var homme =0;

        for(var i=0;i<liste.length;i++){
          if(liste[i].sexe == 'Femme'){
            femme = liste[i].pat;
          }
          if(liste[i].sexe == 'Homme'){
            homme = liste[i].pat;
          }
        }
        connection.release();
        return res.send({
           femme: femme,
           homme: homme,
        })
      }
    });
    }
    if(req.body.patient == 'Etudiant'){
      connection.query("select sexe,count(*) as pat From patient where role=? Group by sexe;",
    [req.body.patient],
    (err,liste)=> {
      if(err) {
        console.log("error", err);
      }else{
        var femme =0;
        var homme =0;

        for(var i=0;i<liste.length;i++){
          if(liste[i].sexe == 'Femme'){
            femme = liste[i].pat;
          }
          if(liste[i].sexe == 'Homme'){
            homme = liste[i].pat;
          }
        }
        connection.release();
        return res.send({
           femme: femme,
           homme: homme,
        })
      }
    });
    }
    if(req.body.patient == 'Ats'){
      connection.query("select sexe,count(*) as pat From patient where role=? Group by sexe;",
    [req.body.patient],
    (err,liste)=> {
      if(err) {
        console.log("error", err);
      }else{
        var femme =0;
        var homme =0;

        for(var i=0;i<liste.length;i++){
          if(liste[i].sexe == 'Femme'){
            femme = liste[i].pat;
          }
          if(liste[i].sexe == 'Homme'){
            homme = liste[i].pat;
          }
        }
        connection.release();
        return res.send({
           femme: femme,
           homme: homme,
        })
      }
    });
    }
    if(req.body.patient == 'Professeur'){
      connection.query("select sexe,count(*) as pat From patient where role=? Group by sexe;",
    [req.body.patient],
    (err,liste)=> {
      if(err) {
        console.log("error", err);
      }else{
        var femme =0;
        var homme =0;

        for(var i=0;i<liste.length;i++){
          if(liste[i].sexe == 'Femme'){
            femme = liste[i].pat;
          }
          if(liste[i].sexe == 'Homme'){
            homme = liste[i].pat;
          }
        }
        connection.release();
        return res.send({
           femme: femme,
           homme: homme,
        })
      }
    });
    }
  });
}

exports.postFiltreEvacuation = (req,res,next) => {

  pool.getConnection(function(err, connection) {
    if(req.body.duev == '' && req.body.auev != ''){
      connection.query("select sexe,count(*) as pat From evacuation e inner join patient p on p.idpatient=e.idpatient where date_medicalexam < ?  Group by sexe;",
      [req.body.auev],
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].sexe == 'Femme'){
              femme = liste[i].pat;
            }
            if(liste[i].sexe == 'Homme'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    if(req.body.auev == '' && req.body.duev != ''){
      connection.query("select sexe,count(*) as pat From evacuation e inner join patient p on p.idpatient=e.idpatient where date_medicalexam > ?  Group by sexe;",
      [req.body.duev],
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].sexe == 'Femme'){
              femme = liste[i].pat;
            }
            if(liste[i].sexe == 'Homme'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    if((req.body.auev != '' && req.body.duev != '')||(req.body.auev == '' && req.body.duev == '')){
      connection.query("select sexe,count(*) as pat From evacuation e inner join patient p on p.idpatient=e.idpatient where date_medicalexam between ? and ? Group by sexe;",
      [req.body.duev,req.body.auev],
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].sexe == 'Femme'){
              femme = liste[i].pat;
            }
            if(liste[i].sexe == 'Homme'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    
  });
}

exports.postFiltreRegulier = (req,res,next) => {

  pool.getConnection(function(err, connection) {
    if(req.body.dure == '' && req.body.aure != ''){
      connection.query("select sexe,count(*) as pat from rdv e inner join patient p on e.idpatient=p.IdPatient where created_by='medecin' and date_rdv < ? and deleted_rdv = 0 group by sexe;",
      [req.body.aure],
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].sexe == 'Femme'){
              femme = liste[i].pat;
            }
            if(liste[i].sexe == 'Homme'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    if(req.body.aure == '' && req.body.dure != ''){
      connection.query("select sexe,count(*) as pat from rdv e inner join patient p on e.idpatient=p.IdPatient where created_by='medecin' and date_rdv > ? and deleted_rdv = 0 group by sexe;",
      [req.body.dure],
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].sexe == 'Femme'){
              femme = liste[i].pat;
            }
            if(liste[i].sexe == 'Homme'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    if((req.body.aure != '' && req.body.dure != '')||(req.body.aure == '' && req.body.dure == '')){
      connection.query("select sexe,count(*) as pat from rdv e inner join patient p on e.idpatient=p.IdPatient where created_by='medecin' and (date_rdv between ? and ? ) and deleted_rdv = 0 group by sexe;",
      [req.body.dure,req.body.aure],
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].sexe == 'Femme'){
              femme = liste[i].pat;
            }
            if(liste[i].sexe == 'Homme'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    
  });
}

exports.postFiltreIrregulier = (req,res,next) => {

  pool.getConnection(function(err, connection) {
    if(req.body.duirre == '' && req.body.auirre != ''){
      connection.query("select sexe,count(*) as pat from rdv e inner join patient p on e.idpatient=p.IdPatient where created_by='patient' and (date_rdv > ? ) and deleted_rdv = 0 group by sexe;",
      [req.body.auirre],
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].sexe == 'Femme'){
              femme = liste[i].pat;
            }
            if(liste[i].sexe == 'Homme'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    if(req.body.auirre == '' && req.body.duirre != ''){
      connection.query("select sexe,count(*) as pat from rdv e inner join patient p on e.idpatient=p.IdPatient where created_by='patient' and (date_rdv < ? ) and deleted_rdv = 0 group by sexe;",
      [req.body.duirre],
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].sexe == 'Femme'){
              femme = liste[i].pat;
            }
            if(liste[i].sexe == 'Homme'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    if((req.body.auirre != '' && req.body.duirre != '')||(req.body.auirre == '' && req.body.duirre == '')){
      connection.query("select sexe,count(*) as pat from rdv e inner join patient p on e.idpatient=p.IdPatient where created_by='patient' and (date_rdv between ? and ? ) and deleted_rdv = 0 group by sexe;",
      [req.body.duirre,req.body.auirre],
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].sexe == 'Femme'){
              femme = liste[i].pat;
            }
            if(liste[i].sexe == 'Homme'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    
  });
}

exports.postFiltreFumeur = (req,res,next) => {
  pool.getConnection(function(err, connection) {
    if(req.body.fum == 'fumeur'){
      connection.query("SELECT smoke,count(*) as pat FROM personalhistory group by smoke;",
    (err,liste)=> {
      if(err) {
        console.log("error", err);
      }else{
        var femme =0;
        var homme =0;

        for(var i=0;i<liste.length;i++){
          if(liste[i].smoke == '0'){
            femme = liste[i].pat;
          }
          if(liste[i].smoke == '1'){
            homme = liste[i].pat;
          }
        }
        connection.release();
        return res.send({
           femme: femme,
           homme: homme,
        })
      }
    });
    }
    if(req.body.fum == 'chiqueur'){
      connection.query("SELECT Chiquer,count(*) as pat FROM personalhistory group by Chiquer;",
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].Chiquer == '0'){
              femme = liste[i].pat;
            }
            if(liste[i].Chiquer == '1'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    if(req.body.fum == 'toxicomane'){
      connection.query("SELECT Token,count(*) as pat FROM personalhistory group by Token;",
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].Token == '0'){
              femme = liste[i].pat;
            }
            if(liste[i].Token == '1'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    if(req.body.fum == 'ancien'){
      connection.query("SELECT Smoked,count(*) as pat FROM personalhistory group by Smoked;",
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].Smoked == '0'){
              femme = liste[i].pat;
            }
            if(liste[i].Smoked == '1'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
    if(req.body.fum == 'alcoolique'){
      connection.query("SELECT alcohol,count(*) as pat FROM personalhistory group by alcohol;",
      (err,liste)=> {
        if(err) {
          console.log("error", err);
        }else{
          var femme =0;
          var homme =0;
  
          for(var i=0;i<liste.length;i++){
            if(liste[i].alcohol == '0'){
              femme = liste[i].pat;
            }
            if(liste[i].alcohol == '1'){
              homme = liste[i].pat;
            }
          }
          connection.release();
          return res.send({
             femme: femme,
             homme: homme,
          })
        }
      });
    }
  });
}
// -------------------- RDV INTERFACE PROMO -------------------- //

exports.getRDVpromo = (req,res,next) =>{
  console.log('RDV PROMO');
  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
  pool.getConnection(function(err, connection) {
    connection.query("select *,DATE_FORMAT(rdv.date_rdv, '%Y-%m-%dT%H:%i') as localdate, DATE_FORMAT(DATE(rdv.date_rdv), '%d/%m/%Y') as date, DATE_FORMAT(DATE(rdv.date_rdv), '%Y-%m-%d') as date2,min(time(rdv.date_rdv)) as min, max(time(rdv.date_rdv)) as max from rdv inner join promo on rdv.iduser = promo.iduser AND rdv.idpatient = promo.idpatient AND rdv.date_rdv = promo.date_rdv where type_rdv = 'collectif' GROUP BY DATE_FORMAT(DATE(rdv.date_rdv), '%Y-%m-%d')",
    (err,result)=> {
    if(err) {
    console.log("error", err);
    }else{
    return res.render('RDV/rdvpromo', { promoinfo: result,first:decodedToken.firstname});
    }
    });
  });
});
}

exports.postRDVpromo = (req,res,next) =>{

  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
  async (err,decodedToken)=>   {console.log(decodedToken,'token of rdv');
  pool.getConnection(function(err, connection) {
  var rdv_date = req.body.rdv_date;
  var rdv_date2 = new Date(rdv_date);

  let today = new Date();
  let monthh = today.getMonth() +1;
  let month2 = rdv_date2.getMonth() +1;
  let year = today.getFullYear();
  let date = today.getDate();

  let hours1 = today.getHours() + ':'+ today.getMinutes();
  let hours2 = rdv_date2.getHours() + ':'+ rdv_date2.getMinutes();

  console.log(hours1);
  console.log(hours2);
  let db_date = year + '-'+ monthh + '-' + date + hours1;
  let rdv_date3 = rdv_date2.getFullYear() + '-'+ month2 + '-' + rdv_date2.getDate() + hours2;
  console.log('db-date ',db_date);
  console.log('db-rdv_date3 ',rdv_date3);

  var acc_rdv = new Date(rdv_date);
  var month = acc_rdv.getMonth()+1;
  var rdv_col = acc_rdv.getFullYear() + '-' + month + '-' + acc_rdv.getDate();
  console.log(rdv_col);

  //check date availability
  connection.query("SELECT * from rdv inner join patient on rdv.idpatient = rdv.idpatient where iduser = ? and CAST(date_rdv AS DATE) = ?",
  [decodedToken.IdUser, rdv_col],
  (err,res1) => {
    if(err) {
      console.log('error select rdv + date fin rdv promo');  
    }else{
      console.log('selected rdv + date fin rdv promo');
      console.log(res1);

      if(res1 =='' || res1[0].deleted_rdv == 1){
        console.log('date available');

        //check the doctor's worktime
        var acc_rdv = new Date(rdv_date);
        console.log(acc_rdv, 'converted date');
        let rdv_day = acc_rdv.getDay();
        console.log('day = ',rdv_day);
        var weekday = new Array(7);
        weekday[0] = "dimanche";
        weekday[1] = "lundi";
        weekday[2] = "mardi";
        weekday[3] = "mercredi";
        weekday[4] = "jeudi";
        weekday[5] = "vendredi";
        weekday[6] = "samedi";

        var day = weekday[rdv_day];
        console.log(day, 'converted date to days'); 

        connection.query("SELECT * FROM work WHERE iduser = ? and work_date = ?", 
        [decodedToken.IdUser, day],
        (err,res2) => {
          if(err){
            console.log(err);
          }else{
            console.log('medecin worktime selected');
            if(res2 == ''){
              console.log('Vous n\'êtes pas disponible cette journée'); //render
              return res.send('pasdispo');
            }else{
              // dealing with working time hours
              let hour_rdv = acc_rdv.toLocaleTimeString('it-IT');

              if((hour_rdv < res2[0].starttime)||(hour_rdv > res2[0].endtime)){
                console.log('Vous ne travaillez pas en ces heures, veuillez selectionner une autre heure'); //rennder
                return res.send('nowork');
              }else{
                //select patient
                connection.query("SELECT * FROM student INNER JOIN patient ON student.IdPatient = patient.IdPatient WHERE promotion = ?", [req.body.rdv_promo],
              (err,res3) =>{
                if(err){
                  console.log(err);
                }else{
                  console.log('all patients selected');
                  
                  var dur_rdv = req.body.dur_rdv;
                  console.log(dur_rdv);
                  var minutes = dur_rdv.split(":")[1];
                  console.log(minutes);
                  console.log(acc_rdv,'without add');
                  hours_col = acc_rdv.toLocaleTimeString('it-IT');

                  var plannedDates = new Array(res3.length);
                  var plannedStudents = new Array(res3.length);
                  plannedDates[0] = acc_rdv;

                  var sel_groups = req.body.sel_groups;
                  console.log(sel_groups);
                  var numbers = sel_groups.replace(/[^0-9]/g,'');
                  console.log(numbers);
                  const arrayOfDigits = Array.from(String(numbers), Number); 
                  console.log(arrayOfDigits);

                  connection.query('SELECT * from Student WHERE group_student IN (?)',
                  [arrayOfDigits],
                  (err, res5)=> {
                    if(err){
                      console.log(err);
                    }else{
                      console.log(res5);
                      var arrayOfStudents = new Array(res5.length);
                      res5.forEach(function(stud, i){
                        arrayOfStudents[i] = stud.IdPatient;
                      });

                      var plannedDates_g = new Array(res5.length);
                      plannedDates_g[0] = acc_rdv;

                      for (let i = 1; i < res5.length; i++) {
                        plannedDates_g[i] = new Date(plannedDates_g[i-1].getTime() + minutes*60000);
                      }

                      var last_hour = plannedDates_g[plannedDates_g.length-1].toLocaleTimeString('it-IT');;
                      console.log(last_hour);

                      if((last_hour >= res2[0].endtime)){
                        return res.send("termine");
                        console.log('Vous terminerai a '+last_hour+' qui dépasse vos heures de travail, selectionnez moins de groupes'); //render
                      }else{
                        for (let i = 0; i < res5.length; i++) {
                          connection.query("INSERT INTO rdv SET rdv.iduser=?, rdv.idpatient=?, rdv.date_rdv=?, description_rdv=?, situation_rdv=?,type_rdv=?",
                          [decodedToken.IdUser, arrayOfStudents[i], plannedDates_g[i], req.body.rdv_description, 23, 'collectif'],
                          async (err,res6) => {
                            console.log(err);
                            if(err){
                              console.log(err);
                            }else{
                              console.log('RDV inserted');
                              
                            }}
                          );
                        } 

                        for (let i = 0; i < res5.length; i++) {
                          connection.query("INSERT INTO promo (iduser,idpatient,date_rdv, promo, group_p, duration_promo) VALUES (?,?,?,?,?,?)",
                          [decodedToken.IdUser,arrayOfStudents[i],plannedDates_g[i], req.body.rdv_promo, req.body.sel_groups, req.body.dur_rdv],
                          (err,res7)=>{
                          if(err) {
                            console.log('Error PROMO insert', err);
                          }else{
                            return res.send('success')
                          console.log('Votre rendez-vous a été programmé avec succès!'); //render
                          }
                          }); 
                        }
                      }

                    }
                  });
                }
              });
              }

            }
          }
        });
      }else{
        return res.send('stop1');
        //console.log('Vous avez déjà un rendez-vous programmé cette journée! Veuillez le supprimer ou selectionner une autre date'); //render
      }
    }
  });
});});
}

exports.editRDVpromo = (req,res,next) =>{
  console.log('You are in the edit RDV collectif');
    
    var changed_date = req.body.rdv_date;
    var beforechange_date = req.body.exdate;
    console.log(changed_date);
    console.log(beforechange_date);


const rawCookies = req.headers.cookie.split('; ');
const parsedCookie = rawCookies[0].split('=')[1];
jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
async (err,decodedToken)=>   {console.log(decodedToken,'token of get request');
    //add 0 if date<10
    var promodat = new Date(req.body.rdv_date);
    promodat.setDate(promodat.getDate());
    var promodate = promodat.getFullYear() + '-' + ('0' + (promodat.getMonth()+1)).slice(-2) + '-' + ('0' + promodat.getDate()).slice(-2);
    console.log(promodate);
    console.log(req.body.med);
    pool.getConnection(function(err, connection) {
      connection.query("SELECT *, DATE_FORMAT(date_rdv, '%Y-%m-%d') as rdvv from rdv inner join patient on rdv.idpatient = rdv.idpatient where iduser = ? and CAST(date_rdv AS DATE) = ? and type_rdv = 'individuel'",
        [req.body.med, promodate],
        (err,res1) => {
          if(err){
            console.log('error:', err);
          }else{
            console.log('selected rdv');
            console.log(res1);

            if(res1 =='' || res1[0].rdvv == promodate || res1[0].deleted_rdv == 1){
              console.log('date available');

              //check the doctor's worktime
              let rdv_day = promodat.getDay();
              console.log('day = ',rdv_day);
              var weekday = new Array(7);
              weekday[0] = "dimanche";
              weekday[1] = "lundi";
              weekday[2] = "mardi";
              weekday[3] = "mercredi";
              weekday[4] = "jeudi";
              weekday[5] = "vendredi";
              weekday[6] = "samedi";

              var day = weekday[rdv_day];
              console.log(day, 'converted date to days'); 

              connection.query("SELECT * FROM work WHERE iduser = ? and work_date = ?",
              [req.body.med, day],
              (err, res2)=>{
                if(err){
                  console.log('error:', err);
                }else{
                  console.log('worktime selected');
                  if(res2 == ''){
                    console.log('Vous n\'êtes pas disponible cette journée'); //render
                    return res.send('pasdispo');
                  }else{
                    // dealing with working time hours
                    let hour_rdv = promodat.toLocaleTimeString('it-IT');
                    if((hour_rdv < res2[0].starttime)||(hour_rdv > res2[0].endtime)){
                      console.log('Vous ne travaillez pas en ces heures, veuillez selectionner une autre heure'); //rennder
                      return res.send('dontwork');
                    }else{
                      //select patient
                      connection.query("SELECT * FROM student INNER JOIN patient ON student.IdPatient = patient.IdPatient WHERE promotion = ?", [req.body.rdv_promo],
                      (err,res3) =>{
                        if(err){
                          console.log(err);
                        }else{
                          console.log('all patients selected');
                          console.log(res3);
                          var dur_rdv = req.body.dur_rdv;
                          console.log(dur_rdv);
                          var minutes = dur_rdv.split(":")[1];
                          console.log(minutes);
                          //hours_col = promodat.toLocaleTimeString('it-IT');

                          var plannedStudents = new Array(res3.length);
                          var sel_groups = req.body.sel_groups;
                          console.log(sel_groups);
                          var numbers = sel_groups.replace(/[^0-9]/g,'');
                          console.log(numbers);
                          const arrayOfDigits = Array.from(String(numbers), Number); 
                          console.log(arrayOfDigits);

                          connection.query('SELECT * from Student WHERE group_student IN (?)',
                          [arrayOfDigits],
                          (err, res5)=> {
                            if(err){
                              console.log(err);
                            }else{
                              console.log(res5);
                              var arrayOfStudents = new Array(res5.length);
                              res5.forEach(function(stud, i){
                                arrayOfStudents[i] = stud.IdPatient;
                              });
        
                              var plannedDates_g = new Array(res5.length);
                              plannedDates_g[0] = promodat;
        
                              for (let i = 1; i < res5.length; i++) {
                                plannedDates_g[i] = new Date(plannedDates_g[i-1].getTime() + minutes*60000);
                              }
                              console.log('heda', plannedDates_g);
                              var last_hour = plannedDates_g[plannedDates_g.length-1].toLocaleTimeString('it-IT');;
                              console.log(last_hour);
        
                              if((last_hour >= res2[0].endtime)){
                                console.log('Vous terminerai a '+last_hour+' qui dépasse vos heures de travail, selectionnez moins de groupes'); //render
                                return res.send('dontwork');
                              }else{
                                console.log('okay delete then insert');

                                if((last_hour >= res2[0].endtime)){
                                  console.log('Vous terminerai a '+last_hour+' qui dépasse vos heures de travail, selectionnez moins de groupes'); //render
                                  return res.send('dontwork');
                                }else{

                                  for (let i = 0; i < res5.length; i++) {
                                  connection.query("UPDATE rdv SET deleted_rdv = ? WHERE iduser=? AND idpatient =? AND DATE_FORMAT(date_rdv, '%Y-%m-%d') = ? AND type_rdv = ?",
                                  [1, decodedToken.IdUser, arrayOfStudents[i], promodate, 'collectif'],
                                  (err, res0)=>{
                                    if(err){
                                      console.log(err);
                                    }else{

                                   
                                    connection.query("DELETE FROM promo WHERE iduser=? AND idpatient=? AND DATE_FORMAT(DATE(date_rdv), '%Y-%m-%d')=?",
                                    [decodedToken.IdUser, arrayOfStudents[i], promodate],
                                    (err, res6)=>{
                                      if (err) {
                                        console.log(err);
                                      }else{
                                        console.log(res6);
                                        console.log('promo deleted');
                                        connection.query("DELETE FROM rdv WHERE iduser=? AND idpatient=? AND DATE_FORMAT(DATE(date_rdv), '%Y-%m-%d')=? AND type_rdv = 'collectif'",
                                        [decodedToken.IdUser, arrayOfStudents[i], promodate],
                                        (err, res7)=>{
                                          if (err) {
                                            console.log(err);
                                          }else{
                                            console.log('rdv deleted');
                                            connection.query("INSERT INTO rdv SET rdv.iduser=?, rdv.idpatient=?, rdv.date_rdv=?, description_rdv=?, situation_rdv=?,type_rdv=?",
                                            [req.body.med, arrayOfStudents[i], plannedDates_g[i], req.body.rdv_description, 23, 'collectif'],
                                            async (err,res7) => {
                                              console.log(err);
                                              if(err){
                                                console.log(err);
                                              }else{
                                                console.log('RDV inserted');

                                                connection.query("INSERT INTO promo (iduser,idpatient,date_rdv, promo, group_p, duration_promo) VALUES (?,?,?,?,?,?)",
                                                [req.body.med,arrayOfStudents[i],plannedDates_g[i], req.body.rdv_promo, req.body.sel_groups, req.body.dur_rdv],
                                                (err,res8)=>{
                                                if(err) {
                                                  console.log('Error PROMO insert', err);
                                                }else{
                                                  console.log('hehe');
                                                console.log('Votre rendez-vous a été modifié avec succès!'); //render
                                                return res.send('succes');
                                                }
                                                }); 
                                                
                                              }}
                                            );
                                          }
                                        });
                                      }
                                    });
                                  }
                                });
                                  }

                                  
                                }
                              }
                            }
                          });
                        }
                      });
                    }
                  }
                };
              });
            }else{
              console.log('Vous avez déjà un rendez-vous programmé cette journée! Veuillez le supprimer ou selectionner une autre date'); //render
              return res.send('youcant');
            }
          }
        });
      
    });
});
} 

exports.cancelRDVpromo = (req,res,next) =>{
  var user = req.body.user;
  var date = req.body.date;
  console.log(user);
  console.log(date);

  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM rdv WHERE iduser =? AND DATE_FORMAT(date_rdv, '%Y-%m-%d') = ? AND type_rdv = 'collectif'",
    [user, date],
    (err,res1) => {
      if(err) {
        console.log('error ',err);  
      }else{
        var arrayOfStudents = new Array(res1.length);
        res1.forEach(function(stud, i){
          arrayOfStudents[i] = stud.idpatient;
        });
        for (let i = 0; i < res1.length; i++) {
          connection.query("UPDATE rdv SET deleted_rdv = ? WHERE iduser=? AND idpatient =? AND DATE_FORMAT(date_rdv, '%Y-%m-%d') = ? AND type_rdv = ?",
          [1, user, arrayOfStudents[i], date, 'collectif'],
          (err, res2) =>{
            if(err) {
              console.log('error ',err);  
            }else{
              console.log('RDV promo canceled');
              return res.send('cancled');
            }
          });
        } 
      }
    });
  }); 
}

    

//=================================================================================
//CAREGIVER
exports.getList2 = (req, res, next) => {
  pool.getConnection(function(err, connection) {
    connection.query("Select * from patient",(err,result)=> {
      if(err) {
     
        console.log('error',err) ; 
  
      }else {
        res.render("RDV/list2", { listitems: result });
  
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
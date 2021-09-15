require("dotenv").config();
require("@google-cloud/storage");
const jwt = require("jsonwebtoken");
var dateFormat = require('dateformat');
const db = require("../util/db").db;
const PDFDocument = require('../util/pdfkit-tables');
const doc = new PDFDocument({compress:false});
const fs = require('fs');
const path = require('path');
const pool = require("../util/db").pool;
const uploadFile = require('../middleware/uploadFile');
const open = require('open');

// ------------------------------------- examen medical ----------------------------------------------
exports.getinfoUpdateExam = (req,res,next) => {

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
 
  let today = new Date();
   let month = today.getMonth() +1;
   let year = today.getFullYear();
   let date = today.getDate();
   let db_date = year + '-'+ month + '-' + date;
   pool.getConnection(function(err, db) {
    db.query("Select * from drug",(err,drugs)=> {
      if(err) {
        console.log("error", err);
      }else{
        db.query("Select * from exams",(err,exams)=> {
          if(err) {
            console.log("error", err);
          }else{
              db.query("SELECT IdPatient,p_Firstname,p_Lastname,DATE_FORMAT(Birthday,'%d/%m/%Y') as birthday FROM patient WHERE idpatient = ? ",
              [req.query.id],
              (err,result)=> {
                console.log(result);
                if(err) {
                  console.log("error", err);
                }else{
                    db.query("SELECT * FROM sickness ",
                    (err,sickness)=> {
                      console.log(result);
                      if(err) {
                        console.log("error", err);
                      }else{
                        db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM sicknote where  iduser = ? and idpatient = ? and date_medicalexam = ? ",[id_medecin,req.query.id,db_date],
                          (err,ordo)=> {
                            console.log(result);
                            if(err) {
                              console.log("error", err);
                            }else{
                              db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM orientation where  iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                (err,orientation)=> {
                                  console.log(result);
                                  if(err) {
                                    console.log("error", err);
                                  }else{
                                    db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM medical_checkup where  iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                      (err,bilan)=> {
                                        console.log(result);
                                        if(err) {
                                          console.log("error", err);
                                        }else{
                                          db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM evacuation where  iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                            (err,evacuation)=> {
                                              console.log(result);
                                              if(err) {
                                                console.log("error", err);
                                              }else{
                                                db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM prescription where  iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                                  (err,prescription)=> {
                                                    console.log(result);
                                                    if(err) {
                                                      console.log("error", err);
                                                    }else{
                                                      db.query("SELECT * FROM type_sickness",
                                                      (err,typemal)=> {
                                                        console.log(result);
                                                        if(err) {
                                                          console.log("error", err);
                                                        }else{
                                                          db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM medicalexam where  iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                                      (err,update)=> {
                                                        console.log(result);
                                                        if(err) {
                                                          console.log("error", err);
                                                        }else{
                                                          res.render('MedicalExam/MedicalExamUpdate', {
                                                            title: 'Exam insertion',
                                                            insertexam: result[0],
                                                            drugs : drugs,
                                                            exams : exams,
                                                            sickness : sickness,
                                                            ordo : ordo,
                                                            orientation : orientation,
                                                            bilan : bilan,
                                                            evacuation : evacuation,
                                                            prescription : prescription,
                                                            typemal : typemal,
                                                            update : update,
                                                          }
                                                        );
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
 
}

exports.getinfoExam = (req,res,next) => {

      const rawCookies = req.headers.cookie.split('; ');
      const parsedCookie = rawCookies[0].split('=')[1];
      jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
      async (err,decodedToken)=>   {
        console.log(decodedToken,'token of ordo');
        id_medecin = decodedToken.IdUser;
      });
   
    let today = new Date();
     let month = today.getMonth() +1;
     let year = today.getFullYear();
     let date = today.getDate();
     let db_date = year + '-'+ month + '-' + date;
     pool.getConnection(function(err, db) {
      db.query("Select * from drug",(err,drugs)=> {

console.log("drugs",drugs);
    
        if(err) {
          console.log("error", err);
        }else{
          db.query("Select * from exams",(err,exams)=> {
            if(err) {
              console.log("error", err);
            }else{
                db.query("SELECT IdPatient,p_Firstname,p_Lastname,DATE_FORMAT(Birthday,'%d/%m/%Y') as birthday FROM patient WHERE idpatient = ? ",
                [req.query.id],
                (err,result)=> {
                  console.log(result);
                  if(err) {
                    console.log("error", err);
                  }else{
                      db.query("SELECT * FROM sickness ",
                      (err,sickness)=> {
                        console.log(result);
                        if(err) {
                          console.log("error", err);
                        }else{
                          db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM sicknote where  iduser = ? and idpatient = ? and date_medicalexam = ? ",[id_medecin,req.query.id,db_date],
                            (err,ordo)=> {
                              console.log(result);
                              if(err) {
                                console.log("error", err);
                              }else{
                                db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM orientation where  iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                  (err,orientation)=> {
                                    console.log(result);
                                    if(err) {
                                      console.log("error", err);
                                    }else{
                                      db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM medical_checkup where  iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                        (err,bilan)=> {
                                          console.log(result);
                                          if(err) {
                                            console.log("error", err);
                                          }else{
                                            db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM evacuation where  iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                              (err,evacuation)=> {
                                                console.log(result);
                                                if(err) {
                                                  console.log("error", err);
                                                }else{
                                                  db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%d/%m/%Y') as date_medicalexam FROM prescription where  iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                                    (err,prescription)=> {
                                                      console.log(result);
                                                      if(err) {
                                                        console.log("error", err);
                                                      }else{
                                                        db.query("SELECT * FROM type_sickness",
                                                        (err,typemal)=> {
                                                          console.log(result);
                                                          if(err) {
                                                            console.log("error", err);
                                                          }else{
                                                            db.query("SELECT * FROM medicalexam where iduser = ? and idpatient = ? and date_medicalexam = ?",[id_medecin,req.query.id,db_date],
                                                        (err,exam)=> {
                                                          console.log(result);
                                                          if(err) {
                                                            console.log("error", err);
                                                          }else{
                                                            res.render('MedicalExam/MedicalExam', {
                                                              title: 'Exam insertion',
                                                              insertexam: result[0],
                                                              drugs : drugs,
                                                              exams : exams,
                                                              sickness : sickness,
                                                              ordo : ordo,
                                                              orientation : orientation,
                                                              bilan : bilan,
                                                              evacuation : evacuation,
                                                              prescription : prescription,
                                                              typemal : typemal,
                                                              exam : exam,
                                                            }
                                                          );
                                                          
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
     });
 
  }

exports.postaddExam = (req,res,next) => {

  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookie = rawCookies[0].split('=')[1];
  jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
  async (err,decodedToken)=>   {
    console.log(decodedToken,'token of ordo');
    id_medecin = decodedToken.IdUser;
  });
  id_patient = req.body.id;
  let today = new Date();
  let month = today.getMonth() +1;
  let year = today.getFullYear();
  let date = today.getDate();
  let day = year + '-'+ month + '-' + date;
  var db_date = dateFormat(day,"yyyy-mm-dd");

  let mot = req.body.listmal;
  const list = mot.split("#");

  console.log("=====================");

  pool.getConnection(function(err, db) {
    db.query("INSERT INTO medicalexam (`iduser`, `idpatient`, `date_medicalexam`, `taille`, `weight`, `IMC`, `TA`, `motive`, `signe`, `diagnostic`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);    ",
    [id_medecin,id_patient,db_date,req.body.taille,req.body.poids,req.body.imc,req.body.ta,req.body.motif,req.body.signe,req.body.diagnostic],
    (err,result)=> {
      console.log(result);
      if(err) {
        console.log("error", err);
      }else{
        for (i = 1; i < list.length; i++) {               
          db.query("INSERT INTO havesickness SET iduser = ?, idpatient = ?, date_medicalexam =?, name_sickness = ?",[
            id_medecin,id_patient,db_date,list[i]],
            (err, res2) => {
              if(err) {
                console.log("error", err);
              }else{
                console.log('maladie ajoute');
              }
            }
          );
        }
        res.send('success');
      }
    });
  });

}

exports.postupdateExam = (req,res,next) => {

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });

  let mot = req.body.listmal;
  const list = mot.split("#");

  pool.getConnection(function(err, db) {
   db.query("delete from havesickness where  iduser = ? and idpatient = ? and date_medicalexam = ? ",[id_medecin,req.body.id,req.body.date],
    (err, result1) => {
      console.log(err);
      if(err) {
        return res.send('error'); 
      }else{
        for (i = 1; i < list.length; i++) {               
          db.query("INSERT INTO havesickness SET iduser = ?, idpatient = ?, date_medicalexam =?, name_sickness = ?",[
            id_medecin,req.body.id,req.body.date,list[i]],
            (err, res2) => {
              if(err) {
                console.log("error", err);
              }else{
                console.log('maladie ajoute');
              }
            }
          );
        }
        db.query("Update medicalexam set `taille`=? ,`weight`=?, `IMC`=?, `TA`=?, `motive`=?, `signe`=?, `diagnostic`=? where iduser = ? and idpatient = ? and date_medicalexam = ?",[
          req.body.taille,req.body.poids,req.body.imc,req.body.ta,req.body.motif,req.body.signe,req.body.diagnostic,id_medecin,req.body.id,req.body.date],
          (err, res2) => {
            if(err) {
              console.log("error", err);
            }else{
              return res.send('succes');
            }
          }
        );
      }
    }
    );
  });    

}

exports.postaddSickness = (req,res,next) => {

find = req.body.find;
pool.getConnection(function(err, db){
  if(find == 1){
    db.query("INSERT INTO sickness (`name_sickness`, `type_sickness`) VALUES (?, ?)",[req.body.mal,req.body.type],
    (err,res1)=> {
      if(err) {
        console.log('error',err);
      }else{
        return res.send('succes');
      }
    });
  }
  if(find == 0){
    db.query("INSERT INTO type_sickness (`type_sickness`) VALUES (?)",[req.body.type],
    (err,res1)=> {
      if(err) {
        console.log('error',err);
      }else{
        db.query("INSERT INTO sickness (`name_sickness`, `type_sickness`) VALUES (?, ?)",[req.body.mal,req.body.type],
        (err,res2)=> {
          if(err) {
            console.log('error',err);
          }else{
            return res.send('succes');
          }
        });
      }
    });
  }
})

}

// ------------------------------------- examen complementaire ---------------------------------------------- 

 //--- ADD DRUG ---//
 exports.postMedicament = (req,res,next) => {
   pool.getConnection(function(err, db){
    db.query("insert into drug set name_drug= ? ",[req.body.med],(err,exams)=> {
      if(err) {
        console.log("error", err);
      }else{
        return  res.json({
          message:"Medicament ajoute !"
        }) 
      }
    });
   })
  
   
  
  } 
  
   //--- ADD Exam ---//
  exports.postExamen = (req,res,next) => {
     pool.getConnection(function(err, db){
      db.query("insert into exams set name_exam= ? ",[req.body.typeexamen],(err,exams)=> {
        if(err) {
          console.log("error", err);
        }else{
          return  res.json({
            message:"Examen ajoute !"
          }) 
        }
      });
     })
   
  }
  
   //--- CREATE SICKNOTE ---//
  exports.postSicknote = (req,result,next) => {

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   var db_date=d[2]+'-'+d[1]+'-'+d[0];
   year=d[2];

   let mot = req.body.info;
   const list = mot.split("#");
   pool.getConnection(function (err, db) {
    db.query("INSERT INTO sicknote SET iduser = ?, idpatient = ?, date_medicalexam = ?",[
      id_medecin,id_patient,db_date],
      (err, res) => {
        if(err) {
          console.log("error", err);
        }else{
          console.log('bien ajoutee');
  
          db.query("SELECT LAST_INSERT_ID() as id",
            (err, res1) => {
              if(err) {
                console.log("error", err);
              }else{
  
                var numordo = res1[0].id;
                for (i = 1; i < list.length; i+=3) {
                  
                  db.query("INSERT INTO containsdrug SET num_sick= ?, name_drug = ?, posologie = ?, duration = ?",[
                    numordo,list[i],list[i+1],list[i+2]],
                    (err, res2) => {
                      if(err) {
                        console.log("error", err);
                      }else{
                        console.log('medicament ajoute');
                      }
                    }
                  );
                }
  
                createpdfordonnance(req,result,next,db_date,list,year,id_patient,id_medecin,numordo);
              }
            }
          );
        }
      }
    );    
   }); 
    
}
  
function createpdfordonnance(req,re,next,db_date,list,year,id_patient,id_medecin,numordo){
   
 pool.getConnection(function(err, db){
  db.query("SELECT p_Lastname,p_Firstname,Year(Birthday) as yearB FROM patient WHERE idpatient = ?",[id_patient],
  (err, res) => {
    if(err) {
      console.log("error", err);
    }else{
      db.query("SELECT * FROM users u inner join doctor d on u.IdUser=d.Iduser WHERE d.Iduser = ?",[id_medecin],
       (err, res1) => {
          if(err) {
            console.log("error", err);
          }else{
     
          var specialite = res1[0].speciality ;
          var nommed = res1[0].Lastname ;
          var prenommed = res1[0].Firstname ;
          var nom = res[0].p_Lastname ;
          var prenom = res[0].p_Firstname ;
          var nee = res[0].yearB;
          var age = year - nee;
          

          const doc = new PDFDocument({compress:false});
          name_file = 'Ordonnance'+id_patient+'_'+id_medecin+db_date+'.pdf';
          
          const file = fs.createWriteStream(name_file); 
          
          doc.pipe(file);

          doc.image('public/assets/Logo-Complet-ESI-SBA.png', 495, 30, {fit: [80, 80], align: 'centre'});
          doc
            .font('Times-Bold')
            .fontSize(18)
            .text('UMP de l\'Ecole Nationale Supérieure d\'Informatique de Sidi Bel Abbès', 155, 50 ,{width: 300,
             align: 'center'});
            
            doc.moveDown();
          doc
            .font('Times-Roman')
            .fontSize(12)
            .text('BP 73 Bureau de poste ELWIAM, Sidi Djillali \n           Sidi Bel Abbés 22016, Algérie\n\n    Tél : +213 48 74 94 52 \n    Fax : +213 48 74 94 50 \n    E-mail : contact@esi-sba.dz', 60 , 125,{width: 230 , align: 'centre'});
            
          doc
            .font('Times-Roman')
            .fontSize(13)
            .text(' Dr: '+nommed+' '+prenommed+' \n    '+specialite+' \n\n Sidi Bel Abbès\n Le: '+db_date, 390, 130,{width: 200 , align: 'centre', valign: 'right'});
            
          doc.moveDown();
 
          const entete = {
            headers: ['',''],
            rows: [['','']]
          };
 
          var i=1;
          doc.table(entete, {
            prepareHeader: () => doc.font('Times-Bold').fontSize(15),
            prepareRow: (row, i) => doc.font('Times-Roman').fontSize(12),
          });
 
          doc.moveDown();
 
          doc
            .font('Times-Roman')
            .fontSize(15)
            .fillColor('black')
            .text('Nom: '+nom, 80, 255,{width:150, align: 'centre', valign: 'centre'});
            
            doc
            .font('Times-Roman')
            .fontSize(15)
            .fillColor('black')
            .text('Prénom: '+prenom, 260, 255,{width:150, align: 'centre', valign: 'centre'});
            
            doc
            .font('Times-Roman')
            .fontSize(15)
            .fillColor('black')
            .text('Age: '+age+' ', 450, 255,{width:150,align: 'centre', valign: 'centre'});
            
          doc.moveDown();
 
          doc
          .font('Times-Bold')
          .fontSize(18)
          .fillColor('#01559c')
          .text('Ordonnance', 256, 300,{ underline: true,align: 'centre', valign: 'centre'});
          
          doc.moveDown();
 
          var t =0 ;
 
          for (i = 1; i < list.length; i+=3) {
            doc
            .font('Times-Roman')
            .fontSize(14)
            .fillColor('black')
            .text(list[i],90,350+t,{width:300, align: 'centre', valign: 'centre'});

            doc
            .font('Times-Roman')
            .fontSize(14)
            .fillColor('black')
            .text(list[i+1],300,350+t,{width:200, align: 'centre', valign: 'centre'});
 
            doc
            .font('Times-Roman')
            .fontSize(14)
            .fillColor('black')
            .text(list[i+2],450,350+t,{ align: 'centre', valign: 'centre'});
 
            t+=30;
          }

          doc.end();

          (async function () {
            
            const pdfdoc = name_file ;
            const pdfpath = path.join( pdfdoc);
            fs.readFile(pdfpath, (err, data) =>{
            if(err){
              return next(err);
            }
            re.setHeader('Content-Type', 'application/pdf');
            pool.getConnection(function(err, connection) {
            connection.query("UPDATE sicknote SET `sicknote` = ? WHERE (`num_sick` = ?);",
                [name_file, numordo],
                (err, result)=>{
                  if(err){
                    console.log("error", err);
                  }else{
                    return   re.send({
                      'message' : 'Opération éffectué avec succées',
                    })
                  }}
                )
                });
            });
          })().catch( e => { console.error(e) })

            }
           });
     }
   });
 }); 

           
}
        
   //--- CREATE ORIENTATION ---//
  exports.postOrientation = (req,result,next) => {

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   var db_date=d[2]+'-'+d[1]+'-'+d[0];
   year=d[2];
   
    let mot = req.body.infoori;
    const list = mot.split("/");
    pool.getConnection(function (err, db) {

      db.query("INSERT INTO orientation (`antecedent`, `signe`, `iduser`, `idpatient`, `date_medicalexam`) VALUES (?, ?, ?, ?, ?);",[
        req.body.antc,req.body.consult,id_medecin,id_patient,db_date],
        (err, res) => {
          if(err) {
            console.log("error", err);
          }else{
            console.log('bien ajoutee');
    
            db.query("SELECT LAST_INSERT_ID() as id",
              (err, res1) => {
                if(err) {
                  console.log("error", err);
                }else{
    
                  var numor = res1[0].id;
                  for (i = 1; i < list.length; i++) {
                    
                    db.query("INSERT INTO resulltexamorientation SET num_or= ?, name_exam = ?",[
                      numor,list[i]],
                      (err, res2) => {
                        if(err) {
                          console.log("error", err);
                        }else{
                          console.log('examen ajoute');
                        }
                      }
                    );
                  }
                  createpdforientation(req,result,next,db_date,list,year,id_patient,id_medecin,numor);
                }
              }
            );
          }
        }
      );
    })
  
   
  }
  
  function createpdforientation(req,re,next,db_date,list,year,id_patient,id_medecin,numor){

    const doc = new PDFDocument({compress:false});
  name_file = 'Orientation'+id_patient+'_'+id_medecin+db_date+'.pdf';
   
  const file = fs.createWriteStream(name_file); 
  try {
   doc.pipe(file);
  }catch(e) {
    if(e) {
      console.log(e);
    }
  }
   pool.getConnection(function(err,db){
    db.query("SELECT p_Lastname,p_Firstname,Year(Birthday) as yearB FROM patient WHERE idpatient = ?",[id_patient],
    (err, res) => {
      if(err) {
        console.log("error", err);
      }else{
        db.query("SELECT * FROM users u inner join doctor d on u.IdUser=d.Iduser WHERE d.Iduser = ?",[id_medecin],
       (err, res1) => {
          if(err) {
            console.log("error", err);
          }else{
     
            var specialite = res1[0].speciality ;
            var nommed = res1[0].Lastname ;
            var prenommed = res1[0].Firstname ;
            var nom = res[0].p_Lastname ;
            var prenom = res[0].p_Firstname ;
            var nee = res[0].yearB;
            var age = year - nee;
            
            doc.image('public/assets/Logo-Complet-ESI-SBA.png', 495, 30, {fit: [80, 80], align: 'centre'});
            doc
              .font('Times-Bold')
              .fontSize(18)
              .text('UMP de l\'Ecole Nationale Supérieure d\'Informatique de Sidi Bel Abbès', 155, 50 ,{width: 300,
               align: 'center'});
              
              doc.moveDown();
            doc
              .font('Times-Roman')
              .fontSize(12)
              .text('BP 73 Bureau de poste ELWIAM, Sidi Djillali \n           Sidi Bel Abbés 22016, Algérie\n\n    Tél : +213 48 74 94 52 \n    Fax : +213 48 74 94 50 \n    E-mail : contact@esi-sba.dz', 60 , 125,{width: 230 , align: 'centre'});
              
            doc
              .font('Times-Roman')
              .fontSize(13)
              .text(' Dr: '+nommed+' '+prenommed+' \n    '+specialite+' \n\n Sidi Bel Abbès\n Le: '+db_date, 390, 130,{width: 200 , align: 'centre', valign: 'right'});
              
            doc.moveDown();
   
            const entete = {
              headers: ['',''],
              rows: [['','']]
            };
   
            var i=1;
            doc.table(entete, {
              prepareHeader: () => doc.font('Times-Bold').fontSize(15),
              prepareRow: (row, i) => doc.font('Times-Roman').fontSize(12),
            });
   
            doc.moveDown();
   
            doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Nom: '+nom, 80, 255,{width:150, align: 'centre', valign: 'centre'});
              
              doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Prénom: '+prenom, 260, 255,{width:150, align: 'centre', valign: 'centre'});
              
              doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Age: '+age+' ', 450, 255,{width:150,align: 'centre', valign: 'centre'});
              
            doc.moveDown();
   
            doc
            .font('Times-Bold')
            .fontSize(18)
            .fillColor('#01559c')
            .text('Orientation', 256, 300,{ underline: true,align: 'centre', valign: 'centre'});
            
            doc.moveDown();
            doc.moveDown();
            doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Chèr confrère ;\n\n Permettez moi de vous adresser le patient '
              +nom+' '+prenom+' âgé de '+age+
              ' ans, aux antcd de '+req.body.antc+' qui consulte a notre service pour '+req.body.consult+' \n\n Je vous le confie pour faire l\'(les) examen(s) suivant(s) :',
              80,350,{ align: 'centre', valign: 'centre'});
  
              doc.moveDown();
  
            for (i = 1; i < list.length; i++) {
              doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('    - '+list[i],{ align: 'centre', valign: 'centre'});
  
              doc.moveDown();
            }
            doc.end();

            (async function () {
            
              const pdfdoc = name_file ;
              const pdfpath = path.join( pdfdoc);
              fs.readFile(pdfpath, (err, data) =>{
              if(err){
                return next(err);
              }
              re.setHeader('Content-Type', 'application/pdf');
              
              db.query("UPDATE orientation SET `orientation` = ? WHERE (`num_or` = ?);",
                  [data, numor],
                  (err, result)=>{
                    if(err){
                      console.log("error", err);
                    }else{
                      return   re.send({
                        'message' : 'Opération éffectué avec succées',
                      })
                    }}
                  )
                  });
              
            })().catch( e => { console.error(e) })

           }
         });
       }
     }); 

   })  
  console.log(id_patient);
   
  }

   //--- CREATE BILAN ---//
   
  exports.postBilan = (req,result,next) => {
  
    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   var db_date=d[2]+'-'+d[1]+'-'+d[0];
   year=d[2];
   
    let mot = req.body.infobilan;
    const list = mot.split("/"); 
    pool.getConnection(function (err,db){
      db.query("INSERT INTO medical_checkup (`consultation`, `conclusion`, `iduser`, `idpatient`, `date_medicalexam`) VALUES (?, ?, ?, ?, ?);",
      [req.body.consultexam,req.body.conclusioon,id_medecin,id_patient,db_date],
      (err, res) => {
        if(err) {
          console.log("error", err);
        }else{
          console.log('bien ajoutee');
  
          db.query("SELECT LAST_INSERT_ID() as id",
            (err, res1) => {
              if(err) {
                console.log("error", err);
              }else{
  
                var numbi = res1[0].id;
                for (i = 1; i < list.length; i+=2) {
                  
                  db.query("INSERT INTO resultexam SET num_ch= ?, name_exam = ?,result = ?",[
                    numbi,list[i],list[i+1]],
                    (err, res2) => {
                      if(err) {
                        console.log("error", err);
                      }else{
                        console.log('examen ajoute');
                      }
                    }
                  );
                }
                createpdfbilan(req,result,next,db_date,list,year,id_patient,id_medecin,numbi);
              }
            }
          );
        }
      }
    );
    })
    
  }

  function createpdfbilan(req,re,next,db_date,list,year,id_patient,id_medecin,numbi){

    const doc = new PDFDocument({compress:false});
    name_file = 'Bilan'+id_patient+'_'+id_medecin+db_date+'.pdf';
    
    const file = fs.createWriteStream(name_file); 
    try {
    doc.pipe(file);
    }catch(e) {
      if(e) {
        console.log(e);
      }
    }

    pool.getConnection(function(err,db){
      db.query("SELECT p_Lastname,p_Firstname,Year(Birthday) as yearB FROM patient WHERE idpatient = ?",[id_patient],
      (err, res) => {
        if(err) {
          console.log("error", err);
        }else{
         db.query("SELECT * FROM users u inner join doctor d on u.IdUser=d.Iduser WHERE d.Iduser = ?",[id_medecin],
         (err, res1) => {
            if(err) {
              console.log("error", err);
            }else{
       
              var specialite = res1[0].speciality ;
              var nommed = res1[0].Lastname ;
              var prenommed = res1[0].Firstname ;
              var nom = res[0].p_Lastname ;
              var prenom = res[0].p_Firstname ;
              var nee = res[0].yearB;
              var age = year - nee;
              
              doc.image('public/assets/Logo-Complet-ESI-SBA.png', 495, 30, {fit: [80, 80], align: 'centre'});
              doc
                .font('Times-Bold')
                .fontSize(18)
                .text('UMP de l\'Ecole Nationale Supérieure d\'Informatique de Sidi Bel Abbès', 155, 50 ,{width: 300,
                 align: 'center'});
                
                doc.moveDown();
              doc
                .font('Times-Roman')
                .fontSize(12)
                .text('BP 73 Bureau de poste ELWIAM, Sidi Djillali \n           Sidi Bel Abbés 22016, Algérie\n\n    Tél : +213 48 74 94 52 \n    Fax : +213 48 74 94 50 \n    E-mail : contact@esi-sba.dz', 60 , 125,{width: 230 , align: 'centre'});
                
              doc
                .font('Times-Roman')
                .fontSize(13)
                .text(' Dr: '+nommed+' '+prenommed+' \n    '+specialite+' \n\n Sidi Bel Abbès\n Le: '+db_date, 390, 130,{width: 200 , align: 'centre', valign: 'right'});
                
              doc.moveDown();
     
              const entete = {
                headers: ['',''],
                rows: [['','']]
              };
     
              doc.table(entete, {
                prepareHeader: () => doc.font('Times-Bold').fontSize(15),
                prepareRow: (row, i) => doc.font('Times-Roman').fontSize(12),
              });
     
              doc.moveDown();
     
              doc
                .font('Times-Roman')
                .fontSize(15)
                .fillColor('black')
                .text('Nom: '+nom, 80, 255,{width:150, align: 'centre', valign: 'centre'});
                
                doc
                .font('Times-Roman')
                .fontSize(15)
                .fillColor('black')
                .text('Prénom: '+prenom, 260, 255,{width:150, align: 'centre', valign: 'centre'});
                
                doc
                .font('Times-Roman')
                .fontSize(15)
                .fillColor('black')
                .text('Age: '+age+' ', 450, 255,{width:150,align: 'centre', valign: 'centre'});
                
              doc.moveDown();
     
              doc
              .font('Times-Bold')
              .fontSize(18)
              .fillColor('#01559c')
              .text('Compte Rendu', 256, 300,{ underline: true,align: 'centre', valign: 'centre'});
              
    
             doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
             .text('Compte rendu du patient '
             +nom+' '+prenom+' âgé de '+age+' ans, consulte pour '+req.body.consultexam,80, 350,{ align: 'centre'});
             
             doc.moveDown();
             
             doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
             .text('Apres la realisation des examens sus-cité : ',80, 390,{ align: 'centre', valign: 'centre'});
             
             doc.moveDown();
    
    
             for (i = 1; i < list.length; i+=2) {
               doc
               .font('Times-Roman')
               .fontSize(15)
               .fillColor('black')
               .text('     - '+list[i]+'  :  '+list[i+1],{ align: 'centre', valign: 'centre'});
               doc.moveDown();
             }
    
             doc
             .font('Times-Roman')
             .fontSize(15)
             .fillColor('black')
            .text(' On conclue : '+req.body.conclusioon,{ align: 'centre', valign: 'centre'});
            
              doc.end();
   
              (async function () {
               
               const pdfdoc = name_file ;
               const pdfpath = path.join( pdfdoc);
               fs.readFile(pdfpath, (err, data) =>{
               if(err){
                 return next(err);
               }
               console.log(numbi);
               re.setHeader('Content-Type', 'application/pdf');
               pool.getConnection(function(err, connection) {
               connection.query("UPDATE medical_checkup SET `checkup` = ? WHERE (`num_ch` = ?);",
                   [data, numbi],
                   (err, result)=>{
                     if(err){
                       console.log("error", err);
                     }else{
                       return   re.send({
                         'message' : 'Opération éffectué avec succées',
                       })
                     }}
                   )
                   });
               });
             })().catch( e => { console.error(e) })
             }
         });
       }
     });
    }); 
  
  
}
  
   //--- CREATE EVACUATION ---//
  exports.postEvacuation = (req,res,next) => {
  
    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   var db_date=d[2]+'-'+d[1]+'-'+d[0];
   year=d[2];
pool.getConnection(function (err,db) {
  db.query("INSERT INTO evacuation ( `cause_evacuation`, `place_evacuation`, `hospital`, `duration_evacuation`, `iduser`, `idpatient`, `date_medicalexam`) VALUES (?, ?, ?, ?, ?, ?, ?);",[
    req.body.causeev,req.body.wil,req.body.hopital,req.body.dure,id_medecin,id_patient,db_date],
    (err, res1) => {
      if(err) {
        console.log("error", err);
      }else{
        console.log('bien ajoutee');

        db.query("SELECT LAST_INSERT_ID() as id",
          (err, res2) => {
            if(err) {
              console.log("error", err);
            }else{
              var numev = res2[0].id;
              createpdfevacuation(req,res,next,db_date,year,id_patient,id_medecin,numev);
            }
          }
        );
      }
    }
  );  
})
    
    
  }

  function createpdfevacuation(req,re,next,db_date,year,id_patient,id_medecin,numev){

    const doc = new PDFDocument({compress:false});
    name_file = 'Evacuation'+id_patient+'_'+id_medecin+db_date+'.pdf';
    
    const file = fs.createWriteStream(name_file); 
    try {
    doc.pipe(file);
    }catch(e) {
      if(e) {
        console.log(e);
      }
    }
  pool.getConnection(function(err,db){
    db.query("SELECT p_Lastname,p_Firstname,Year(Birthday) as yearB FROM patient WHERE idpatient = ?",[id_patient],
    (err, res) => {
      if(err) {
        console.log("error", err);
      }else{
       db.query("SELECT * FROM users u inner join doctor d on u.IdUser=d.Iduser WHERE d.Iduser = ?",[id_medecin],
       (err, res1) => {
          if(err) {
            console.log("error", err);
          }else{
     
            var specialite = res1[0].speciality ;
            var nommed = res1[0].Lastname ;
            var prenommed = res1[0].Firstname ;
            var nom = res[0].p_Lastname ;
            var prenom = res[0].p_Firstname ;
            var nee = res[0].yearB;
            var age = year - nee;
            
            doc.image('public/assets/Logo-Complet-ESI-SBA.png', 495, 30, {fit: [80, 80], align: 'centre'});
            doc
              .font('Times-Bold')
              .fontSize(18)
              .text('UMP de l\'Ecole Nationale Supérieure d\'Informatique de Sidi Bel Abbès', 155, 50 ,{width: 300,
               align: 'center'});
              
              doc.moveDown();
            doc
              .font('Times-Roman')
              .fontSize(12)
              .text('BP 73 Bureau de poste ELWIAM, Sidi Djillali \n           Sidi Bel Abbés 22016, Algérie\n\n    Tél : +213 48 74 94 52 \n    Fax : +213 48 74 94 50 \n    E-mail : contact@esi-sba.dz', 60 , 125,{width: 230 , align: 'centre'});
              
            doc
              .font('Times-Roman')
              .fontSize(13)
              .text(' Dr: '+nommed+' '+prenommed+' \n    '+specialite+' \n\n Sidi Bel Abbès\n Le: '+db_date, 390, 130,{width: 200 , align: 'centre', valign: 'right'});
              
            doc.moveDown();
   
            const entete = {
              headers: ['',''],
              rows: [['','']]
            };
   
            var i=1;
            doc.table(entete, {
              prepareHeader: () => doc.font('Times-Bold').fontSize(15),
              prepareRow: (row, i) => doc.font('Times-Roman').fontSize(12),
            });
   
            doc.moveDown();
   
            doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Nom: '+nom, 80, 255,{width:150, align: 'centre', valign: 'centre'});
              
              doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Prénom: '+prenom, 260, 255,{width:150, align: 'centre', valign: 'centre'});
              
              doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Age: '+age+' ', 450, 255,{width:150,align: 'centre', valign: 'centre'});
              
            doc.moveDown();
   
            doc
            .font('Times-Bold')
            .fontSize(18)
            .fillColor('#01559c')
            .text('Evacuation', 256, 300,{ underline: true,align: 'centre', valign: 'centre'});
            
            doc.moveDown();
            doc.moveDown();
           
           doc
             .font('Times-Roman')
             .fontSize(15)
             .fillColor('black')
             .text('Chèr confrère ;\n\n Permettez moi de vous adresser le patient '
             +nom+' '+prenom+' âgé de '+age+
             ' ans, pour la prise en charge de soins à l\'hopital '+req.body.hopital+' à '+req.body.wil+'.\n\n'+
             'En effet, la situation médical de mon malade ('+req.body.causeev+') nécessite des soins chez vous pour une durée de '+req.body.dure+
             ' \n\n Etablis par : Dr '+nommed+' '+prenommed+' de l\'Ecole Nationale Supérieure d\'Informatique de Sidi Bel Abbès'+
              '\n\n                                                                                   Le : '+db_date,
             80,350,{ align: 'centre', valign: 'centre'});
  
             doc.moveDown();
           
           doc.end();
 
           (async function () {
             
             const pdfdoc = name_file ;
             const pdfpath = path.join( pdfdoc);
             fs.readFile(pdfpath, (err, data) =>{
             if(err){
               return next(err);
             }
             re.setHeader('Content-Type', 'application/pdf');
             db.query("UPDATE evacuation SET `evacuation` = ? WHERE (`num_ev` = ?);",
                 [data, numev],
                 (err, result)=>{
                   if(err){
                     console.log("error", err);
                   }else{
                     return   re.send({
                       'message' : 'Opération éffectué avec succées',
                     })
                   }}
                 )
                 });
           })().catch( e => { console.error(e) })
 
         }
       });
     }
   });
  })

  }
  
   //--- CREATE CERTIFICAT ---//
  exports.postCertificatRepos = (req,re,next) => {
  
    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   var db_date=d[2]+'-'+d[1]+'-'+d[0];
   year=d[2];
pool.getConnection(function (err,db) {
  db.query("INSERT INTO prescription (`type_prescription`, `iduser`, `idpatient`, `date_medicalexam`) VALUES ('repos', ?, ?, ?);",[
    id_medecin,id_patient,db_date],
    (err, res) => {
      if(err) {
        console.log("error", err);
      }else{
        console.log('bien ajoutee');

        db.query("SELECT LAST_INSERT_ID() as id",
          (err, res1) => {
            if(err) {
              console.log("error", err);
            }else{
              var numpre = res1[0].id;
              db.query("INSERT INTO rest (`num_pre`, `nb_day`, `date_start_rest`, `date_end_rest`, `destination_rest`) VALUES (?, ?, ?, ?, ?);",
                [numpre,req.body.nbjour,req.body.debut,req.body.fin,req.body.des],
                (err, res) => {
                  if(err) {
                    console.log("error", err);
                  }else{
                    console.log('bien ajoutee');
            
                    db.query("SELECT LAST_INSERT_ID() as id",
                      (err, res1) => {
                        if(err) {
                          console.log("error", err);
                        }else{
                          createpdfcertificatropos(req,re,next,db_date,year,id_patient,id_medecin,numpre);
                        }
                      }
                    );
                  }
                }
              );  
            }
          }
        );
      }
    }
  );  
})
  
    
  }
  
  function createpdfcertificatropos(req,re,next,db_date,year,id_patient,id_medecin,numpre){

    const doc = new PDFDocument({compress:false});
    name_file = 'Certificat_repos'+id_patient+'_'+id_medecin+db_date+'.pdf';
    
    const file = fs.createWriteStream(name_file); 
    try {
    doc.pipe(file);
    }catch(e) {
      if(e) {
        console.log(e);
      }
    }
   pool.getConnection(function(err,db) {
    db.query("SELECT p_Lastname,p_Firstname,Year(Birthday) as yearB FROM patient WHERE idpatient = ?",[id_patient],
    (err, res) => {
      if(err) {
        console.log("error", err);
      }else{
        db.query("SELECT * FROM users u inner join doctor d on u.IdUser=d.Iduser WHERE d.Iduser = ?",[id_medecin],
        (err, res1) => {
           if(err) {
             console.log("error", err);
           }else{
      
             var specialite = res1[0].speciality ;
             var nommed = res1[0].Lastname ;
             var prenommed = res1[0].Firstname ;
             var nom = res[0].p_Lastname ;
             var prenom = res[0].p_Firstname ;
             var nee = res[0].yearB;
             var age = year - nee;
             
             doc.image('public/assets/Logo-Complet-ESI-SBA.png', 495, 30, {fit: [80, 80], align: 'centre'});
             doc
               .font('Times-Bold')
               .fontSize(18)
               .text('UMP de l\'Ecole Nationale Supérieure d\'Informatique de Sidi Bel Abbès', 155, 50 ,{width: 300,
                align: 'center'});
               
               doc.moveDown();
             doc
               .font('Times-Roman')
               .fontSize(12)
               .text('BP 73 Bureau de poste ELWIAM, Sidi Djillali \n           Sidi Bel Abbés 22016, Algérie\n\n    Tél : +213 48 74 94 52 \n    Fax : +213 48 74 94 50 \n    E-mail : contact@esi-sba.dz', 60 , 125,{width: 230 , align: 'centre'});
               
             doc
               .font('Times-Roman')
               .fontSize(13)
               .text(' Dr: '+nommed+' '+prenommed+' \n    '+specialite+' \n\n Sidi Bel Abbès\n Le: '+db_date, 390, 130,{width: 200 , align: 'centre', valign: 'right'});
               
             doc.moveDown();
   
            const entete = {
              headers: ['',''],
              rows: [['','']]
            };
   
            var i=1;
            doc.table(entete, {
              prepareHeader: () => doc.font('Times-Bold').fontSize(15),
              prepareRow: (row, i) => doc.font('Times-Roman').fontSize(12),
            });
   
            doc.moveDown();
   
            doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Nom: '+nom, 80, 255,{width:150, align: 'centre', valign: 'centre'});
              
              doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Prénom: '+prenom, 260, 255,{width:150, align: 'centre', valign: 'centre'});
              
              doc
              .font('Times-Roman')
              .fontSize(15)
              .fillColor('black')
              .text('Age: '+age+' ', 450, 255,{width:150,align: 'centre', valign: 'centre'});
              
            doc.moveDown();
   
            doc
            .font('Times-Bold')
            .fontSize(18)
            .fillColor('#01559c')
            .text('Certificat', 256, 300,{ underline: true,align: 'centre', valign: 'centre'});
            
            doc.moveDown();
            doc.moveDown();
           
           doc
             .font('Times-Roman')
             .fontSize(15)
             .fillColor('black')
             .text('Je soussigne Docteur '+nommed+' '+prenommed+' \n\nCertifier que l\'état de M/Mme '+nom+' '+prenom+' âgé de '+age+
             ' ans, \nnécessite un repos (ou prolongation de repos) de : '+req.body.nbjour+' jours sauf complication, à compter du : '+req.body.debut+
             ' \n\nLe patient pourra reprendre ses activités à compter du : '+req.body.fin+
             ' \n\n\n\n                                                                                   Fait à : '+req.body.des+
             '\n                                                                                   Le : '+db_date,
             80,370,{ align: 'centre', valign: 'centre'});
  
             doc.moveDown();
           
           doc.end();

           (async function () {
            
            const pdfdoc = name_file ;
            const pdfpath = path.join( pdfdoc);
            fs.readFile(pdfpath, (err, data) =>{
            if(err){
              return next(err);
            }
            re.setHeader('Content-Type', 'application/pdf');
            db.query("UPDATE prescription SET `prescription` = ? WHERE (`num_pre` = ?);",
                [data, numpre],
                (err, result)=>{
                  if(err){
                    console.log("error", err);
                  }else{
                    return   re.send({
                      'message' : 'Opération éffectué avec succées',
                    })
                  }}
                )
                });
          })().catch( e => { console.error(e) })


         }
       });
     }
   });
   })
 
  }
  
  exports.postCertificatPratique = (req,re,next) => {
  
    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   var db_date=d[2]+'-'+d[1]+'-'+d[0];
   year=d[2];

   pool.getConnection(function (err,db) {
    db.query("INSERT INTO prescription (`type_prescription`, `iduser`, `idpatient`, `date_medicalexam`) VALUES ('pratique', ?, ?, ?);",[
      id_medecin,id_patient,db_date],
      (err, res) => {
        if(err) {
          console.log("error", err);
        }else{
          console.log('bien ajoutee');
  
          db.query("SELECT LAST_INSERT_ID() as id",
            (err, res1) => {
              if(err) {
                console.log("error", err);
              }else{
                var numpre = res1[0].id;
                db.query("INSERT INTO practice (`num_pre`, `cause_practice`, `destination_practice`) VALUES (?, ?, ?);",
                  [numpre,req.body.cause,req.body.des],
                  (err, res) => {
                    if(err) {
                      console.log("error", err);
                    }else{
                      console.log('bien ajoutee');
              
                      db.query("SELECT LAST_INSERT_ID() as id",
                        (err, res1) => {
                          if(err) {
                            console.log("error", err);
                          }else{
                            createpdfcertificatpratique(req,re,next,db_date,year,id_patient,id_medecin,numpre);
                          }
                        }
                      );
                    }
                  }
                );  
              }
            }
          );
        }
      }
    );  
   })

 
    
   
   }
  
   function createpdfcertificatpratique(req,re,next,db_date,year,id_patient,id_medecin,numpre){

    const doc = new PDFDocument({compress:false});
    name_file = 'Certificat_pratique'+id_patient+'_'+id_medecin+db_date+'.pdf';
    
    const file = fs.createWriteStream(name_file); 
    try {
    doc.pipe(file);
    }catch(e) {
      if(e) {
        console.log(e);
      }
    }
    pool.getConnection(function(err,db) {
      db.query("SELECT p_Lastname,p_Firstname,Year(Birthday) as yearB FROM patient WHERE idpatient = ?",[id_patient],
      (err, res) => {
        if(err) {
          console.log("error", err);
        }else{
         db.query("SELECT * FROM users u inner join doctor d on u.IdUser=d.Iduser WHERE d.Iduser = ?",[id_medecin],
         (err, res1) => {
            if(err) {
              console.log("error", err);
            }else{
       
              var specialite = res1[0].speciality ;
              var nommed = res1[0].Lastname ;
              var prenommed = res1[0].Firstname ;
              var nom = res[0].p_Lastname ;
              var prenom = res[0].p_Firstname ;
              var nee = res[0].yearB;
              var age = year - nee;
              
              doc.image('public/assets/Logo-Complet-ESI-SBA.png', 495, 30, {fit: [80, 80], align: 'centre'});
              doc
                .font('Times-Bold')
                .fontSize(18)
                .text('UMP de l\'Ecole Nationale Supérieure d\'Informatique de Sidi Bel Abbès', 155, 50 ,{width: 300,
                 align: 'center'});
                
                doc.moveDown();
              doc
                .font('Times-Roman')
                .fontSize(12)
                .text('BP 73 Bureau de poste ELWIAM, Sidi Djillali \n           Sidi Bel Abbés 22016, Algérie\n\n    Tél : +213 48 74 94 52 \n    Fax : +213 48 74 94 50 \n    E-mail : contact@esi-sba.dz', 60 , 125,{width: 230 , align: 'centre'});
                
              doc
                .font('Times-Roman')
                .fontSize(13)
                .text(' Dr: '+nommed+' '+prenommed+' \n    '+specialite+' \n\n Sidi Bel Abbès\n Le: '+db_date, 390, 130,{width: 200 , align: 'centre', valign: 'right'});
                
              doc.moveDown();
   
              const entete = {
                headers: ['',''],
                rows: [['','']]
              };
     
              var i=1;
              doc.table(entete, {
                prepareHeader: () => doc.font('Times-Bold').fontSize(15),
                prepareRow: (row, i) => doc.font('Times-Roman').fontSize(12),
              });
     
              doc.moveDown();
     
              doc
                .font('Times-Roman')
                .fontSize(15)
                .fillColor('black')
                .text('Nom: '+nom, 80, 255,{width:150, align: 'centre', valign: 'centre'});
                
                doc
                .font('Times-Roman')
                .fontSize(15)
                .fillColor('black')
                .text('Prenom: '+prenom, 260, 255,{width:150, align: 'centre', valign: 'centre'});
                
                doc
                .font('Times-Roman')
                .fontSize(15)
                .fillColor('black')
                .text('Age: '+age+' ', 450, 255,{width:150,align: 'centre', valign: 'centre'});
                
              doc.moveDown();
     
              doc
              .font('Times-Bold')
              .fontSize(18)
              .fillColor('#01559c')
              .text('Certificat', 256, 300,{ underline: true,align: 'centre', valign: 'centre'});
              
              doc.moveDown();
              doc.moveDown();
             
             doc
               .font('Times-Roman')
               .fontSize(15)
               .fillColor('black')
               .text('Je soussigne Docteur '+nommed+' '+prenommed+' \n\n Certifier que l\'état de M/Mme '+nom+' '+prenom+' âgé de '+age+
               ' ans, \nne révèle pas de contre-indication à la pratique du '+req.body.cause+
               ' \n\n\nEtablis à : '+req.body.des+
               '\n\n\n\n                                                                                   Le : '+db_date,
               80,370,{ align: 'centre', valign: 'centre'});
    
               doc.moveDown();
             
             doc.end();
   
             (async function () {
               
               const pdfdoc = name_file ;
               const pdfpath = path.join( pdfdoc);
               fs.readFile(pdfpath, (err, data) =>{
               if(err){
                 return next(err);
               }
               re.setHeader('Content-Type', 'application/pdf');
               db.query("UPDATE prescription SET `prescription` = ? WHERE (`num_pre` = ?);",
                   [data, numpre],
                   (err, result)=>{
                     if(err){
                       console.log("error", err);
                     }else{
                       return   re.send({
                         'message' : 'Opération éffectué avec succées',
                       })
                     }}
                   )
                   });
             })().catch( e => { console.error(e) })
   
           }
         });
       }
     });
    })
  
  
   }
    
    //--- UPDATE SICKNOTE ---//
  exports.postupdateSicknote = (req,re,next) => {
  
    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;
   var date=req.body.today_date;
   const d = date.split("/");
   year=d[2];
    let mot = req.body.info;
    const list = mot.split("#");
    pool.getConnection(function(err, db) {
      db.query("delete from containsdrug where num_sick = ? ",[req.body.num_sick],
      (err, res) => {
        console.log(err);
        if(err) {
          console.log('error'); 
        }else{
       
          for (i = 1; i < list.length; i+=3) {
                       
           db.query("INSERT INTO containsdrug SET name_drug = ?, posologie = ?, duration = ?, num_sick= ?",[
             list[i],list[i+1],list[i+2],req.body.num_sick],
             (err, res2) => {
               if(err) {
                 console.log("error", err);
               }else{
                 console.log('medicament ajoute');
               }
             }
           );
         }
         db.query("select DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date from sicknote  where num_sick = ?",[req.body.num_sick],
         (err, res1) => {
           console.log(err);
           if(err) {
             console.log('error');  
           }else{
             createpdfordonnance(req,re,next,res1[0].date,list,year,id_patient,id_medecin,req.body.id);    
           } 
         });

       
        } 
      });
    });
  }
  
    //--- UPDATE ORIENTATION ---//
  exports.postupdateOrientation = (req,res,next) => {

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   year=d[2];
   
    let mot = req.body.infoori;
    const list = mot.split("/");

    pool.getConnection(function(err, db) {
      db.query("delete from resulltexamorientation where num_or =? ",[req.body.num_or],
      (err, resq) => {
        console.log(err);
        if(err) {
          console.log('error'); 
        }else{
          for (i = 1; i < list.length; i++) {
                  
            db.query("INSERT INTO resulltexamorientation SET num_or= ?, name_exam = ?",[
              req.body.num_or,list[i]],
              (err, res2) => {
                if(err) {
                  console.log("error", err);
                }else{
                  console.log('examen ajoute');
                }
              }
            );
          }
        } 
      });
     db.query("update orientation set  antecedent = ? , signe = ? where num_or = ?",[
        req.body.antc,req.body.consult,req.body.num_or],
      (err, res2) => {
        console.log(err);
        if(err) {
          console.log('error');  
        }else{
          db.query("select * from orientation where num_or = ?",[
            req.body.num_or],
          (err, res1) => {
            console.log(err);
            if(err) {
              console.log('error');  
            }else{
              var db_date=dateFormat(res1[0].date_medicalexam,"yyyy-mm-dd");
              createpdforientation(req,res,next,db_date,list,year,id_patient,id_medecin,req.body.num_or);
            } 
          });
        } 
      });
    });
 
  
  }
  
    //--- UPDATE BILAN ---//
  exports.postupdateBilan = (req,re,next) => {

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   year=d[2];
   
    let mot = req.body.infobilan;
    const list = mot.split("/"); 
    console.log(list);
  
    pool.getConnection(function(err, db) {
     db.query("delete from resultexam where num_ch =? ",[req.body.num_ch],
      (err, res) => {
        console.log(err);
        if(err) {
          console.log('error'); 
        }else{
          for (i = 1; i < list.length; i+=2) {
                  
            db.query("INSERT INTO resultexam SET num_ch= ?, name_exam = ?,result = ?",[
              req.body.num_ch,list[i],list[i+1]],
              (err, res2) => {
                if(err) {
                  console.log("error", err);
                }else{
                  console.log('examen ajoute');
                }
              }
            );
          }
          db.query("update medical_checkup set consultation = ? , conclusion = ? where num_ch = ?",[
            req.body.consultexam,req.body.conclusioon,req.body.num_ch
          ],
          (err, res) => {
            console.log(err);
            if(err) {
              console.log('error');  
            }else{
              db.query("select * from medical_checkup where num_ch = ?",[
                req.body.num_ch
              ],
              (err, res1) => {
                console.log(err);
                if(err) {
                  console.log('error');  
                }else{
                  var db_date=dateFormat(res1[0].date_medicalexam,"yyyy-mm-dd");
                  createpdfbilan(req,re,next,db_date,list,year,id_patient,id_medecin,req.body.num_ch);
                } 
              });
            } 
          });
        } 
      });
    });
  }
  
    //--- UPDATE EVACUATION ---//
  exports.postupdateEvacuation = (req,res,next) => {

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   year=d[2];
  
    pool.getConnection(function(err, db) {
     db.query("update evacuation set cause_evacuation = ? , place_evacuation = ? , hospital = ? , duration_evacuation = ? where num_ev = ?",[
        req.body.causeev,req.body.wil,req.body.hopital,req.body.dure,req.body.num_ev
      ],
      (err, result1) => {
        console.log(err);
        if(err) {
          console.log('error');  
        }else{
        db.query("select DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date from evacuation  where num_ev = ?",[
            req.body.num_ev
          ],
          (err, res1) => {
            console.log(err);
            if(err) {
              console.log('error');  
            }else{
              createpdfevacuation(req,res,next,res1[0].date,year,id_patient,id_medecin,req.body.num_ev);
            } 
          });
        
        } 
      });
    });
  
  }
  
    //--- UPDATE CERTIFICARCAT REPOS ---//
  exports.postupdateCertificatRepos = (req,re,next) => {

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   year=d[2];


            pool.getConnection(function(err,db) {
              db.query("update rest set nb_day = ? , date_start_rest = ? , date_end_rest = ? , destination_rest = ? where num_pre = ?",[
                req.body.nbjour,req.body.debut,req.body.fin,req.body.des,req.body.num_pre
              ],
              (err, res) => {
                console.log(err);
                if(err) {
                  return res.send('error');  
                }else{
                  db.query("select DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date from prescription where num_pre = ?",[
                      req.body.num_pre
                    ],
                    (err, re1) => {
                      console.log(err);
                      if(err) {
                        return re1.send('error');  
                      }else{
                        createpdfcertificatropos(req,re,next,re1[0].date,year,id_patient,id_medecin,req.body.num_pre);
                      } 
                  });
                } 
          
      });
    });
  }
  
    //--- UPDATE CERTIFICAT PRATIQUE ---//
  exports.postupdateCertificatPratique = (req,res,next) => {

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
    async (err,decodedToken)=>   {
      console.log(decodedToken,'token of ordo');
      id_medecin = decodedToken.IdUser;
    });
    id_patient = req.body.id;

   var date=req.body.today_date;
   const d = date.split("/");
   year=d[2];

          pool.getConnection(function(err, db) {
           db.query("update rest set cause_practice = ? , destination_rest = ? where num_pre = ?",[
              req.body.cause,req.body.des,req.body.num_pre
            ],
            (err, res) => {
              console.log(err);
              if(err) {
                return res.send('error');  
              }else{
                db.query("select DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date from prescription where num_pre = ?",[
                  req.body.num_pre
                ],
                (err, res1) => {
                  console.log(err);
                  if(err) {
                    return res1.send('error');  
                  }else{
                    createpdfcertificatpratique(req,re,next,res1[0].date,year,id_patient,id_medecin,num_pre);
                  } 
              });
              } 
     });
   });
  
  }
  
    //--- DELETE SICKNOTE ---//
  exports.postdeleteSicknote = (req,res,next) => {
    
    pool.getConnection(function(err, db) {
      db.query("delete from containsdrug where num_sick =? ",[req.body.num_sick],
      (err, result1) => {
        console.log(err);
        if(err) {
          return res.send('error'); 
        }else{
         db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date FROM sicknote WHERE  num_sick = ?",
            [req.body.num_sick],
            (err, pre) => {
              console.log(err);
              if(err) {
                return res.send('error'); 
              }else{
                db.query("delete from sicknote where num_sick =? ",[req.body.num_sick],
                (err,pp)=> {
                  if(err) {
                    console.log("error", err);
                  }else{
                    fs.unlink("Ordonnance"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf", function(err){
                      if(err) throw err;
                    });
                    return res.send('succes'); 
                  }
                });
              }
            }
            );
        }
      }
      );
    });    
  }
  
    //--- DELETE ORIENTATION ---//
  exports.postdeleteOrientation = (req,res,next) => {
    pool.getConnection(function(err,db){
      db.query("delete from resulltexamorientation where num_or = ? ",[req.body.num_or],
      (err, result1) => {
        console.log(err);
        if(err) {
          return res.send('error'); 
        }else{
          db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date FROM orientation WHERE  num_or = ?",
          [req.body.num_or],
          (err, pre) => {
            console.log(err);
            if(err) {
              return res.send('error'); 
            }else{
              db.query("delete from orientation where num_or =? ",[req.body.num_or],
              (err,tt)=> {
                if(err) {
                  console.log("error", err);
                }else{
                  fs.unlink("Orientation"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf", function(err){
                    if(err) throw err;
                  });
                }
              });
              return res.send('succes');
            }
          }
          );
        }
      }
      ); 
    }); 
    
  }
  
    //--- DELETE BILAN ---//
  exports.postdeleteBilan = (req,res,next) => {
    pool.getConnection(function(err,db) {
      db.query("delete from resultexam where num_ch =? ",[req.body.num_ch],
      (err, result1) => {
        console.log(err);
        if(err) {
          return res.send('error'); 
        }else{
         db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date FROM medical_checkup WHERE  num_ch = ?",
          [req.body.num_ch],
          (err, pre) => {
            console.log(err);
            if(err) {
              return res.send('error'); 
            }else{
             db.query("delete from medical_checkup where num_ch =? ",[req.body.num_ch],
              (err,r)=> {
                if(err) {
                  console.log("error", err);
                }else{
                  fs.unlink("Bilan"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf", function(err){
                    if(err) throw err;
                  });
                }
              });
              return res.send('succes');
            }
          }
          );
        }
      }
      );
    });   
  }
  
    //--- DELETE EVACUATION ---//
  exports.postdeleteEvacuation = (req,res,next) => {
    pool.getConnection(function(err, connection) {
      connection.query("SELECT *,DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date FROM evacuation WHERE  num_ev = ?",
      [req.body.num_ev],
      (err,pre)=> {
        if(err) {
          console.log("error", err);
        }else{
          connection.query("delete from evacuation where num_ev =? ",[req.body.num_ev],
          (err, result1) => {
            console.log(err);
            if(err) {
              return res.send('error'); 
            }else{
              fs.unlink("Evacuation"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf", function(err){
                if(err) throw err;
              });
              return res.send('succes');
            }
          }
          );
        }
      });
    });
  }
  
    //--- DELETE CERTIFICARCAT ---//
  exports.postdeleteCertificat = (req,re,next) => {
    pool.getConnection(function(err,db) {
      db.query("select * from prescription where num_pre =? ",[req.body.num_pre],
      (err, pre) => {
        console.log(err);
        if(err) {
          console.log('error'); 
        }else{
          if(pre[0].type_prescription === 'repos'){
            db.query("delete from rest where num_pre =? ",[req.body.num_pre],
              (err, res) => {
                console.log(err);
                if(err) {
                  console.log('error'); 
                }else{
                  pool.getConnection(function(err, connection) {
                    connection.query("delete from prescription where num_pre =? ",[req.body.num_pre],
                    (err, res) => {
                      console.log(err);
                      if(err) {
                        console.log('error'); 
                      }else{
                        fs.unlink("Certificat_repos"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf", function(err){
                          if(err) throw err;
                        });
                        re.send('succes');
                      }
                    }
                    );
                  });
                }
              }
              );
          } else{
            db.query("delete from practice where num_pre =? ",[req.body.num_pre],
              (err, res) => {
                console.log(err);
                if(err) {
                  console.log('error'); 
                }else{
                  db.query("delete from prescription where num_pre =? ",[req.body.num_pre],
                  (err, res) => {
                    console.log(err);
                    if(err) {
                      console.log('error'); 
                    }else{
                      fs.unlink("Certificat_pratique"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf", function(err){
                        if(err) throw err;
                      });
                      re.send('succes');
                    }
                  }
                  );
                }
              }
              );
            
          }
        }
      }
      );
    })
   
  }
  
  exports.postdataSicknote = (req,res,next) => {
    console.log(req.body.num_sick);
    pool.getConnection(function(err, connection) {
      connection.query("SELECT * FROM containsdrug inner join sicknote on containsdrug.num_sick = sicknote.num_sick WHERE containsdrug.num_sick = ? ",
      [req.body.num_sick],
      (err,data)=> {
        if(err) {
          console.log("error", err);
        }else{
          var name_drug = [];
          var posologie = [];
          var duration= [];
  
          for (var i = 0; i < data.length; i++) {
            name_drug[i] = data[i].name_drug;
            posologie[i] = data[i].posologie;
            duration[i] = data[i].duration;
          }
          return  res.send({ 
            name_drug :name_drug,
            posologie :posologie,
            duration :duration,
            taille : data.length,
          }) ;
        }
      });
    });  
  }
  
  exports.postdataBilan = (req,res,next) => {

    pool.getConnection(function(err, connection) {
      connection.query("SELECT * FROM resultexam inner join medical_checkup on resultexam.num_ch = medical_checkup.num_ch WHERE  resultexam.num_ch = ? ",
      [req.body.num_ch],
      (err,data)=> {
        if(err) {
          console.log("error", err);
        }else{
          var name_exam = [];
          var result = [];
  
          for (var i = 0; i < data.length; i++) {
            name_exam[i] = data[i].name_exam;
            result[i] = data[i].result;
          }
          return  res.send({ 
            consultation:data[0].consultation,
            conclusion:data[0].conclusion,
            name_exam :name_exam,
            result :result,
            taille : data.length,
          }) ;
        }
      });
    });
  }
  
  exports.postdataOrientation = (req,res,next) => { 
    pool.getConnection(function(err, connection) {
      connection.query("SELECT * FROM resulltexamorientation inner join orientation on resulltexamorientation.num_or = orientation.num_or WHERE resulltexamorientation.num_or = ? ",
      [req.body.num_or],
      (err,data)=> {
        if(err) {
          console.log("error", err);
        }else{
          var name_exam = [];
  
          for (var i = 0; i < data.length; i++) {
            name_exam[i] = data[i].name_exam;
          }
          return  res.send({ 
            name_orientation:data[0].name_orientation,
            antecedent:data[0].antecedent,
            signe:data[0].signe,
            name_exam :name_exam,
            taille : data.length,
          }) ;
        }
      });
    });
  }
  
  exports.postdataEvacuation = (req,res,next) => { 
    pool.getConnection(function(err, connection) {
      connection.query("SELECT * FROM evacuation WHERE num_ev = ? ",
      [req.body.num_ev],
      (err,data)=> {
        if(err) {
          console.log("error", err);
        }else{
          return  res.send({ 
            cause_evacuation:data[0].cause_evacuation,
            place_evacuation:data[0].place_evacuation,
            hospital:data[0].hospital,
            duration_evacuation:data[0].duration_evacuation,
          }) ;
        }
      });
    });
  }
  
  exports.postdataCertificat = (req,res,next) => { 
    console.log(req.body.num_pre);
    pool.getConnection(function(err,db) {
      db.query("SELECT * FROM prescription WHERE  num_pre = ?",
      [req.body.num_pre],
      (err,pre)=> {
        if(err) {
          console.log("error", err);
        }else{
          if(pre[0].type_prescription === 'repos'){
            db.query("SELECT nb_day,destination_rest,DATE_FORMAT(date_start_rest,'%Y-%m-%d') as start ,DATE_FORMAT(date_end_rest,'%Y-%m-%d') as end FROM rest WHERE num_pre = ?",
              [req.body.num_pre],
              (err,data)=> {
                if(err) {
                  console.log("error", err);
                }else{
                  return  res.send({ 
                    name_prescription:pre[0].name_prescription,
                    nb_day:data[0].nb_day,
                    date_start_rest:data[0].start,
                    date_end_rest:data[0].end,
                    destination_rest:data[0].destination_rest,
                    type_prescription:pre[0].type_prescription,
                  });
                }
              });
          }
          if(pre[0].type_prescription === 'pratique'){
            db.query("SELECT * FROM practice WHERE num_pre = ?",
              [req.body.num_pre],
              (err,data)=> {
                if(err) {
                  console.log("error", err);
                }else{
                  return  res.send({ 
                    name_prescription:pre[0].name_prescription,
                    cause_practice:data[0].cause_practice,
                    destination_rest:data[0].destination_rest,
                    type_prescription:pre[0].type_prescription,
                  });
                }
              });

          }
        }
      });
    })
  
  }

  exports.postimprimeSicknote = (req,result,next) => {
pool.getConnection(function(err,db){
  db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date FROM sicknote WHERE  num_sick = ?",
  [req.body.num_sick],
  (err,pre)=> {
    if(err) {
      console.log("error", err);
    }else{
      open("Ordonnance"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf");
    }
  });
})
   

    /*const pdfdoc = "Ordonnance"+pre[0].date+".pdf";
    const pdfpath = path.join( pdfdoc);
    fs.readFile(pdfpath, (err, data) =>{
    if(err){
      return next(err);
    }
      result.setHeader('Content-Type', 'application/pdf');
      return result.send(data);
    });*/
  }

  exports.postimprimeBilan = (req,result,next) => {
    pool.getConnection(function(err,db) {
      db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date FROM medical_checkup WHERE  num_ch = ?",
      [req.body.num_ch],
      (err,pre)=> {
        if(err) {
          console.log("error", err);
        }else{
          open("Bilan"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf");
        }
      });
    })
 
  }

  exports.postimprimeOrientation = (req,result,next) => {
    pool.getConnection(function(err,db){
      db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date FROM orientation WHERE  num_or = ?",
      [req.body.num_or],
      (err,pre)=> {
        if(err) {
          console.log("error", err);
        }else{
          open("Orientation"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf")
        }
      });
    })
   
  }

  exports.postimprimeEvacuation = (req,result,next) => {
    pool.getConnection(function(err,db){
      db.query("SELECT *,DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date FROM evacuation WHERE  num_ev = ?",
      [req.body.num_ev],
      (err,pre)=> {
        if(err) {
          console.log("error", err);
        }else{
          open("Evacuation"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf");
        }
      });
    })
   
  }

  exports.postimprimeCertificat = (req,result,next) => {
    pool.getConnection(function(err,db) {
      db.query("SELECT DATE_FORMAT(date_medicalexam,'%Y-%m-%d') as date , type_prescription FROM prescription WHERE  num_pre = ?",
      [req.body.num_pre],
      (err,pre)=> {
        if(err) {
          console.log("error", err);
        }else{
          if(pre[0].type_prescription == 'repos'){
            open("Certificat_repos"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf");
          }
          if(pre[0].type_prescription == 'pratique'){
            open("Certificat_pratique"+pre[0].idpatient+"_"+pre[0].iduser+pre[0].date+".pdf");
          }
        }
      });
    })
  
  }
  
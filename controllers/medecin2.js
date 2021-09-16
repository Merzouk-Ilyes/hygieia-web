require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../util/db").db;
const passwordHash = require("password-hash");
const pool = require("../util/db").pool;
exports.seenotifs=  (req,res,next)=>{
    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookie = rawCookies[0].split('=')[1];
    jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
      (err,decodedToken)=> {
        pool.getConnection(function(err,connection){
            connection.query("UPDATE notification set opened = 1 where iduser = ? ",
            [decodedToken.IdUser],(err,result)=> {
                console.log('err rrr',err);
            connection.release();
                res.send({
                    'msg' : "success",
                })

            }); 
        }); 
      });
}
exports.addWork = (req,res,next)=>{

    pool.getConnection(function(err,connection){
        const rawCookies = req.headers.cookie.split('; ');
        const parsedCookie = rawCookies[0].split('=')[1];
        jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
          (err,decodedToken)=> {
              connection.query("SELECT * from doctor where iduser = ?",[decodedToken.IdUser],(err,te)=> 
              {
                  if(te.length > 0) {
                    connection.query("SELECT * FROM WORK WHERE iduser = ? and work_date = ? ",[decodedToken.IdUser,req.body.work_date],(err,result)=>{
                        if(result.length > 0) {
                            return res.send({msg: 'Cette date éxiste déja',err :true});
                        }
                        connection.query("INSERT INTO WORK (iduser,work_date,starttime,endtime) values (?,?,?,?)"
                        ,[decodedToken.IdUser,req.body.work_date,req.body.starttime+":00:00",req.body.endtime+":00:00"],
                        (err,result)=>{
                            if(err) {
                                if(err.code== 'ER_DUP_ENTRY'){
                                    res.send('exist');
                                }
                                connection.release(); 
                                console.log('error'); 
                                console.log(err);
                                return res.send({msg: 'Erreur',err :true});
                            }else {
                                return res.send({msg: 'Date ajouté avec succées',err :false});
                         
                            }
                        }
                        )    
                    }); 
                  }else {
                                        connection.query(
                        "insert into doctor values (?,?,?)  ",[decodedToken.IdUser,"",""],(err,result)=>{
                            connection.query("SELECT * FROM WORK WHERE iduser = ? and work_date = ? ",[decodedToken.IdUser,req.body.work_date],(err,result)=>{
                                if(result.length > 0) {
                                    connection.release(); 
                                    return res.send({msg: 'Cette date éxiste déja',err :true});
                                }
                                connection.query("INSERT INTO WORK (iduser,work_date,starttime,endtime) values (?,?,?,?)"
                                ,[decodedToken.IdUser,req.body.work_date,req.body.starttime+":00:00",req.body.endtime+":00:00"],
                                (err,result)=>{
                                    if(err) {
                                        if(err.code== 'ER_DUP_ENTRY'){
                                            res.send('exist');
                                        }
                                        connection.release(); 
                                        console.log('error'); 
                                        console.log(err);
                                        return res.send({msg: 'Erreur',err :true});
                                    }else {
                                        return res.send({msg: 'Date ajouté avec succées',err :false});
                                 
                                    }
                                }
                                )    
                            }); 

                                        });

                  }
              })
             
               
          });
      
    })
}
exports.deleteWork = (req,res,next)=>{
    pool.getConnection(function(err,connection){
        const rawCookies = req.headers.cookie.split('; ');
        const parsedCookie = rawCookies[0].split('=')[1];
        jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
          (err,decodedToken)=> {
            connection.query("DELETE FROM WORK where iduser = ? and work_date = ?"
            ,[decodedToken.IdUser,req.body.work_date],
            (err,result)=>{
                if(err) {
  
                    console.log('error'); 
                    console.log(err);
                    return res.send({msg: 'Erreur',err :true});
                }else {
                    return res.send({msg: 'Date supprimé avec succées',err :false});
                }
            });

          }); 

    }) 
}
exports.changePassword  = (req,res,next) => {
    pool.getConnection(function(err,connection){
        const rawCookies = req.headers.cookie.split('; ');
        const parsedCookie = rawCookies[0].split('=')[1];
        jwt.verify(parsedCookie, process.env.JWT_SECRET_CODE,
          (err,decodedToken)=> {
              connection.query("select * from Account where Email = ?",
              [decodedToken.email],(err,result)=>{
                  console.log(decodedToken);
                  console.log(req.body);
                  console.log("re",result);
                let equal = passwordHash.verify(req.body.password1,result[0].Password,);
                console.log(equal);
                if(equal){
               connection.query("UPDATE ACCOUNT SET PASSOWRD = ? WHERE Email = ?",[
                passwordHash.generate(req.body.password2),
                decodedToken.Email,
               ],(err,result)=>{
                   connection.release();
                   return res.send({msg: 'Mot de passe changé avec succées',err :false});
               })
                }else {
               
                 return res.send({msg: 'Mot de passe incorrect',err :true});

                 
                }
              })
    

          }); 

    })   
}
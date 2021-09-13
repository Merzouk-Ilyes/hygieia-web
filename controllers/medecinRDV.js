const pool = require("../util/db").pool;
const jwt = require("jsonwebtoken");
process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

exports.getRDVindividuel = (req, res, next) => {
  console.log("get rdv individuel");
  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of get request");
      pool.getConnection(function (err, connection) {
        connection.query(
          "SELECT *, date_format(date(date_rdv), '%d-%m-%Y') as date1, date_format(date(date_rdv), '%d-%m-%Y') as date2, date_format(date(date_rdv), '%Y-%m-%d') as date4, time(date_rdv) as hours, TIME(STR_TO_DATE(DATE_ADD(date_rdv, INTERVAL 20 MINUTE), '%Y-%m-%d %H:%i:%s')) as max, date_format(date(date_rdv), '%d/%m/%Y') as displayeddate FROM rdv inner join patient inner join users ON rdv.iduser = users.IdUser AND rdv.idpatient = patient.IdPatient WHERE patient.IdPatient =? AND users.IdUser = ?",
          [req.query.id, decodedToken.IdUser],
          (err, result) => {
            if (err) {
              console.log("error", err);
            } else {
              connection.query(
                "SELECT *, DATE_FORMAT(Birthday, '%d/%m/%Y') as birth FROM patient WHERE IdPatient =?",
                [req.query.id],
                (err, result2) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.render("RDV/rdvPatient", {
                      rdvind: result,
                      studinfo: result2,
                      first:decodedToken.firstname
                    });
                    connection.release();
                  }
                }
              );
            }
          }
        );
      });
    }
  );
};

exports.getRDV = (req, res, next) => {
  //add 0 if date<10
  var today = new Date();
  today.setDate(today.getDate());
  var todayrdv =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  console.log(todayrdv);
  const token = req.cookies.jwt;
  jwt.verify(token, process.env.JWT_SECRET_CODE, (err, decodedToken) => {
    if (err) {
      console.log("error=>", err);
      return res.status(404).send("ERROR");
    } else {
      console.log("token=>", decodedToken.firstname);
      pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM patient", (err, result) => {
          if (err) {
            console.log("error", err);
          } else {
            connection.query(
              "SELECT *, DATE_FORMAT(DATE(date_rdv), '%d/%m/%Y') as date, DATE_FORMAT(DATE(date_rdv), '%Y-%m-%d') as daatee, time(date_rdv) as min FROM users inner join rdv inner join patient inner join student ON patient.IdPatient = student.idpatient AND rdv.iduser = users.IdUser AND rdv.idpatient = patient.IdPatient WHERE DATE_FORMAT(DATE(date_rdv), '%Y-%m-%d')=?",
              [todayrdv],
              (err, result2) => {
                if (err) {
                  console.log("error", err);
                } else {
                  // console.log("studinfo=>" ,result )
                  // console.log("rdvdata=>" ,result2 )

                  res.render("RDV/rdv", {
                    studinfo: result,
                    rdvdata: result2,
                    first: decodedToken.firstname,
                  });
                }
              }
            );
          }
        });
      });
    }
  });
};

exports.getRdvData = (req, res, next) => {
  pool.getConnection(function (err, connection) {
    connection.query(
      "select * from rdv inner join patient on rdv.idpatient = patient.IdPatient;",
      (err, result) => {
        if (err) {
          console.log("error", err);
        } else {
          // console.log("YOUR DATA =>>" , result[0].p_Firstname);
          let data = [];
          result.forEach((rdv) => {
            let obj = {};
            obj = {
              id: Math.random(),
              start: rdv.date_rdv,
              end: rdv.date_rdv,
              title: rdv.Email || rdv.p_Firstname,
              description: rdv.description_rdv,
              color: "#26c57d",
            };
            data.push(obj);
          });

          // console.log("data=>", data);
          res.send(data);
        }
      }
    );
  });
};

function deleteRDV(req, res, next, id_medecin, id_patient, db_date) {
  pool.getConnection(function (err, connection) {
    connection.query(
      "UPDATE rdv SET deleted_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv=?",
      [1, id_medecin, id_patient, db_date],
      (err, res10) => {
        if (err) {
          console.log(err);
          res.json({
            message: "error",
          });
        } else {
          console.log("deleted");
        }
      }
    );
  });
}
exports.postRDV = (req, res, next) => {
  console.log("You are officially in the post RDV");

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        var rdv_date = req.body.rdv_date;
        var rdv_date2 = new Date(rdv_date);

        let today = new Date();
        let monthh = today.getMonth() + 1;
        let month2 = rdv_date2.getMonth() + 1;
        let year = today.getFullYear();
        let date = today.getDate();

        let hours1 =
          " " +
          ("0" + today.getHours()).slice(-2) +
          ":" +
          ("0" + today.getMinutes()).slice(-2) +
          ":00";
        let hours2 =
          " " +
          ("0" + rdv_date2.getHours()).slice(-2) +
          ":" +
          ("0" + rdv_date2.getMinutes()).slice(-2) +
          ":00";

        console.log(hours1);
        console.log(hours2);
        let db_date =
          today.getFullYear() +
          "-" +
          ("0" + (today.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + today.getDate()).slice(-2) +
          hours1;
        let rdv_date3 =
          rdv_date2.getFullYear() +
          "-" +
          ("0" + (rdv_date2.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + rdv_date2.getDate()).slice(-2) +
          hours2;
        // console.log("db-date ", db_date);
        // console.log("db-rdv_date3 ", rdv_date3);

        //check if date passed
        /* if(rdv_date3 <= db_date){
        console.log('Vous ne pouvez pas programmé un rendez-vous avec une date déjà passé !');
      }else{ */
        //check if it's a personal or promo rdv
        console.log(db_date);
        if (rdv_date3 < db_date) {
          console.log("date déjà passée !");
          res.json({
            message: "error",
            error: "Veuillez réessayer ultérieurement .",
          });
        } else {
          //check date/hour availability
          connection.query(
            "SELECT *,  STR_TO_DATE(DATE_ADD(date_rdv, INTERVAL 20 MINUTE), '%Y-%m-%d %H:%i:%s') as date_fin FROM rdv WHERE iduser =? AND STR_TO_DATE(date_rdv, '%Y-%m-%d %H:%i:%s') <= ? AND STR_TO_DATE(DATE_ADD(date_rdv, INTERVAL 20 MINUTE), '%Y-%m-%d %H:%i:%s') >= ? ",
            [decodedToken.IdUser, rdv_date3, rdv_date3],
            (err, res1) => {
              if (err) {
                res.json({
                  message: "error",
                  error: "Veuillez réessayer ultérieurement .",
                });
                console.log(rdv_date3);
                console.log("error select rdv + date fin rdv perso");
              } else {
                console.log("selected rdv + date fin rdv perso");
                console.log(res1);

                if (res1 == "" || res1[0].deleted_rdv == 1) {
                  console.log("date available");

                  //check the doctor's worktime
                  var acc_rdv = new Date(rdv_date);
                  console.log(acc_rdv, "converted date");
                  let day = acc_rdv.getDay();
                  console.log("day = ", day);
                  var weekday = new Array(7);
                  weekday[0] = "dimanche";
                  weekday[1] = "lundi";
                  weekday[2] = "mardi";
                  weekday[3] = "mercredi";
                  weekday[4] = "jeudi";
                  weekday[5] = "vendredi";
                  weekday[6] = "samedi";

                  var day_conv = weekday[day];
                  console.log(day_conv, "converted date to days");

                  connection.query(
                    "SELECT * FROM work WHERE iduser = ? and work_date = ?",
                    [decodedToken.IdUser, day_conv],
                    (err, res2) => {
                      if (err) {
                        console.log("error");
                        res.json({
                          message: "error",
                          error: "Veuillez réessayer ultérieurement .",
                        });
                      } else {
                        console.log("medecin worktime selected");

                        if (res2 == "") {
                          res.json({
                            message: "error",
                            error: "Vous n'êtes pas disponible cette journée",
                          });
                          console.log(
                            "Vous n'êtes pas disponible cette journée"
                          ); //render
                        } else {
                          // dealing with working time hours
                          console.log(acc_rdv);
                          let hour_rdv = acc_rdv.toLocaleTimeString("it-IT");

                          if (
                            hour_rdv < res2[0].starttime ||
                            hour_rdv > res2[0].endtime
                          ) {
                            res.json({
                              message: "error",
                              error: "Vous ne travaillez pas en ces heures !",
                            });

                            console.log(
                              "Vous ne travaillez pas en ces heures, veuillez selectionner une autre heure"
                            ); //rennder
                          } else {
                            //insert RDV
                            console.log("insert RDV individuel can start");

                            connection.query(
                              "SELECT * from patient WHERE Email = ?",
                              [req.body.rdv_patient],
                              (err, res3) => {
                                if (err) {
                                  console.log("error");
                                } else {
                                  console.log("patient selected");
                                  console.log(req.body.rdv_patient);
                                  if (res3 == "") {
                                    console.log("Cette étudiant n'existe pas");
                                    res.json({
                                      message: "error",
                                      error: "Cette étudiant n'existe pas",
                                    });
                                  } else {
                                    connection.query(
                                      "INSERT INTO rdv (iduser,idpatient,date_rdv,description_rdv,situation_rdv,type_rdv, created_by) VALUES (?,?,?,?,?,?,?)",
                                      [
                                        decodedToken.IdUser,
                                        res3[0].IdPatient,
                                        rdv_date3,
                                        req.body.rdv_description,
                                        11,
                                        "individuel",
                                        "medecin",
                                      ],
                                      (err, res4) => {
                                        if (err) {
                                          console.log("Error RDV insert", err);
                                        } else {
                                          console.log(
                                            "Votre rendez-vous a été programmé avec succès!"
                                          );
                                          var desc =
                                            " Vous avez un rendez-vous programmé le " +
                                            rdv_date3;

                                          connection.query(
                                            "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                                            [
                                              decodedToken.IdUser,
                                              res3[0].IdPatient,
                                              db_date,
                                              "Rendez-vous programmé",
                                              desc,
                                              "medecin",
                                            ],
                                            (err, res5) => {
                                              if (err) {
                                                console.log("Error : ", err);
                                              } else {
                                                console.log("notif done!");
                                                res.json({
                                                  message: "done",
                                                });
                                                connection.release();
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
                          }
                        }
                      }
                    }
                  );
                } else {
                  //date none available
                  res.json({
                    message: "error",
                    error:
                      "Cette heure est déjà prise, veuillez selectionner une autre date.",
                  });
                  console.log(
                    "cette heure est déjà prise, veuillez selectionner une autre date"
                  ); //render
                }
              }
            }
          );
        }
      });
    }
  );
};
//cas 11
exports.makeCas11 = (req, res, next) => {
  console.log("make cas 11");

  var radioValue = req.body.cas11;
  console.log(radioValue);
  console.log(req.body.patient11);
  console.log(req.body.date11);
  var today = new Date(req.body.date11);
  let hours1 =
    " " +
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":00";
  var db_date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2) +
    hours1;
  console.log(db_date);
  var datee =
    today.getFullYear() +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2) +
    hours1;

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of hrdv");
      pool.getConnection(function (err, connection) {
        console.log("radioValue", radioValue);
        if (radioValue == "done") {
          var expdone = req.body.cas11notreq;
          console.log(expdone);

          connection.query(
            "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
            [24, decodedToken.IdUser, req.body.patient11, db_date],
            (err, res1) => {
              if (err) {
                console.log("error update", err);
              } else {
                console.log("updated");
                if (expdone == "") {
                  res.json({
                    message: "updated",
                  });
                } else {
                  console.log("insert reason also");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [decodedToken.IdUser, req.body.patient11, db_date, expdone],
                    (err, res2) => {
                      if (err) {
                        console.log("error=>", err);
                      } else {
                        res.json({
                          message: "reason inserted",
                        });
                        console.log("reason inserted");
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log("cancel");
          var expcancel = req.body.cas11req;
          if (expcancel == "") {
            res.status(200).json({
              message: "error",
            });
          } else {
            connection.query(
              "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
              [12, decodedToken.IdUser, req.body.patient11, db_date],
              (err, res1) => {
                if (err) {
                  console.log("error update", err);
                } else {
                  console.log("updated");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [
                      decodedToken.IdUser,
                      req.body.patient11,
                      db_date,
                      expcancel,
                    ],
                    (err, res2) => {
                      if (err) {
                        console.log("error", err);
                      } else {
                        console.log("reason inserted");

                        connection.query(
                          "SELECT * FROM users WHERE IdUser = ?",
                          [decodedToken.IdUser],
                          (err, res3) => {
                            if (err) {
                              console.log(err);
                            } else {
                              var desc =
                                "Un rendez-vous a été programmé le " +
                                datee +
                                " avec le Dr. " +
                                res3[0].Lastname +
                                " " +
                                res3[0].Firstname +
                                " mais a été annulé";

                              //notif
                              var acc_date = new Date();
                              connection.query(
                                "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                                [
                                  decodedToken.IdUser,
                                  req.body.patient11,
                                  acc_date,
                                  "Annulation de rendez-vous",
                                  desc,
                                  "medecin",
                                ],
                                (err, res4) => {
                                  if (err) {
                                    console.log("Error : ", err);
                                  } else {
                                    console.log("done"); //render
                                    deleteRDV(
                                      req,
                                      res,
                                      next,
                                      decodedToken.IdUser,
                                      req.body.patient11,
                                      db_date
                                    );
                                    res.json({
                                      message: "done",
                                    });
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
          }
        }
      });
    }
  );
};

//cas 14
exports.makeCas14 = (req, res, next) => {
  console.log("make cas 14");
  var radioValue = req.body.cas14;
  console.log(radioValue);
  console.log(req.body.date14);
  var today = new Date(req.body.date14);
  let hours1 =
    " " +
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":00";
  var db_date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2) +
    hours1;
  console.log(db_date);
  var datee =
    today.getFullYear() +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2) +
    hours1;

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        if (radioValue == "done") {
          var expdone = req.body.cas14notreq;
          console.log("hedi expdone", expdone);

          connection.query(
            "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
            [24, decodedToken.IdUser, req.body.patient14, db_date],
            (err, res1) => {
              if (err) {
                console.log("error update", err);
              } else {
                console.log("updated");
                if (expdone == "") {
                  res.json({
                    message: "updated",
                  });
                } else {
                  console.log("insert reason also");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [decodedToken.IdUser, req.body.patient14, db_date, expdone],
                    (err, res2) => {
                      if (err) {
                        console.log("error", err);
                      } else {
                        console.log("reason inserted");
                        res.json({
                          message: "reason inserted",
                        });
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log("cancel");
          var expcancel = req.body.cas14req;
          if (expcancel == "") {
            res.status(200).json({
              message: "error",
            });
          } else {
            connection.query(
              "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
              [16, decodedToken.IdUser, req.body.patient14, db_date],
              (err, res1) => {
                if (err) {
                  console.log("error update", err);
                } else {
                  console.log("updated");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [
                      decodedToken.IdUser,
                      req.body.patient14,
                      db_date,
                      expcancel,
                    ],
                    (err, res2) => {
                      if (err) {
                        console.log("error", err);
                      } else {
                        console.log("reason inserted");

                        var desc =
                          "Le rendez-vous que vous avez confirmé le " +
                          datee +
                          " a été annulé.";

                        //notif
                        var acc_date = new Date();
                        connection.query(
                          "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                          [
                            decodedToken.IdUser,
                            req.body.patient14,
                            acc_date,
                            "Annulation de rendez-vous",
                            desc,
                            "medecin",
                          ],
                          (err, res4) => {
                            if (err) {
                              console.log("Error : ", err);
                            } else {
                              console.log("done!");

                              deleteRDV(
                                req,
                                res,
                                next,
                                decodedToken.IdUser,
                                req.body.patient14,
                                db_date
                              );
                              res.json({
                                message: "done",
                              });
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
      });
    }
  );
};

//cas 18
exports.makeCas18 = (req, res, next) => {
  console.log("make cas 18");
  var radioValue = req.body.cas18;
  console.log(radioValue);
  console.log(req.body.patient18);
  console.log(req.body.date18);
  var today = new Date(req.body.date18);
  let hours1 =
    " " +
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":00";
  var db_date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2) +
    hours1;
  console.log(db_date);
  var datee =
    today.getFullYear() +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2) +
    hours1;

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        if (radioValue == "done") {
          var expdone = req.body.cas18notreq;
          console.log("hedi expdone", expdone);

          connection.query(
            "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
            [24, decodedToken.IdUser, req.body.patient18, db_date],
            (err, res1) => {
              if (err) {
                console.log("error update", err);
                res.json({
                  message: "error",
                });
              } else {
                if (expdone == "") {
                  res.json({
                    message: "updated",
                  });
                } else {
                  console.log("insert reason also");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [decodedToken.IdUser, req.body.patient18, db_date, expdone],
                    (err, res2) => {
                      if (err) {
                        console.log("error", err);
                        res.json({
                          message: "error",
                        });
                      } else {
                        console.log("reason inserted");
                        res.json({
                          message: "reason inserted",
                        });
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log("cancel");
          var expcancel = req.body.cas18req;
          console.log("expcancel=>>>", expcancel);
          if (expcancel == "") {
            res.status(200).json({
              message: "error",
            });
          } else {
            connection.query(
              "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
              [21, decodedToken.IdUser, req.body.patient18, db_date],
              (err, res1) => {
                if (err) {
                  console.log("error update", err);
                  res.status(200).json({
                    message: "error",
                  });
                } else {
                  console.log("updated");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [
                      decodedToken.IdUser,
                      req.body.patient18,
                      db_date,
                      expcancel,
                    ],
                    (err, res2) => {
                      if (err) {
                        console.log("error", err);
                        res.status(200).json({
                          message: "error",
                        });
                      } else {
                        console.log("reason inserted");

                        connection.query(
                          "SELECT * FROM patient WHERE IdPatient = ?",
                          [req.body.patient18],
                          (err, res3) => {
                            if (err) {
                              console.log("error", err);
                              res.status(200).json({
                                message: "error",
                              });
                            } else {
                              console.log("patient selected");
                              var desc =
                                "Le patient " +
                                res3[0].p_Lastname +
                                " " +
                                res3[0].p_Firstname +
                                " a annulé le rendez-vous reprogrammé.";

                              //notif
                              var acc_date = new Date();
                              connection.query(
                                "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                                [
                                  decodedToken.IdUser,
                                  req.body.patient18,
                                  acc_date,
                                  "Annulation du rendez-vous reprogrammé",
                                  desc,
                                  "medecin",
                                ],
                                (err, res4) => {
                                  if (err) {
                                    console.log("Error : ", err);
                                  } else {
                                    console.log("done!");

                                    deleteRDV(
                                      req,
                                      res,
                                      next,
                                      decodedToken.IdUser,
                                      req.body.patient18,
                                      db_date
                                    );
                                    res.json({
                                      message: "done",
                                    });
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
          }
        }
      });
    }
  );
};
//cas 19
exports.makeCas19 = (req, res, next) => {
  console.log("make cas 19");
  var radioValue = req.body.cas19;
  console.log(radioValue);
  console.log(req.body.patient19);
  console.log(req.body.date19);
  var today = new Date(req.body.date19);
  let hours1 =
    " " +
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":00";
  var db_date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2) +
    hours1;
  console.log(db_date);
  var datee =
    today.getFullYear() +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2) +
    hours1;

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        if (radioValue == "done") {
          var expdone = req.body.cas19notreq;
          console.log("hedi expdone", expdone);

          connection.query(
            "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
            [24, decodedToken.IdUser, req.body.patient19, db_date],
            (err, res1) => {
              if (err) {
                console.log("error update", err);
                res.json({
                  message: "error",
                });
              } else {
                console.log("updated");
                if (expdone == "") {
                  res.json({
                    message: "updated",
                  });
                } else {
                  console.log("insert reason also");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [decodedToken.IdUser, req.body.patient19, db_date, expdone],
                    (err, res2) => {
                      if (err) {
                        res.json({
                          message: "error",
                        });
                        console.log("error", err);
                      } else {
                        res.json({
                          message: "reason inserted",
                        });
                        console.log("reason inserted");
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log("cancel");
          var expcancel = req.body.cas19req;
          console.log("expcancel---->", expcancel);
          if (expcancel == "") {
            res.status(200).json({
              message: "error",
            });
          } else {
            connection.query(
              "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
              [21, decodedToken.IdUser, req.body.patient19, db_date],
              (err, res1) => {
                if (err) {
                  res.json({
                    message: "error",
                  });
                  console.log("error update", err);
                } else {
                  console.log("updated");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [
                      decodedToken.IdUser,
                      req.body.patient19,
                      db_date,
                      expcancel,
                    ],
                    (err, res2) => {
                      if (err) {
                        console.log("error", err);
                        res.json({
                          message: "error",
                        });
                      } else {
                        console.log("reason inserted");

                        var desc =
                          "Le rendez-vous reprogrammé le " +
                          datee +
                          " a été annulé.";

                        //notif
                        var acc_date = new Date();
                        connection.query(
                          "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                          [
                            decodedToken.IdUser,
                            req.body.patient19,
                            acc_date,
                            "Annulation de rendez-vous",
                            desc,
                            "medecin",
                          ],
                          (err, res4) => {
                            if (err) {
                              console.log("Error : ", err);
                            } else {
                              console.log("canceled!");
                              res.json({
                                message: "done",
                              });
                              deleteRDV(
                                req,
                                res,
                                next,
                                decodedToken.IdUser,
                                req.body.patient19,
                                db_date
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
          }
        }
      });
    }
  );
};

//cas 3
exports.makeCas3 = (req, res, next) => {
  console.log("make cas 3");
  var radioValue = req.body.cas3;
  console.log(radioValue);
  console.log(req.body.patient3);
  console.log(req.body.date3);
  var today = new Date(req.body.date3);
  let hours1 =
    " " +
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":00";
  var db_date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2) +
    hours1;
  console.log(db_date);
  var datee =
    today.getFullYear() +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2) +
    hours1;

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        if (radioValue == "done") {
          var expdone = req.body.cas3notreq;
          console.log("hedi expdone", expdone);

          connection.query(
            "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
            [24, decodedToken.IdUser, req.body.patient3, db_date],
            (err, res1) => {
              if (err) {
                console.log("error update", err);
                res.json({
                  message: "error",
                });
              } else {
                console.log("updated");
                if (expdone == "") {
                  res.json({
                    message: "updated",
                  });
                } else {
                  console.log("insert reason also");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [decodedToken.IdUser, req.body.patient3, db_date, expdone],
                    (err, res2) => {
                      if (err) {
                        console.log("error", err);
                        res.json({
                          message: "error",
                        });
                      } else {
                        res.json({
                          message: "reason inserted",
                        });
                        console.log("reason inserted");
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log("cancel");
          var expcancel = req.body.cas3req;
          if (expcancel == "") {
            res.status(200).json({
              message: "error",
            });
          } else {
            connection.query(
              "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
              [4, decodedToken.IdUser, req.body.patient3, db_date],
              (err, res1) => {
                if (err) {
                  console.log("error update", err);
                  res.json({
                    message: "error",
                  });
                } else {
                  console.log("updated");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [
                      decodedToken.IdUser,
                      req.body.patient3,
                      db_date,
                      expcancel,
                    ],
                    (err, res2) => {
                      if (err) {
                        console.log("error", err);
                        res.json({
                          message: "error",
                        });
                      } else {
                        console.log("reason inserted");

                        var desc =
                          "Votre rendez-vous confirmé du " +
                          datee +
                          " a été malheureusement annulé.";

                        //notif
                        var acc_date = new Date();
                        connection.query(
                          "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                          [
                            decodedToken.IdUser,
                            req.body.patient3,
                            acc_date,
                            "Rendez-vous annulé",
                            desc,
                            "medecin",
                          ],
                          (err, res4) => {
                            if (err) {
                              console.log("Error : ", err);
                              res.json({
                                message: "error",
                              });
                            } else {
                              console.log("done!");
                              res.json({
                                message: "done",
                              }); //render
                              deleteRDV(
                                req,
                                res,
                                next,
                                decodedToken.IdUser,
                                req.body.patient3,
                                db_date
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
          }
        }
      });
    }
  );
};

//cas 6
exports.makeCas6 = (req, res, next) => {
  console.log("make cas 6");
  var radioValue = req.body.cas6;
  console.log(radioValue);
  console.log(req.body.patient6);
  console.log(req.body.date6);
  var today = new Date(req.body.date6);
  let hours1 =
    " " +
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":00";
  var db_date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2) +
    hours1;
  console.log(db_date);
  var datee =
    today.getFullYear() +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2) +
    hours1;

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        if (radioValue == "done") {
          var expdone = req.body.cas6notreq;
          console.log("hedi expdone", expdone);

          connection.query(
            "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
            [24, decodedToken.IdUser, req.body.patient6, db_date],
            (err, res1) => {
              if (err) {
                console.log("error update", err);
              } else {
                console.log("updated");
                if (expdone == "") {
                  res.json({
                    message: "updated",
                  });
                } else {
                  console.log("insert reason also");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [decodedToken.IdUser, req.body.patient6, db_date, expdone],
                    (err, res2) => {
                      if (err) {
                        console.log("error", err);
                        res.json({
                          message: "error",
                        });
                      } else {
                        console.log("reason inserted");
                        res.json({
                          message: "reason inserted",
                        });
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log("cancel");
          var expcancel = req.body.cas6req;
          if (expcancel == "") {
            res.status(200).json({
              message: "error",
            });
          } else {
            connection.query(
              "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
              [8, decodedToken.IdUser, req.body.patient6, db_date],
              (err, res1) => {
                if (err) {
                  res.json({
                    message: "error",
                  });
                  console.log("error update", err);
                } else {
                  console.log("updated");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [
                      decodedToken.IdUser,
                      req.body.patient6,
                      db_date,
                      expcancel,
                    ],
                    (err, res2) => {
                      if (err) {
                        res.json({
                          message: "error",
                        });
                        console.log("error", err);
                      } else {
                        console.log("reason inserted");

                        var desc =
                          "Le rendez-vous reprogrammé le " +
                          datee +
                          " a été annulé.";

                        //notif
                        var acc_date = new Date();
                        connection.query(
                          "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                          [
                            decodedToken.IdUser,
                            req.body.patient6,
                            acc_date,
                            "Annulation du rendez-vous reprogrammé",
                            desc,
                            "medecin",
                          ],
                          (err, res4) => {
                            if (err) {
                              res.json({
                                message: "error",
                              });
                              console.log("Error : ", err);
                            } else {
                              console.log("done!"); //render
                              deleteRDV(
                                req,
                                res,
                                next,
                                decodedToken.IdUser,
                                req.body.patient6,
                                db_date
                              );
                              res.json({
                                message: "done",
                              });
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
      });
    }
  );
};

//cas 7
exports.makeCas7 = (req, res, next) => {
  console.log("make cas 7");
  var radioValue = req.body.cas7;
  console.log(radioValue);
  console.log(req.body.patient7);
  console.log(req.body.date7);
  var today = new Date(req.body.date7);
  let hours1 =
    " " +
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":00";
  var db_date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2) +
    hours1;
  console.log(db_date);
  var datee =
    today.getFullYear() +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2) +
    hours1;

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        if (radioValue == "done") {
          var expdone = req.body.cas7notreq;
          console.log("hedi expdone", expdone);

          connection.query(
            "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
            [24, decodedToken.IdUser, req.body.patient7, db_date],
            (err, res1) => {
              if (err) {
                console.log("error update", err);
              } else {
                console.log("updated");
                if (expdone == "") {
                  res.json({
                    message: "updated",
                  });
                } else {
                  console.log("insert reason also");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [decodedToken.IdUser, req.body.patient7, db_date, expdone],
                    (err, res2) => {
                      if (err) {
                        res.json({
                          message: "error",
                        });
                        console.log("error", err);
                      } else {
                        res.json({
                          message: "reason inserted",
                        });
                        console.log("reason inserted");
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log("cancel");
          var expcancel = req.body.cas7req;
          if (expcancel == "") {
            res.status(200).json({
              message: "error",
            });
          } else {
            connection.query(
              "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
              [8, decodedToken.IdUser, req.body.patient7, db_date],
              (err, res1) => {
                if (err) {
                  res.json({
                    message: "error",
                  });
                  console.log("error update", err);
                } else {
                  console.log("updated");
                  connection.query(
                    "INSERT INTO reason VALUES(?,?,?,?)",
                    [
                      decodedToken.IdUser,
                      req.body.patient7,
                      db_date,
                      expcancel,
                    ],
                    (err, res2) => {
                      if (err) {
                        res.json({
                          message: "error",
                        });
                        console.log("error", err);
                      } else {
                        console.log("reason inserted");

                        var desc =
                          "Le rendez-vous reprogrammé le " +
                          datee +
                          " a été annulé.";

                        //notif
                        var acc_date = new Date();
                        connection.query(
                          "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                          [
                            decodedToken.IdUser,
                            req.body.patient7,
                            acc_date,
                            "Annulation du rendez-vous reprogrammé",
                            desc,
                            "medecin",
                          ],
                          (err, res4) => {
                            if (err) {
                              res.json({
                                message: "error",
                              });
                              console.log("Error : ", err);
                            } else {
                              console.log(
                                "Votre rendez-vous a été programmé avec succès!"
                              ); //render
                              deleteRDV(
                                req,
                                res,
                                next,
                                decodedToken.IdUser,
                                req.body.patient7,
                                db_date
                              );
                              res.json({
                                message: "done",
                              });
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
      });
    }
  );
};

//cas 0
exports.makeCas0 = (req, res, next) => {
  console.log("make cas 0");
  try {
    var radioValue = req.body.statesel;
    console.log(radioValue);
    console.log(req.body.patient0);
    console.log(req.body.date0);
    var today = new Date(req.body.date0);
    let hours1 =
      " " +
      ("0" + today.getHours()).slice(-2) +
      ":" +
      ("0" + today.getMinutes()).slice(-2) +
      ":00";
    var db_date =
      today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2) +
      hours1;
    console.log(db_date);
    var datee =
      today.getFullYear() +
      "/" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + today.getDate()).slice(-2) +
      hours1;

    const rawCookies = req.headers.cookie.split("; ");
    const parsedCookie = rawCookies[0].split("=")[1];
    jwt.verify(
      parsedCookie,
      process.env.JWT_SECRET_CODE,
      async (err, decodedToken) => {
        console.log(decodedToken, "token of rdv");
        pool.getConnection(function (err, connection) {
          if (radioValue == "accept") {
            console.log("accept case");
            var expdone = req.body.cas0notreq;
            console.log(expdone);

            connection.query(
              "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
              [3, decodedToken.IdUser, req.body.patient0, db_date],
              (err, res1) => {
                if (err) {
                  console.log("Erreur, veuillez Réessayer ultérieuement"); //res.send
                  res.json({
                    message: "error",
                    error: "Erreur, veuillez Réessayer ultérieuement",
                  });
                } else {
                  console.log("Le rendez-vous a été accepté"); //res.send
                  console.log("updated");
                  //if the notreq is filled
                  if (expdone != "") {
                    console.log("insert reason also");
                    connection.query(
                      "INSERT INTO reason VALUES(?,?,?,?)",
                      [
                        decodedToken.IdUser,
                        req.body.patient0,
                        db_date,
                        expdone,
                      ],
                      (err, res2) => {
                        if (err) {
                          console.log("error", err);
                        } else {
                          console.log("reason inserted");
                          //notif
                          var desc =
                            "Votre demande de rendez-vous le " +
                            datee +
                            " a été acceptée, le médecin sera à votre attente.";

                          var acc_date = new Date();

                          connection.query(
                            "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                            [
                              decodedToken.IdUser,
                              req.body.patient0,
                              acc_date,
                              "Demande Acceptée",
                              desc,
                              "medecin",
                            ],
                            (err, res3) => {
                              if (err) {
                                console.log("Error : ", err);
                                res.json({
                                  message: "error",
                                  error:
                                    "Erreur, veuillez Réessayer ultérieuement",
                                });
                              } else {
                                console.log("RDV accpeted!");
                                res.json({
                                  message: "rdv accepted",
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  } else {
                    //notif
                    var desc =
                      "Votre demande de rendez-vous le " +
                      datee +
                      " a été acceptée, le médecin sera à votre attente.";

                    var acc_date = new Date();

                    connection.query(
                      "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                      [
                        decodedToken.IdUser,
                        req.body.patient0,
                        acc_date,
                        "Demande Acceptée",
                        desc,
                        "medecin",
                      ],
                      (err, res3) => {
                        if (err) {
                          console.log("Error : ", err);
                          res.json({
                            message: "error",
                            error: "Erreur, veuillez Réessayer ultérieuement",
                          });
                        } else {
                          console.log("RDV accpeted!");
                          res.json({
                            message: "rdv accepted",
                          });
                        }
                      }
                    );
                  }
                }
              }
            );
          } else {
            if (radioValue == "reschedule") {
              console.log("reschedule");
              console.log("reschedule=>: ", req.body.dates);
              mot = req.body.dates;

              //getting the proposed dates from the hidden inout and putting the values in var daats
              const list = mot.split("/");
              var temp = [];
              var daats = [];
              for (i = 1; i < list.length; i++) {
                if (list[i] == "Date") {
                  console.log("skip");
                } else {
                  daats[i] = list[i];
                }
              }
              for (let i of daats) i && temp.push(i);
              daats = temp;

              //the proposed dates in a table
              console.log("daats=<> ", daats);
              if (daats.length === 0) {
                res.json({
                  message: "error",
                  error: "Proposer des dates SVP !",
                });
                return;
              }
              var converted = new Array(daats.length);

              //convertings the dates in the needed format
              for (let i = 0; i < daats.length; i++) {
                let todayy = new Date(daats[i]);
                let hours1 =
                  " " +
                  ("0" + todayy.getHours()).slice(-2) +
                  ":" +
                  ("0" + todayy.getMinutes()).slice(-2) +
                  ":00";
                converted[i] =
                  todayy.getFullYear() +
                  "-" +
                  ("0" + (todayy.getMonth() + 1)).slice(-2) +
                  "-" +
                  ("0" + todayy.getDate()).slice(-2) +
                  hours1;
              }
              //the converted proposed dates

              //now we have to check each date
              for (let i = 0; i < converted.length; i++) {
                //check date/hour availability
                connection.query(
                  "SELECT *,  STR_TO_DATE(DATE_ADD(date_rdv, INTERVAL 20 MINUTE), '%Y-%m-%d %H:%i:%s') as date_fin FROM rdv WHERE iduser =? AND STR_TO_DATE(date_rdv, '%Y-%m-%d %H:%i:%s') <= ? AND STR_TO_DATE(DATE_ADD(date_rdv, INTERVAL 20 MINUTE), '%Y-%m-%d %H:%i:%s') >= ? ",
                  [decodedToken.IdUser, converted[i], converted[i]],
                  (err, res1) => {
                    if (err) {
                      console.log("Erreur, veuillez Réessayer ultérieuement");
                      res.json({
                        message: "error",
                        error: "Erreur, veuillez Réessayer ultérieuement",
                      }); //res.send
                    } else {
                      console.log("selected rdv + date fin rdv perso");
                      console.log(res1);

                      if (res1 == "" || res1[0].deleted_rdv == 1) {
                        console.log("date available");

                        //check the doctor's worktime
                        var acc_rdv = new Date(converted[i]);
                        console.log(acc_rdv, "converted date");
                        let day = acc_rdv.getDay();
                        console.log("day = ", day);
                        var weekday = new Array(7);
                        weekday[0] = "dimanche";
                        weekday[1] = "lundi";
                        weekday[2] = "mardi";
                        weekday[3] = "mercredi";
                        weekday[4] = "jeudi";
                        weekday[5] = "vendredi";
                        weekday[6] = "samedi";

                        var day_conv = weekday[day];
                        console.log(day_conv, "converted date to days");

                        connection.query(
                          "SELECT * FROM work WHERE iduser = ? and work_date = ?",
                          [decodedToken.IdUser, day_conv],
                          (err, res2) => {
                            if (err) {
                              console.log("error");
                              res.json({
                                message: "error",
                                error:
                                  "Erreur, veuillez Réessayer ultérieuement",
                              });
                            } else {
                              console.log("medecin worktime selected");

                              if (false) {
                                console.log(
                                  "Vous n'êtes pas disponible cette journée"
                                ); //res.send
                                res.json({
                                  message: "error",
                                  error:
                                    "Vous n'êtes pas disponible cette journée",
                                });
                                return;
                              } else {
                                // dealing with working time hours
                                console.log(acc_rdv);
                                let hour_rdv =
                                  acc_rdv.toLocaleTimeString("it-IT");
                                // hour_rdv < res2[0].starttime ||
                                // hour_rdv > res2[0].endtime
                                if (false) {
                                  console.log(
                                    "Vous ne travaillez pas en ces heures"
                                  ); //res.send
                                  // res.json({
                                  //   message: "error",
                                  //   error: "Vous ne travaillez pas en ces heures",
                                  // });
                                } else {
                                  //insert RDV
                                  console.log("insert the proposed dates");
                                  connection.query(
                                    "INSERT INTO proposition VALUES(?)",
                                    [converted[i]],
                                    (err, res3) => {
                                      if (err) {
                                        console.log(err);
                                        res.json({
                                          message: "error",
                                          error:
                                            "Erreur, veuillez Réessayer ultérieuement",
                                        });
                                      } else {
                                        console.log("propositions inserted");

                                        let d1 = new Date(req.body.date0);
                                        let h1 =
                                          " " +
                                          ("0" + d1.getHours()).slice(-2) +
                                          ":" +
                                          ("0" + d1.getMinutes()).slice(-2) +
                                          ":00";
                                        let y1 =
                                          d1.getFullYear() +
                                          "-" +
                                          ("0" + (d1.getMonth() + 1)).slice(
                                            -2
                                          ) +
                                          "-" +
                                          ("0" + d1.getDate()).slice(-2) +
                                          h1;
                                        //insert in have proposition
                                        connection.query(
                                          "INSERT INTO haveproposition VALUES(?,?,?,?)",
                                          [
                                            decodedToken.IdUser,
                                            req.body.patient0,
                                            y1,
                                            converted[i],
                                          ],
                                          (err, res4) => {
                                            if (err) {
                                              console.log(err);
                                              res.json({
                                                message: "error",
                                                error:
                                                  "Erreur, veuillez Réessayer ultérieuement",
                                              });
                                            } else {
                                              console.log(
                                                "have proposition inserted"
                                              );

                                              // res.json({
                                              //   message:
                                              //     "have proposition inserted",
                                              // });
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                            }
                          }
                        );
                      } else {
                        //date none available

                        console.log(
                          "L'heure de la date " +
                            i +
                            " est déjà prise, veuillez séléctionner une autre date"
                        );
                        //res.send

                        res.json({
                          message: "error",
                          error:
                            "L'heure de la date " +
                            i +
                            " est déjà prise, veuillez séléctionner une autre date",
                        });
                      }
                    }
                  }
                );
              }
              connection.query(
                "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
                [6, decodedToken.IdUser, req.body.patient0, db_date],
                (err, res5) => {
                  if (err) {
                    console.log("Erreur, veuillez Réessayer ultérieuement");
                  } else {
                    console.log("Votre opération à été effectuée"); //res.send

                    var acc_date = new Date();
                    var desc =
                      "le médecin vous propose une reprogrammation, veuillez consulter les dates proposées.";
                    connection.query(
                      "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                      [
                        decodedToken.IdUser,
                        req.body.patient0,
                        acc_date,
                        "Proposition de reprogrammation",
                        desc,
                        "medecin",
                      ],
                      (err, res6) => {
                        if (err) {
                          console.log("Error : ", err);
                        } else {
                          console.log("done!");
                          res.json({
                            message: "done",
                          });
                        }
                      }
                    );
                  }
                }
              );
            } else {
              if (radioValue == "refuse") {
                console.log("refuse");
                var expcancel = req.body.cas0req;
                if (expcancel == "") {
                  res.json({
                    message: "error",
                    error: "Erreur, veuillez Réessayer ultérieuement",
                  });
                } else {
                  connection.query(
                    "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
                    [2, decodedToken.IdUser, req.body.patient0, db_date],
                    (err, res4) => {
                      if (err) {
                        console.log("Erreur, veuillez Réessayer ultérieuement"); //res.send
                      } else {
                        console.log("updated");
                        connection.query(
                          "INSERT INTO reason VALUES(?,?,?,?)",
                          [
                            decodedToken.IdUser,
                            req.body.patient0,
                            db_date,
                            expcancel,
                          ],
                          (err, res5) => {
                            if (err) {
                              console.log("error", err);
                              res.json({
                                message: "error",
                                error:
                                  "Erreur, veuillez Réessayer ultérieuement",
                              });
                            } else {
                              console.log("reason inserted");

                              var desc =
                                "Votre demande de rendez-vous le " +
                                datee +
                                " a été refusée.";

                              //notif
                              var acc_date = new Date();
                              connection.query(
                                "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                                [
                                  decodedToken.IdUser,
                                  req.body.patient0,
                                  acc_date,
                                  "Annulation de rendez-vous",
                                  desc,
                                  "medecin",
                                ],
                                (err, res6) => {
                                  if (err) {
                                    console.log("Error : ", err);
                                    res.json({
                                      message: "error",
                                      error:
                                        "Erreur, veuillez Réessayer ultérieuement",
                                    });
                                  } else {
                                    console.log("refused!");
                                    deleteRDV(
                                      req,
                                      res,
                                      next,
                                      decodedToken.IdUser,
                                      req.body.patient0,
                                      db_date
                                    );
                                    res.json({
                                      message: "deleted",
                                    });
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
              } else {
                if (radioValue == "mark") {
                  console.log("mark as done");
                  var expdone = req.body.cas0notreq;
                  console.log(expdone);
                  connection.query(
                    "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
                    [24, decodedToken.IdUser, req.body.patient0, db_date],
                    (err, res7) => {
                      if (err) {
                        console.log("Erreur, veuillez Réessayer ultérieuement");
                        res.json({
                          message: "error",
                          error: "Erreur, veuillez Réessayer ultérieuement",
                        }); //res.send
                      } else {
                        console.log("Ce rendez vous a été réalisé"); //res.send
                        if (expdone != "") {
                          console.log("insert reason also");
                          connection.query(
                            "INSERT INTO reason VALUES(?,?,?,?)",
                            [
                              decodedToken.IdUser,
                              req.body.patient0,
                              db_date,
                              expdone,
                            ],
                            (err, res8) => {
                              if (err) {
                                console.log("error", err);
                                res.json({
                                  message: "error",
                                  error:
                                    "Erreur, veuillez Réessayer ultérieuement",
                                });
                              } else {
                                console.log("reason inserted");
                                res.json({
                                  message: "reason inserted",
                                });
                              }
                            }
                          );
                        } else {
                          res.json({
                            message: "inserted",
                          });
                        }
                      }
                    }
                  );
                }
              }
            }
          }
        });
      }
    );
  } catch (err) {
    res.json({
      message: "error",
      error: "ER_DUP_ENTRY",
    });
  }
};

exports.getform = (req, res, next) => {
  res.render("RDV/formtest");
};

//cas 17
exports.makeCas17 = (req, res, next) => {
  console.log("make cas 17");

  var radioValue = req.body.statesel;
  console.log(radioValue);
  console.log(req.body.patient17);
  console.log(req.body.date17);
  var today = new Date(req.body.date17);
  let hours1 =
    " " +
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":00";
  var db_date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2) +
    hours1;
  console.log(db_date);
  var datee =
    today.getFullYear() +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2) +
    hours1;

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        if (radioValue == "reschedule") {
          console.log("reschedule");
          console.log(req.body.dates);
          mot = req.body.dates;

          //getting the proposed dates
          const list = mot.split("/");
          var temp = [];
          var daats = [];
          for (i = 1; i < list.length; i++) {
            if (list[i] == "Date") {
              console.log("skip");
            } else {
              daats[i] = list[i];
            }
          }
          for (let i of daats) i && temp.push(i);
          daats = temp;

          //the proposed dates
          console.log(daats);
          if (daats.length === 0) {
            res.json({
              message: "error",
              error: "Proposer des dates SVP !",
            });
            return;
          }
          var converted = new Array(daats.length);
          //convert the date
          for (let i = 0; i < daats.length; i++) {
            let todayy = new Date(daats[i]);
            let hours1 =
              " " +
              ("0" + todayy.getHours()).slice(-2) +
              ":" +
              ("0" + todayy.getMinutes()).slice(-2) +
              ":00";
            converted[i] =
              todayy.getFullYear() +
              "-" +
              ("0" + (todayy.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + todayy.getDate()).slice(-2) +
              hours1;
          }
          console.log(converted);

          for (let i = 0; i < converted.length; i++) {
            //check date/hour availability
            connection.query(
              "SELECT *,  STR_TO_DATE(DATE_ADD(date_rdv, INTERVAL 20 MINUTE), '%Y-%m-%d %H:%i:%s') as date_fin FROM rdv WHERE iduser =? AND STR_TO_DATE(date_rdv, '%Y-%m-%d %H:%i:%s') <= ? AND STR_TO_DATE(DATE_ADD(date_rdv, INTERVAL 20 MINUTE), '%Y-%m-%d %H:%i:%s') >= ? ",
              [decodedToken.IdUser, converted[i], converted[i]],
              (err, res1) => {
                if (err) {
                  console.log("Erreur, veuillez Réessayer ultérieuement");
                  res.json({
                    message: "error",
                    error: "Erreur, veuillez Réessayer ultérieuement",
                  });
                } else {
                  console.log("selected rdv + date fin rdv perso");
                  console.log(res1);

                  if (res1 == "" || res1[0].deleted_rdv == 1) {
                    console.log("date available");

                    //check the doctor's worktime
                    var acc_rdv = new Date(converted[i]);
                    console.log(acc_rdv, "converted date");
                    let day = acc_rdv.getDay();
                    console.log("day = ", day);
                    var weekday = new Array(7);
                    weekday[0] = "dimanche";
                    weekday[1] = "lundi";
                    weekday[2] = "mardi";
                    weekday[3] = "mercredi";
                    weekday[4] = "jeudi";
                    weekday[5] = "vendredi";
                    weekday[6] = "samedi";

                    var day_conv = weekday[day];
                    console.log(day_conv, "converted date to days");

                    connection.query(
                      "SELECT * FROM work WHERE iduser = ? and work_date = ?",
                      [decodedToken.IdUser, day_conv],
                      (err, res2) => {
                        if (err) {
                          console.log(
                            "Erreur, veuillez Réessayer ultérieuement"
                          ); //res.send
                          res.json({
                            message: "error",
                            error: "Erreur, veuillez Réessayer ultérieuement",
                          });
                        } else {
                          console.log("medecin worktime selected");

                          if (false) {
                            console.log(
                              "Vous n'êtes pas disponible cette journée"
                            ); //res.send
                            return;
                          } else {
                            // dealing with working time hours
                            console.log(acc_rdv);
                            let hour_rdv = acc_rdv.toLocaleTimeString("it-IT");

                            if (false) {
                              console.log(
                                "Vous ne travaillez pas en ces heures"
                              ); //res.send
                            } else {
                              //insert RDV
                              console.log("insert the proposed dates");
                              connection.query(
                                "INSERT INTO proposition VALUES(?)",
                                [converted[i]],
                                (err, res3) => {
                                  if (err) {
                                    console.log(err);
                                    res.json({
                                      message: "error",
                                      error:
                                        "Erreur, veuillez Réessayer ultérieuement",
                                    });
                                  } else {
                                    console.log("propositions inserted");

                                    let d1 = new Date(req.body.date17);
                                    let h1 =
                                      " " +
                                      ("0" + d1.getHours()).slice(-2) +
                                      ":" +
                                      ("0" + d1.getMinutes()).slice(-2) +
                                      ":00";
                                    let y1 =
                                      d1.getFullYear() +
                                      "-" +
                                      ("0" + (d1.getMonth() + 1)).slice(-2) +
                                      "-" +
                                      ("0" + d1.getDate()).slice(-2) +
                                      h1;
                                    //insert in have proposition
                                    connection.query(
                                      "INSERT INTO haveproposition VALUES(?,?,?,?)",
                                      [
                                        decodedToken.IdUser,
                                        req.body.patient17,
                                        y1,
                                        converted[i],
                                      ],
                                      (err, res4) => {
                                        if (err) {
                                          console.log(err);
                                          res.json({
                                            message: "error",
                                            error:
                                              "Erreur, veuillez Réessayer ultérieuement",
                                          });
                                        } else {
                                          console.log(
                                            "have proposition inserted"
                                          );
                                          res.json({
                                            message:
                                              "have proposition inserted",
                                          });
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        }
                      }
                    );
                  } else {
                    //date none available
                    console.log("L'heure de la date " + i + " est déjà prise"); //res.send
                  }
                }
              }
            );
          }

          connection.query(
            "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
            [18, decodedToken.IdUser, req.body.patient17, db_date],
            (err, res5) => {
              if (err) {
                console.log(err);
                res.json({
                  message: "error",
                  error: "Erreur, veuillez Réessayer ultérieuement",
                });
              } else {
                console.log("updated");

                var acc_date = new Date();
                var desc =
                  "Veuillez selectionner une date des dates proposés pour effectuer une reprogrammation";
                connection.query(
                  "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                  [
                    decodedToken.IdUser,
                    req.body.patient17,
                    acc_date,
                    "Reprogrammation du rendez-vous",
                    desc,
                    "medecin",
                  ],
                  (err, res6) => {
                    if (err) {
                      console.log("Erreur, veuillez Réessayer ultérieuement");
                      res.json({
                        message: "error",
                        error: "Erreur, veuillez Réessayer ultérieuement",
                      }); //res.send
                    } else {
                      console.log("done!");

                      console.log("les dates ont été envoyées");
                      res.json({
                        message: "done",
                      }); //res.send
                    }
                  }
                );
              }
            }
          );
        } else {
          if (radioValue == "refuse") {
            console.log("refuse");
            var expcancel = req.body.cas17req;
            if (expcancel == "") {
              res.json({
                message: "error",
                error: "explication vide!",
              });
            } else {
              connection.query(
                "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
                [21, decodedToken.IdUser, req.body.patient17, db_date],
                (err, res4) => {
                  if (err) {
                    console.log("Erreur, veuillez Réessayer ultérieuement");
                    res.json({
                      message: "error",
                      error: "Erreur, veuillez Réessayer ultérieuement",
                    }); //res.send
                  } else {
                    console.log("updated");
                    connection.query(
                      "INSERT INTO reason VALUES(?,?,?,?)",
                      [
                        decodedToken.IdUser,
                        req.body.patient17,
                        db_date,
                        expcancel,
                      ],
                      (err, res5) => {
                        if (err) {
                          console.log("error", err);
                          res.json({
                            message: "error",
                            error: "Erreur, veuillez Réessayer ultérieuement",
                          });
                        } else {
                          console.log("reason inserted");

                          var desc =
                            "Le rendez-vous reprogrammé le " +
                            datee +
                            " a été refusée.";

                          //notif
                          var acc_date = new Date();
                          connection.query(
                            "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                            [
                              decodedToken.IdUser,
                              req.body.patient17,
                              acc_date,
                              "Annulation de rendez-vous",
                              desc,
                              "medecin",
                            ],
                            (err, res6) => {
                              if (err) {
                                console.log("Error : ", err);
                                res.json({
                                  message: "error",
                                  error:
                                    "Erreur, veuillez Réessayer ultérieuement",
                                });
                              } else {
                                console.log("refused!");
                                deleteRDV(
                                  req,
                                  res,
                                  next,
                                  decodedToken.IdUser,
                                  req.body.patient17,
                                  db_date
                                );
                                console.log(
                                  "Vous avez refusé le rendez-vous !"
                                );
                                res.json({
                                  message: "refused",
                                }); //res.send
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
          } else {
            if (radioValue == "mark") {
              console.log("mark as done");
              var expdone = req.body.cas17notreq;
              connection.query(
                "UPDATE rdv SET situation_rdv = ? WHERE iduser =? AND idpatient =? AND date_rdv = ?",
                [24, decodedToken.IdUser, req.body.patient17, db_date],
                (err, res7) => {
                  if (err) {
                    console.log("Erreur, veuillez Réessayer ultérieuement");
                    res.json({
                      message: "error",
                      error: "Erreur, veuillez Réessayer ultérieuement",
                    }); //res.send
                  } else {
                    console.log("updated");
                    console.log("Ce rendez-vous a été réalisé"); //res.send
                    if (expdone == "") {
                      res.json({
                        message: "Ce rendez-vous a été réalisé",
                      });
                    } else {
                      console.log("insert reason also");
                      connection.query(
                        "INSERT INTO reason VALUES(?,?,?,?)",
                        [
                          decodedToken.IdUser,
                          req.body.patient17,
                          db_date,
                          expdone,
                        ],
                        (err, res8) => {
                          if (err) {
                            console.log(
                              "Erreur, veuillez Réessayer ultérieuement"
                            ); //res.send
                            res.json({
                              message: "error",
                              error: "Erreur, veuillez Réessayer ultérieuement",
                            });
                          } else {
                            console.log("reason inserted");
                            res.json({
                              message: "reason inserted",
                            });
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        }
      });
    }
  );
};

exports.delRow = (req, res, next) => {
  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        var med = decodedToken.IdUser;
        var pat = req.body.del_pat;
        var today = new Date(req.body.del_date);

        let hours1 =
          " " +
          ("0" + today.getHours()).slice(-2) +
          ":" +
          ("0" + today.getMinutes()).slice(-2) +
          ":00";
        var db_date =
          today.getFullYear() +
          "-" +
          ("0" + (today.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + today.getDate()).slice(-2) +
          hours1;
        console.log(db_date);

        deleteRDV(req, res, next, decodedToken.IdUser, pat, db_date);
        res.json({
          message: "done",
        });
      });
    }
  );
};

exports.postRDVind = (req, res, next) => {
  console.log("post insert");
  console.log(req.query.id);
  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookie = rawCookies[0].split("=")[1];
  jwt.verify(
    parsedCookie,
    process.env.JWT_SECRET_CODE,
    async (err, decodedToken) => {
      console.log(decodedToken, "token of rdv");
      pool.getConnection(function (err, connection) {
        var rdv_date = req.body.rdv_date;
        var rdv_date2 = new Date(rdv_date);

        let today = new Date();
        let monthh = today.getMonth() + 1;
        let month2 = rdv_date2.getMonth() + 1;
        let year = today.getFullYear();
        let date = today.getDate();

        let hours1 =
          " " +
          ("0" + today.getHours()).slice(-2) +
          ":" +
          ("0" + today.getMinutes()).slice(-2) +
          ":00";
        let hours2 =
          " " +
          ("0" + rdv_date2.getHours()).slice(-2) +
          ":" +
          ("0" + rdv_date2.getMinutes()).slice(-2) +
          ":00";

        var db_date =
          today.getFullYear() +
          "-" +
          ("0" + (today.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + today.getDate()).slice(-2) +
          hours1;

        console.log(hours1);
        console.log(hours2);
        console.log(db_date);
        let rdv_date3 =
          rdv_date2.getFullYear() +
          "-" +
          ("0" + (rdv_date2.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + rdv_date2.getDate()).slice(-2) +
          hours2;
        console.log("db-date ", db_date);
        console.log("db-rdv_date3 ", rdv_date3);

        //check date/hour availability
        connection.query(
          "SELECT *,  STR_TO_DATE(DATE_ADD(date_rdv, INTERVAL 20 MINUTE), '%Y-%m-%d %H:%i:%s') as date_fin FROM rdv WHERE iduser =? AND STR_TO_DATE(date_rdv, '%Y-%m-%d %H:%i:%s') <= ? AND STR_TO_DATE(DATE_ADD(date_rdv, INTERVAL 20 MINUTE), '%Y-%m-%d %H:%i:%s') >= ? ",
          [decodedToken.IdUser, rdv_date, rdv_date],
          (err, res1) => {
            if (err) {
              console.log("Erreur, veuillez Réessayer ultérieuement"); //res.send
              res.json({
                message: "error",
                error: " Veuillez réessayer ultérieurement .",
              });
            } else {
              console.log("selected rdv + date fin rdv perso");
              console.log(res1);

              if (res1 == "") {
                console.log("date available");

                //check the doctor's worktime
                var acc_rdv = new Date(rdv_date);
                console.log(acc_rdv, "converted date");
                let day = acc_rdv.getDay();
                console.log("day = ", day);
                var weekday = new Array(7);
                weekday[0] = "dimanche";
                weekday[1] = "lundi";
                weekday[2] = "mardi";
                weekday[3] = "mercredi";
                weekday[4] = "jeudi";
                weekday[5] = "vendredi";
                weekday[6] = "samedi";

                var day_conv = weekday[day];
                console.log(day_conv, "converted date to days");

                connection.query(
                  "SELECT * FROM work WHERE iduser = ? and work_date = ?",
                  [decodedToken.IdUser, day_conv],
                  (err, res2) => {
                    if (err) {
                      console.log("Erreur, veuillez Réessayer ultérieuement");
                      res.json({
                        message: "error",
                        error: " Veuillez réessayer ultérieurement .",
                      }); //res.send
                    } else {
                      console.log("medecin worktime selected");

                      if (res2 == "") {
                        console.log("Vous n'êtes pas disponible cette journée");
                        res.json({
                          message: "error",
                          error: "Vous n'êtes pas disponible cette journée",
                        }); //res.send
                      } else {
                        // dealing with working time hours
                        console.log(acc_rdv);
                        let hour_rdv = acc_rdv.toLocaleTimeString("it-IT");

                        if (
                          hour_rdv < res2[0].starttime ||
                          hour_rdv > res2[0].endtime
                        ) {
                          console.log(
                            "Vous ne travaillez pas en ces heures, veuillez selectionner une autre heure"
                          );
                          res.json({
                            message: "error",
                            error:
                              "Vous ne travaillez pas en ces heures, veuillez selectionner une autre heure",
                          }); //rennder
                        } else {
                          //insert RDV
                          console.log("insert RDV individuel can start");
                          console.log(req.query.id);
                          connection.query(
                            "INSERT INTO rdv (iduser,idpatient,date_rdv,description_rdv,situation_rdv,type_rdv, created_by) VALUES (?,?,?,?,?,?,?)",
                            [
                              decodedToken.IdUser,
                              req.query.id,
                              req.body.rdv_date,
                              req.body.rdv_description,
                              11,
                              "individuel",
                              "medecin",
                            ],
                            (err, res3) => {
                              if (err) {
                                console.log(
                                  "Erreur, veuillez Réessayer ultérieuement"
                                );
                                res.json({
                                  message: "error",
                                  error: " Veuillez réessayer ultérieurement .",
                                });
                                //res.send
                              } else {
                                console.log("rdv insted");
                                var date_notif = new Date(req.body.rdv_date);

                                let month1 = date_notif.getMonth() + 1;
                                let hourss =
                                  date_notif.getHours() +
                                  ":" +
                                  date_notif.getMinutes();

                                connection.query(
                                  "SELECT * FROM users WHERE IdUser = ?",
                                  [decodedToken.IdUser],
                                  (err, res4) => {
                                    if (err) {
                                      console.log(
                                        "Erreur, veuillez Réessayer ultérieuement"
                                      ); //res.send
                                      res.json({
                                        message: "error",
                                        error:
                                          " Veuillez réessayer ultérieurement .",
                                      });
                                    } else {
                                      console.log("selected");
                                      var displayd =
                                        date_notif.getDate() +
                                        "/" +
                                        month1 +
                                        "/" +
                                        date_notif.getFullYear() +
                                        " " +
                                        hourss;
                                      var nom_med =
                                        " Dr. " +
                                        res4[0].Lastname +
                                        " " +
                                        res4[0].Firstname;
                                      var insert_val =
                                        displayd + " avec le" + nom_med;
                                      console.log(insert_val);
                                      var desc =
                                        " Vous avez un rendez-vous programmé le " +
                                        insert_val;

                                      connection.query(
                                        "INSERT INTO notification(iduser,idpatient,date_notif,title_notif, description_notif, sent_by) VALUES (?,?,?,?,?,?)",
                                        [
                                          decodedToken.IdUser,
                                          req.query.id,
                                          req.body.rdv_date,
                                          "Rendez-vous programmé",
                                          desc,
                                          "medecin",
                                        ],
                                        (err, res5) => {
                                          if (err) {
                                            console.log("Error : ", err);
                                            res.json({
                                              message: "error",
                                              error:
                                                " Veuillez réessayer ultérieurement .",
                                            });
                                          } else {
                                            console.log(
                                              "Votre rendez-vous a été programmé avec succès!"
                                            ); //res.send
                                            res.json({
                                              message: "done",
                                            });
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
                    }
                  }
                );
              } else {
                //date none available
                console.log(
                  "cette heure est déjà prise, veuillez selectionner une autre date"
                ); //render
                res.json({
                  message: "error",
                  error:
                    "Cette heure est déjà prise, veuillez selectionner une autre date",
                });
              }
            }
          }
        );

        //}
      });
    }
  );
};

exports.getList = (req, res, next) => {

  const db = require("../util/db").db;
  db.query("Select * from patient",(err,result)=> {
    if(err) {
      console.log('error',err) ; 

    }else {
      res.render("medicalfile/list", { listitems: result });

    }
  })
  };
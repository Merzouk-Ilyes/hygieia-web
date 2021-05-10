require('dotenv').config();
const mysql = require('mysql'); 
 var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASS,
    database :process.env.MYSQL_DB,
  }); 
 db.connect((err)=> {
    if(err) {
      console.log('error',err);
    } else {
      console.log("connected");
    }
  });
  module.exports = {db};
require('dotenv').config();
const Sequelize =require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DB , process.env.DB_USER,process.env.DB_PASS,
 {dialect:'mysql' ,
 define :{
    timestamps: false,
    freezeTableName: true
} ,
host:process.env.DB_HOST ,

});

module.exports = sequelize ;
const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Account = sequelize.define('account' , {
    Email :{
        type :Sequelize.STRING,
        primaryKey:true,
        allowNull :false,

    },
    Password:{
        type:Sequelize.STRING ,
        allowNull : false
    },
    active :Sequelize.BOOLEAN
} , {
    tableName: 'account'
  }) ;

const User = sequelize.define('users' ,{
    IdUser:{
        type:Sequelize.INTEGER ,
        allowNull:false ,
        primaryKey :true,
        autoIncrement: true ,
    } ,
    Firstname:Sequelize.STRING ,
    Lastname:Sequelize.STRING ,
    Birthday :Sequelize.DATE ,
    Sexe :Sequelize.STRING ,
    Role:Sequelize.STRING ,
    Phonenumber:Sequelize.INTEGER ,
    Email:Sequelize.STRING ,
}, {
    tableName: 'users'
  }) ;



const Admin = sequelize.define('administrator' ,{
    IdAdmin:{
        type:Sequelize.INTEGER ,
        allowNull:false ,
        primaryKey :true,
        autoIncrement: true ,
    } ,
    Firstname:Sequelize.STRING ,
    Lastname:Sequelize.STRING ,
    Birthday :Sequelize.DATE ,
    Sexe :Sequelize.STRING ,
    Phonenumber:Sequelize.INTEGER ,
    Email:Sequelize.STRING ,
}, {
    tableName: 'administrator'
  }) ;
const Patient = sequelize.define('patient' ,{
    IdPatient:{
        type:Sequelize.INTEGER ,
        allowNull:false ,
        primaryKey :true,
        autoIncrement: true ,
    },
    Firstname:Sequelize.STRING ,
    Lastname:Sequelize.STRING ,
    Birthday :Sequelize.DATE ,
    Sexe :Sequelize.STRING ,
    Birthplace:Sequelize.STRING ,
    Phonenumber:Sequelize.INTEGER ,
    Role:Sequelize.STRING,
    Email:Sequelize.STRING,
}, {
    tableName: 'patient'
  })


module.exports = {Account ,User,Admin,Patient}
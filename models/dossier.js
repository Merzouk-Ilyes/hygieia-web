const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Medical_File = sequelize.define('Medical_File' , {

    IdMedicalFile :{
        type :Sequelize.INTEGER,
        primaryKey:true,
        allowNull :false,
        autoIncrement : true 
    },
    IdPatient :{
        type:Sequelize.INTEGER ,
        allowNull : false
    },
    Adddate :Sequelize.DATE

} ,{
    tableName: 'Medical_File'
})


module.exports = {Medical_File}
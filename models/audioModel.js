const { DataTypes } = require("sequelize");
const {sequelize} = require("./sequelize");

const audios = sequelize.define('audio', {
  title:{
        type:DataTypes.STRING,
        allowNull:false  
  },
  uniqueId:{
        type:DataTypes.STRING,
        allowNull:false 
  },
  category:{
        type:DataTypes.STRING,
        allowNull:false
  }
})

module.exports = audios






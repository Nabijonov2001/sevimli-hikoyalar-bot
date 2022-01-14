const { DataTypes } = require("sequelize");
const {sequelize} = require("./sequelize");

const categories = sequelize.define('category', {
  name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }
})

module.exports = categories

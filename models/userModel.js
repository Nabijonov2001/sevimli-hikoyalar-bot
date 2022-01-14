const { DataTypes } = require("sequelize");
const {sequelize} = require("./sequelize");

const users = sequelize.define('user', {
  user_id:{
    type:DataTypes.INTEGER,
    allowNull:false  
  },
  step:{
      type:DataTypes.STRING,
      defaultValue:0,
  },
  type:{
    type:DataTypes.STRING,
    defaultValue:'none'
  }
})

module.exports = users
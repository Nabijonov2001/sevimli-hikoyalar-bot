const { DataTypes } = require("sequelize");
const {sequelize} = require("./sequelize");

const admins = sequelize.define('admin', {
  admin_id:{
    type:DataTypes.INTEGER,
    allowNull:false  
  },
  step:{
      type:DataTypes.STRING,
      defaultValue:0,

  }
})

module.exports = admins
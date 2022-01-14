const { DataTypes } = require("sequelize");
const {sequelize} = require("./sequelize");

const comments = sequelize.define('comment', {
  text:{
    type:DataTypes.STRING
  },
  name:DataTypes.STRING
})

module.exports = comments
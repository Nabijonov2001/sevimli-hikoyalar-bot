const { DataTypes } = require("sequelize");
const { sequelize } = require("./sequelize");

const videos = sequelize.define('video', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  uniqueId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = videos


const {Sequelize}= require('sequelize')
const { db_url } = require('../config')
console.log(db_url)

const sequelize = new Sequelize(db_url)

const db = {}
db.sequelize = sequelize

module.exports = db
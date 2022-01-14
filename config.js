require('dotenv').config()

module.exports = {
    token : process.env.token,
    adminBotToken: process.env.adminBotToken,
    db_url:process.env.db_url,
    first_admin:process.env.first_admin_id,
    second_admin:process.env.second_admin_id
}
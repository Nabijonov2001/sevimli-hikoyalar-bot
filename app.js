const TelegramBot = require('node-telegram-bot-api')
const { adminPanel } = require('./admin')
const { token } = require('./config')
const { step2 } = require('./controllers/user_controllers/step2')
const { step3 } = require('./controllers/user_controllers/step3')
const { step4 } = require('./controllers/user_controllers/step4')
const { pagination } = require('./helpers/pagination')
const admins = require('./models/adminModel')
const audios = require('./models/audioModel')
const categories = require('./models/categoriesModel')
const db = require('./models/sequelize')
const users = require('./models/userModel')
const videos = require('./models/videoModel')
const { userPanel, userPanelQuery } = require('./user')
const bot = new TelegramBot(token, { polling: true })



bot.on('message', async message => {
    try {
        const admin = await admins.findOne({ where: { admin_id: message.from.id } })
        const user = await users.findOne({ where: { user_id: message.from.id } })
        if (admin) {
            adminPanel(bot, admin, message)
        } else if (user) {
            userPanel(bot, user, message)
        }
    } catch (error) {
        console.log(error)
    }
})

bot.on('callback_query', async query => {
    const user = await users.findOne({ where: { user_id: query.from.id } })
    try {
        userPanelQuery(bot, user, query)
    } catch (error) {
        console.log(error)
    }
})
db.sequelize.sync({ force: false }).then(() => {
    console.log("Database connection created");
});



const TelegramBot = require('node-telegram-bot-api')
const { token } = require('./config')
const { step2 } = require('./controllers/user_controllers/step2')
const { step3 } = require('./controllers/user_controllers/step3')
const { step4 } = require('./controllers/user_controllers/step4')
const { pagination } = require('./helpers/pagination')
const audios = require('./models/audioModel')
const categories = require('./models/categoriesModel')
const db = require('./models/sequelize')
const users = require('./models/userModel')
const videos = require('./models/videoModel')
const bot = new TelegramBot(token, { polling: true })


bot.on('message', async message => {
    const userId = message.from.id
    const text = message.text
    const user = await users.findOne({ where: { user_id: userId } })
    try {
        if (text == '/start') {
            await bot.sendMessage(userId, `<b>Assalomu alaykum ${message.from.first_name}.\nBotimizga xush kellibsiz!</b>`, {
                parse_mode: 'HTML',
                reply_to_message_id: message.message_id,
                reply_markup: {
                    keyboard: []
                }
            })
            await bot.sendMessage(userId, `<b>Video yoki audio dan birini tanlang.</b>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🎧 audio", callback_data: "audio" }, { text: "🎬 video", callback_data: "video" }]
                    ]
                }
            })
            if (user) {
                users.update({ step: '1' }, { where: { user_id: userId } })
            } else {
                users.create({ user_id: userId, step: '1' })
            }

        }
        if(text == '/type'){
            await bot.sendMessage(userId, `<b>Video yoki audio dan birini tanlang.</b>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🎧 audio", callback_data: "audio" }, { text: "🎬 video", callback_data: "video" }]
                    ]
                }
            })
            users.update({ step: '1' }, { where: { user_id: userId } })
        }
        step2(bot, user, message)
        step3(bot, user, message)
        step4(bot, user, message)   
    } catch (error) {
        console.log(error)
    }
})

bot.on('callback_query', async query => {
    const userId = query.from.id
    const data = query.data
    const user = await users.findOne({ where: { user_id: userId } })
    try {
        if(user.step == '1') {
            await bot.deleteMessage(userId, query.message.message_id)
            await bot.sendMessage(userId, `Asosiy menyu`, {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                        [{ text: 'Abdukarim Mirzayev' }],
                        [{ text: '📊 Obunachilar soni' }, { text: '💬 Izohlar' }]
                    ]
                }
            })
            await bot.answerCallbackQuery(query.id, '')
            await users.update({ step: '2', type: data }, { where: { user_id: userId } })
        }
        if(user.step == '3') {
            if(data == 'none') {
                await bot.answerCallbackQuery(query.id, "Bu tarafda ma'lumot topilmadi!")
            }
            if(data == 'delete') {
                await bot.deleteMessage(userId, query.message.message_id)
            }
            if(data.split('#')[0] == 'left' || data.split('#')[0] == 'right') {
                const btn = query.data.split('#')
                const category = btn[1]
                const current_page = +btn[2]
                const page = await pagination(current_page, 10, user.type, category)
                await bot.editMessageText(page.text, {
                    chat_id: userId,
                    message_id: query.message.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: page.keyb
                    }
                })
                await bot.answerCallbackQuery(query.id, '')
            }
            if(isNaN(+data)==false){
                if(user.type =='audio'){
                    const audio = await audios.findOne({where:{id:data}})
                    await bot.sendAudio(userId, audio.uniqueId)
                    await bot.answerCallbackQuery(query.id, '')
                }
                if(user.type =='video'){
                    const video = await videos.findOne({where:{id:data}})
                    await bot.sendVideo(userId, video.uniqueId)
                    await bot.answerCallbackQuery(query.id, '')
                }
            }
        }
        if(user.step == '4'){
            if(data == 'none') {
                await bot.answerCallbackQuery(query.id, "Bu tarafda ma'lumot topilmadi!")
            }
            if(data == 'delete') {
                await bot.deleteMessage(userId, query.message.message_id)
            }
            if(data.split('#')[0] == 'left' || data.split('#')[0] == 'right') {
                const btn = query.data.split('#')
                const category = btn[1]
                const current_page = +btn[2]
                const page = await pagination(current_page, 10, user.type, category)
                await bot.editMessageText(page.text, {
                    chat_id: userId,
                    message_id: query.message.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: page.keyb
                    }
                })
                await bot.answerCallbackQuery(query.id, '')
            }
            if(isNaN(+data)==false){
                if(user.type =='audio'){
                    const audio = await audios.findOne({where:{id:data}})
                    await bot.sendAudio(userId, audio.uniqueId)
                    await bot.answerCallbackQuery(query.id, '')
                }
                if(user.type =='video'){
                    const video = await videos.findOne({where:{id:data}})
                    await bot.sendVideo(userId, video.uniqueId)
                    await bot.answerCallbackQuery(query.id, '')
                }
            }
        }else{
            await bot.answerCallbackQuery(query.id, '')
        }
    } catch (error) {
        console.log(error)
    }
})


db.sequelize.sync({ force: false }).then(() => {
    console.log("Database connection created");
});
const admins = require('./models/adminModel')
const db = require('./models/sequelize')
const users = require('./models/userModel')
const categories = require('./models/categoriesModel')
const { categoryKeyboard } = require('./helpers/category_keyboard')
const { step4 } = require('./controllers/admin_controllers/step4')
const { step5 } = require('./controllers/admin_controllers/step5')


async function adminPanel(bot, admin, message) {
    const text = message.text
    const userId =message.from.id
    try {
        if (text === '/start') {   
            await bot.sendMessage(admin.admin_id, `<b>Assalomu alaykum ${message.from.first_name}. Admin panelga xush kelibsiz!</b>`, {
                parse_mode: 'HTML',
                reply_to_message_id: message.message_id,
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                        [{ text: "πΎ Bo'limlar" }],
                        [{ text: 'π Obunachilar soni' }, { text: 'π¬ Xabarlar' }],
                        [{ text: "βΎοΈ Reklama" }]
                    ]
                }
            })

            await admins.update({ step: '1' }, { where: { admin_id: admin.admin_id } })
        }
        if (admin.step == '1') {
            if (text == "πΎ Bo'limlar") {
                await bot.sendMessage(admin.admin_id, text, {
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [{ text: "βΎοΈ Barcha bo'limlar" }, { text: "β Bo'lim qo'shish" }],
                            [{ text: "π Ortga" }]
                        ]
                    }
                })
                await admins.update({ step: '2' }, { where: { admin_id: admin.admin_id } })
            }
            if (text == "π Obunachilar soni") {
                const user_num = await users.findAll()
                console.log(user_num.length)
                await bot.sendMessage(admin.admin_id, `π₯ <b>Botdagi obunachilar soni : ${user_num.length}</b>`, {
                    parse_mode: "HTML"
                })
            }
            if (text == 'βΎοΈ Reklama') {
                await bot.sendMessage(admin.admin_id, 'Reklama matnini jo`nating.', {
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [{ text: "π Ortga" }]
                        ]
                    }
                })
                await admins.update({ step: 'reklama' }, { where: { admin_id: admin.admin_id } })
            }
        }
        if (admin.step == 'reklama') {
            if (text == 'π Ortga') {
                await bot.sendMessage(userId, 'Asosiy menyu', {
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [{ text: "πΎ Bo'limlar" }],
                            [{ text: 'π Obunachilar soni' }, { text: 'π¬ Xabarlar' }],
                            [{ text: "βΎοΈ Reklama" }]
                        ]
                    }
                })
                await admins.update({ step: '1' }, { where: { admin_id: admin.admin_id } })
            }
            if (message.reply_to_message && text == '/post') {
                const all_users = await users.findAll()
                let interval = 20 / 1000
                all_users.forEach(user => {
                    try {
                        setTimeout(async () => {
                            await bot.copyMessage(user.user_id, message.from.id, message.reply_to_message.message_id, {
                                reply_markup: message.reply_to_message.reply_markup
                            })
                        }, interval)
                    } catch (error) {
                        console.log(error)
                    }
                })
                await bot.sendMessage(userId, 'Asosiy menyu', {
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [{ text: "πΎ Bo'limlar" }],
                            [{ text: 'π Obunachilar soni' }, { text: 'π¬ Xabarlar' }],
                            [{ text: "βΎοΈ Reklama" }]
                        ]
                    }
                })
                await admins.update({ step: '1' }, { where: { admin_id: admin.admin_id } })
            }
        }
        if (admin.step == '2') {
            if (text == "βΎοΈ Barcha bo'limlar") {
                const c_names = await categories.findAll()
                let keyb = categoryKeyboard(c_names)
                await bot.sendMessage(admin.admin_id, text, {
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: keyb
                    }
                })
                await admins.update({ step: `3#all` }, { where: { admin_id: admin.admin_id } })
            }
            if (text == "β Bo'lim qo'shish") {
                await bot.sendMessage(admin.admin_id, "Bo'lim nomini kiriting", {
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [{ text: "π Ortga" }]
                        ]
                    }
                })
                await admins.update({ step: `3#add` }, { where: { admin_id: admin.admin_id } })
            }
            if (text == "π Ortga") {
                await bot.sendMessage(admin.admin_id, text, {
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [{ text: "πΎ Bo'limlar" }],
                            [{ text: 'π Obunachilar soni' }, { text: 'π¬ Xabarlar' }],
                            [{ text: "βΎοΈ Reklama" }]
                        ]
                    }
                })
                await admins.update({ step: '1' }, { where: { admin_id: admin.admin_id } })
            }
        }
        if (admin.step.split('#')[0] == '3') {
            if (admin.step.split('#')[1] == 'add') {
                if (text == 'π Ortga') {
                    await bot.sendMessage(admin.admin_id, text, {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: [
                                [{ text: "βΎοΈ Barcha bo'limlar" }, { text: "β Bo'lim qo'shish" }],
                                [{ text: "π Ortga" }]
                            ]
                        }
                    })
                    await admins.update({ step: '2' }, { where: { admin_id: admin.admin_id } })
                } else if (text != "/start" && text != "π Asosiy Menyu") {
                    await bot.sendMessage(admin.admin_id, 'Yangi bo`lim yaratildi.', {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: [
                                [{ text: "βΎοΈ Barcha bo'limlar" }, { text: "β Bo'lim qo'shish" }],
                                [{ text: "π Ortga" }]
                            ]
                        }
                    })
                    await categories.create({ name: text })
                    await admins.update({ step: `2` }, { where: { admin_id: message.from.id } })
                }
            }
            if (admin.step.split('#')[1] == 'all') {
                if (text == 'π Ortga') {
                    await bot.sendMessage(message.from.id, text, {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: [
                                [{ text: "βΎοΈ Barcha bo'limlar" }, { text: "β Bo'lim qo'shish" }],
                                [{ text: "π Ortga" }]
                            ]
                        }
                    })
                    await admins.update({ step: '2' }, { where: { admin_id: admin.admin_id } })
                }
                if (text == 'π Asosiy Menyu') {
                    await bot.sendMessage(admin.admin_id, text, {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: [
                                [{ text: "πΎ Bo'limlar" }],
                                [{ text: 'π Obunachilar soni' }, { text: 'π¬ Xabarlar' }],
                                [{ text: "βΎοΈ Reklama" }]
                            ]
                        }
                    })
                    await admins.update({ step: '1' }, { where: { admin_id: admin.admin_id } })
                } else {
                    const category = await categories.findOne({ where: { name: text } })
                    if (category) {
                        await bot.sendMessage(admin.admin_id, category.name, {
                            reply_markup: {
                                resize_keyboard: true,
                                keyboard: [
                                    [{ text: "π§ Audio qo'shish" }, { text: "π¬ Video qo'shish" }],
                                    [{ text: "π Bo'lim ma'lumotlari" }],
                                    [{ text: "π Ortga" }, { text: "π Asosiy Menyu" }],
                                    [{ text: "β Bo'limni o'chirish" }]
                                ]
                            }
                        })
                        await admins.update({ step: `4#${text}` }, { where: { admin_id: admin.admin_id } })
                    }
                }

            }
        }
        step4(bot, admin, message)
        step5(bot, admin, message)

    } catch (error) {
        console.log(error)
    }
}

module.exports = { adminPanel }


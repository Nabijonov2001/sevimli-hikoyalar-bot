const { categoryKeyboard } = require("../../helpers/category_keyboard")
const admins = require("../../models/adminModel")
const audios = require("../../models/audioModel")
const categories = require("../../models/categoriesModel")
const videos = require("../../models/videoModel")

async function step5(bot, admin, message) {
    try {
        const text = message.text
        const userId = message.from.id
        const next_step = admin.step.split("#")
        if (next_step[0] == '5') {
            if (next_step[2] == 'audio') {
                if (text == '🔙 Ortga') {
                    await bot.sendMessage(userId, next_step[1], {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: [
                                [{ text: "🎧 Audio qo'shish" }, { text: "🎬 Video qo'shish" }],
                                [{ text: "📋 Bo'lim ma'lumotlari" }],
                                [{ text: "🔙 Ortga" }, { text: "🔝 Asosiy Menyu" }],
                                [{ text: "❌ Bo'limni o'chirish" }]
                            ]
                        }
                    })
                    await admins.update({ step: `4#${next_step[1]}` }, { where: { admin_id: userId } })
                }
                if (message.audio) {
                    const { title, file_id } = message.audio
                    const category = next_step[1]
                    const check_title = await audios.findOne({ where: {title: title } })
                    const check_id = await audios.findOne({ where: {uniqueId: file_id } })
                    if (!check_id && !check_title) {
                        const audio = await audios.create({
                            title: title,
                            uniqueId: file_id,
                            category: category
                        })
                        audio ? await bot.sendMessage(userId, 'Audio muvaffaqqiyatli qo`shildi!', {
                            reply_to_message_id: message.message_id
                        })
                            : bot.sendMessage(userId, 'Audio qo`shishda xatolik yuz berdi!', {
                                reply_to_message_id: message.message_id
                            })
                    } else {
                        await bot.sendMessage(userId, 'Bu audio ro`yxatda mavjud', {
                            reply_to_message_id: message.message_id
                        })
                    }

                }
            }
            if (next_step[2] == 'video') {
                if (text == '🔙 Ortga') {
                    await bot.sendMessage(userId, next_step[1], {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: [
                                [{ text: "🎧 Audio qo'shish" }, { text: "🎬 Video qo'shish" }],
                                [{ text: "📋 Bo'lim ma'lumotlari" }],
                                [{ text: "🔙 Ortga" }, { text: "🔝 Asosiy Menyu" }],
                                [{ text: "❌ Bo'limni o'chirish" }]
                            ]
                        }
                    })
                    await admins.update({ step: `4#${next_step[1]}` }, { where: { admin_id: userId } })
                }
                if (message.video) {
                    const { file_name, file_id } = message.video
                    const category = next_step[1]
                    const check_title = await videos.findOne({ where: {title: file_name } })
                    const check_id = await videos.findOne({ where: {uniqueId: file_id } })
                    if (!check_id && !check_title) {
                        const video = await videos.create({
                            title: file_name,
                            uniqueId: file_id,
                            category: category
                        })
                        video ? await bot.sendMessage(userId, 'Video muvaffaqqiyatli qo`shildi!', {
                            reply_to_message_id: message.message_id
                        })
                            : bot.sendMessage(userId, 'Video qo`shishda xatolik yuz berdi!', {
                                reply_to_message_id: message.message_id
                            })
                    } else {
                        await bot.sendMessage(userId, 'Bu video ro`yxatda mavjud', {
                            reply_to_message_id: message.message_id
                        })
                    }
                }
            }
            if (next_step[2] == 'delete') {
                if (text == "❌ O'chirish") {
                    const delete_category = await categories.destroy({ where: { name: next_step[1]}})
                    await audios.destroy({ where: { category: next_step[1]}})
                    await videos.destroy({ where: { category: next_step[1]}})
                    if (delete_category) {
                        console.log(true)
                        const c_names = await categories.findAll()
                        let keyb = categoryKeyboard(c_names) 
                        await bot.sendMessage(userId, `<b>${next_step[1]}</b> bo'limi o'chirildi.`, {
                            parse_mode:"HTML",
                            reply_markup: {
                                resize_keyboard: true,
                                keyboard: keyb
                            }
                        })
                        await admins.update({ step: `3#all` }, { where: { admin_id: userId } })
                    }
                }
                if (text == '🔙 Ortga') {
                    await bot.sendMessage(userId, next_step[1], {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: [
                                [{ text: "🎧 Audio qo'shish" }, { text: "🎬 Video qo'shish" }],
                                [{ text: "📋 Bo'lim ma'lumotlari" }],
                                [{ text: "🔙 Ortga" }, { text: "🔝 Asosiy Menyu" }],
                                [{ text: "❌ Bo'limni o'chirish" }]
                            ]
                        }
                    })
                    await admins.update({ step: `4#${next_step[1]}` }, { where: { admin_id: userId } })
                }
            }
        }
    } catch (error) {
        console.log(error)
    }

}

module.exports = { step5 }
const { categoryKeyboard } = require("../../helpers/category_keyboard")
const admins = require("../../models/adminModel")
const audios = require("../../models/audioModel")
const categories = require("../../models/categoriesModel")
const videos = require("../../models/videoModel")

async function step4(bot, admin, message) {
    try {
        const text = message.text
    const userId = message.from.id
    if (admin.step.split("#")[0] == 4) {
        if(text == "π Ortga") {
            const c_names = await categories.findAll()
            let keyb = categoryKeyboard(c_names) 
            await bot.sendMessage(userId, text, {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: keyb
                }
            })
            await admins.update({ step: `3#all` }, { where: { admin_id: userId } })
        }
        if(text=="π Asosiy Menyu"){
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
            await admins.update({ step: '1' }, { where: { admin_id: admin.admin_id }})
        }
        if(text=="π§ Audio qo'shish"){
            await bot.sendMessage(userId, 'Audioni yuklang!', {
                reply_markup:{
                    resize_keyboard:true,
                    keyboard:[
                        [{text:"π Ortga"}]
                    ]
                }
            })
            const category = admin.step.split("#")[1]
            await admins.update({step:`5#${category}#audio`}, {where:{admin_id:userId}})
        }
        if(text=="π¬ Video qo'shish"){
            await bot.sendMessage(userId, 'Videoni yuklang!', {
                reply_markup:{
                    resize_keyboard:true,
                    keyboard:[
                        [{text:"π Ortga"}]
                    ]
                }
            })
            const category = admin.step.split("#")[1]
            await admins.update({step:`5#${category}#video`}, {where:{admin_id:userId}})
        }
        if(text == "π Bo'lim ma'lumotlari"){
            const audio_number = await audios.findAll({where:{category:admin.step.split("#")[1]}})
            const video_number = await videos.findAll({where:{category:admin.step.split("#")[1]}})
            await bot.sendMessage(userId, `<b>Bo'lim haqida ma'lumotlar</b>\n\nπ <b>Bo'lim nomi:</b> ${admin.step.split("#")[1]}\n<b>π§ Audiolar soni:</b> ${audio_number.length} ta\n<b>π¬ Videolar soni:</b> ${video_number.length} ta`,{
                parse_mode:'HTML'
            })
        }
        if(text=="β Bo'limni o'chirish"){
            await bot.sendMessage(userId, "<b>DIQQAT! O'CHIRISH TUGMASINI BOSISH ORQALI SIZ BU BO'LIMNI VA UNDAGI BARCHA MA'LUMOTLARNI O'CHIRISASIZ.</b>",{
                parse_mode:"HTML",
                reply_markup:{
                    resize_keyboard:true,
                    keyboard:[
                        [{text:"β O'chirish"}],[ {text:"π Ortga"}]
                    ]
                }
            })
            const category = admin.step.split('#')[1]
            await admins.update({ step: `5#${category}#delete` }, { where: { admin_id: userId } })
        }
        
    }
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = { step4 }
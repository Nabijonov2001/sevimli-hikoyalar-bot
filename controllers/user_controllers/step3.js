const { chatper_audios } = require("../../helpers/category_for_audios")
const { pagination } = require("../../helpers/pagination")
const categories = require("../../models/categoriesModel")
const users = require("../../models/userModel")

async function step3(bot, user, message){
    const userId = message.from.id
    const text = message.text
    try {
        if(user.step == '3'){
            if(text == '🔙 Ortga'){
                await bot.sendMessage(userId, 'Asosiy bo`lim',{
                    reply_markup:{
                        resize_keyboard:true,
                        keyboard:[
                            [{text:'Abdukarim Mirzayev'}],
                            [{text:'📊 Obunachilar soni'}, {text:'💬 Izohlar'}]
                        ]
                    }
                })
                await users.update({step:'2'}, {where:{user_id:userId}})
            }
            if(text == '📁 Audio kitoblar'){
                const data = await categories.findAll()
                const keyb = chatper_audios(data)
                await bot.sendMessage(userId, text, {
                    reply_markup:{
                        resize_keyboard:true,
                        keyboard:keyb
                    }
                })
                await users.update({step:'4'}, {where:{user_id:userId}})
            }else{
                const check = await categories.findOne({where:{name:text}})
                if(check){
                    const page = await pagination(1, 10, user.type, text)
                    await bot.sendMessage(userId, page.text, {
                        parse_mode:'html',
                        reply_to_message_id:message.message_id,
                        reply_markup:{
                            inline_keyboard:page.keyb
                        }
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {step3}
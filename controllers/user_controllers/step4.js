const { chatper_category } = require("../../helpers/category_for_users")
const { pagination } = require("../../helpers/pagination")
const categories = require("../../models/categoriesModel")
const users = require("../../models/userModel")

async function step4(bot, user, message){
    const text = message.text
    const userId = message.from.id
    try {
        if(user.step == '4'){
            if(text == '🔙 Ortga'){
                let chapters = await categories.findAll({attributes:['name']})
                chapters.push({name:'📁 Audio kitoblar'})
                let keyb = chatper_category(chapters) 
                await bot.sendMessage(userId, 'Bo`limlar', {
                    reply_markup:{
                        resize_keyboard:true,
                        keyboard:keyb
                    }
                })
                await users.update({step:'3'}, {where:{user_id:userId}})
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

module.exports = {step4}
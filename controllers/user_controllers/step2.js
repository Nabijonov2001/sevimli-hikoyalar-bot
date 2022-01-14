const { first_admin, second_admin } = require("../../config")
const { chatper_category } = require("../../helpers/category_for_users")
const categories = require("../../models/categoriesModel")
const comments = require("../../models/commentModel")
const users = require("../../models/userModel")

async function step2(bot, user, message){
    const userId = message.from.id
    const text = message.text
    try {
        if(user.step == '2'){
            if(text == 'Abdukarim Mirzayev'){
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
            }
            if(text == '📊 Obunachilar soni'){
                let all_users = await users.findAll()
                await bot.sendMessage(userId, `<b>👥 Obunachilar soni: ${all_users.length}</b>`,{
                    parse_mode:'html'
                })
            }
            if(text == '💬 Izohlar'){
                await bot.sendMessage(userId, 'Marhamat taklif va mulohazalaringizni qoldiring!', {
                    reply_markup:{
                        resize_keyboard:true,
                        keyboard:[
                            [{text:'🔙 Ortga'}]
                        ]
                    }
                })
                await user.update({step:'comment'}, {where:{user_id:userId}})
            }
            if(message.reply_to_message && text =='/post'&&(userId ==first_admin ||userId ==second_admin)){
                const all_users = await users.findAll()
                let interval = 20/1000
                all_users.forEach(user =>{
                    try {
                        setTimeout(async()=>{
                            await bot.copyMessage(user.user_id, message.from.id, message.reply_to_message.message_id, {
                                reply_markup:message.reply_to_message.reply_markup
                            })
                        }, interval)
                    } catch (error) {
                        console.log(error)
                    }
                })
            }
        }
        if(user.step =='comment'){
            if(text == '🔙 Ortga'){
                await bot.sendMessage(userId, `Asosiy menyu`, {
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [{ text: 'Abdukarim Mirzayev' }],
                            [{ text: '📊 Obunachilar soni' }, { text: '💬 Izohlar' }]
                        ]
                    }
                })
                await user.update({step:'2'}, {where:{user_id:userId}})
            }else if(text!='/start' && text!='/type'&& text!='💬 Izohlar'){
                await comments.create({name:message.from.first_name, text:text})
                await bot.sendMessage(userId, 'Firklaringiz uchun rahmat!',{
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: [
                            [{ text: 'Abdukarim Mirzayev' }],
                            [{ text: '📊 Obunachilar soni' }, { text: '💬 Izohlar' }]
                        ]
                    }
                })
                await user.update({step:'2'}, {where:{user_id:userId}})
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {step2}

function categoryKeyboard(data){
    let keyb = []
    let arr = []
    data.forEach(item => {
        let obj = {text:item.name}
        arr.push(obj)
        if(arr.length%2==0){
            keyb.push(arr)
            arr = []
        }
    })
    if(data.length%2==1){
        keyb.push([{text:data[data.length-1].name}])
    }
    keyb.push([{text:'π Ortga'}, {text:'π Asosiy Menyu'}])
    return keyb
}

module.exports = {categoryKeyboard}

// console.log(true)
//                 if(text=='π Ortga'){
//                     console.log(text)
//                     await bot.sendMessage(message.from.id, text, {
//                         reply_markup:{
//                             resize_keyboard:true,
//                             keyboard:[
//                                 [{text:"βΎοΈ Barcha bo'limlar"}, {text:"β Bo'lim qo'shish"}],
//                                 [{text:"π Ortga"}]
//                             ]
//                         }
//                     })
//                     await admins.update({step:'2'}, {where:{admin_id:admin.admin_id}})
//                 }
//                 if(text=='π Asosiy Menyu'){
//                     await bot.sendMessage(admin.admin_id, text)
                     
                        
//                 }
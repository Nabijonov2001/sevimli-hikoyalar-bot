const audios = require("../models/audioModel")
const videos = require("../models/videoModel")

async function pagination(page, limit, type, category) {
    let data = 0
    let all_data = 0
    let offset = limit * (page - 1)
    if (type == 'audio') {
        data = await audios.findAll({ limit, offset, where: { category: category } })
        all_data = (await audios.findAll({where:{category}}))
    }
    if (type == 'video') {
        data = await videos.findAll({ limit, offset, where: { category: category } })
        all_data = (await videos.findAll({where:{category}}))
    }

    let text = `<b>Hozirgi:${offset + 1}-${data.length + offset}, jami:${all_data.length}</b>\n\n`
    let keyb = []
    let arr = []
    data.forEach((element, index) => {

        // buttons
        arr.push({ text: `${index + 1}`, callback_data: `${element.id}` })
        if (arr.length % 5 == 0) {
            keyb.push(arr)
            arr = []
        }

        // title list
        text = text + `<b>${index + 1}.</b> ${element.title}\n`

    })
    keyb.push(arr)
    keyb.push([{ text: `⬅️`, callback_data: page != 1 ? `left#${category}#${page - 1}` : 'none' },
               { text: `❌`, callback_data: `delete` },
               { text: ` ➡️`, callback_data: data.length + offset != all_data.length ? `right#${category}#${page + 1}` : 'none' }
            ])
    return {
        text, keyb
    }
}

module.exports = { pagination }

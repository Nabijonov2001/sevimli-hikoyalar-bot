
function chatper_category(data) {
    let audio_book = []
    data.forEach(item => {
        if (item.name.includes('📘') == false) {
            audio_book.push(item)
        }
    })
    let keyb = []
    let arr = []
    audio_book.forEach(item => {
        let obj = { text: item.name }
        arr.push(obj)
        if (arr.length % 2 == 0) {
            keyb.push(arr)
            arr = []
        }
    })
    if (audio_book.length % 2 == 1) {
        keyb.push([{ text: audio_book[audio_book.length - 1].name }])
    }
    keyb.push([{text:'🔙 Ortga'}])
    return keyb
}

module.exports = {chatper_category}
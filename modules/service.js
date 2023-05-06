import {request} from './fetch.js'

let def_options = {
    'enable': true,
    'to': 'zh',
    'detect_plugin': 'baidu'
}


let config = async (key = undefined, value = undefined) => {
    let {options} = await chrome.storage.local.get('options')
    if (value !== undefined) {
        options[key] = value
        await chrome.storage.local.set({options})
        return
    }

    if (typeof key == 'undefined') {
        return options
    }

    if (typeof key === 'object') {
        Object.assign(options, key)
        await chrome.storage.local.set({options})
        return
    }

    return options[key] || ''
}

let init_storage = () => {
    chrome.storage.local.set({options: def_options})
}

class NoNeedTranslate extends Error {
    constructor() {
        super('No need translate');
    }
}


let urlEncode = (text) => {
    return encodeURIComponent(text).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+')
}


let _BaiDuDetectLanguage = async (text) => {
    let url = 'https://fanyi.baidu.com/langdetect'
    let headers = new Headers()
    headers.append('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8')

    let body = 'query=' + urlEncode(text);

    let result = await request(url, {headers, body, method: 'post'})

    console.log(result)

    return result['lan'] || 'zh'
}

let _XfTranslate = (text, from, to) => {

    console.log(text, from, to)

    return text
}

let translate = async (text, to, options = def_options) => {
    let lan
    // 检测数据语言
    switch (options.detect_plugin) {
        case "baidu":
            lan = await _BaiDuDetectLanguage(text)
            break
        default:
            lan = await _BaiDuDetectLanguage(text)
    }

    // translate
    if (lan === to) {
        throw new NoNeedTranslate()
    }

    return _XfTranslate(text, lan, to)
}

export {init_storage, config, translate}

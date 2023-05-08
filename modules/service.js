import {request} from './fetch.js'
import {cache} from "./cache.js";
import {config} from "./config.js";

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

    console.debug("application[translate]: detect origin lan [%s]", result['lan'])

    return result['lan'] || 'zh'
}

let _XfTranslate = async (text, from, to) => {
    let options = await config()
    let url = 'https://fanyi.xfyun.cn/api-tran/trans/its'
    let cookie = "ssoSessionId=[ssoSessionId];account_id=[accountId]"
        .replace('[ssoSessionId]', options.xf_token.ssoSessionId)
        .replace('[accountId]', options.xf_token.accountId)

    console.debug('application[translate]: origin text [%s] from [%s] to [%s]', text, from, to)

    let headers = new Headers()
    headers.append('Cookie', cookie)
    headers.append('Content-type', 'application/x-www-form-urlencoded')

    let body = ["from=" + from, "to=" + to, "text=" + urlEncode(text)].join("&")

    let result = await request(url, {headers, body: body, method: 'POST'})
    if (!result.flag) {
        throw new Error("application[translate]: " + result.desc || 'no detail info')
    }

    let data = JSON.parse(result.data)

    console.debug("application[translate]: translate api result", data)

    return data.trans_result?.dst || ''
}

let translate = async (text) => {
    let options = await config()
    let enable = Boolean(options['enable'])
    let dst_lan = options['to']
    let org_lan
    if (!enable) {
        throw new Error('not support')
    }

    // 检测数据语言
    switch (options.detect_plugin) {
        case "baidu":
            org_lan = await _BaiDuDetectLanguage(text)
            break
        default:
            org_lan = await _BaiDuDetectLanguage(text)
    }

    // translate
    if (org_lan === dst_lan) {
        throw new NoNeedTranslate()
    }

    // cache
    let key = org_lan + dst_lan + urlEncode(text)
    let cache_res = await cache(key)
    if (!cache_res) {
        cache_res = _XfTranslate(text, org_lan, dst_lan)
        await cache(key, cache_res)
    }
    return cache_res
}

export {config, translate}

import {config} from "./config.js";

let content = {}

let cache = async (key, value = undefined) => {
    if (value === undefined) {
        return content[key] || false
    }

    // 判断是否超出最大缓存数量
    let options = await config()
    let maxSize = options.cache_size || 100
    // todo 限制最大缓存

    content[key] = value
}

export {cache}

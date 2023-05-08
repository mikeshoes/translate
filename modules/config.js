let def_options = {
    'enable': true,
    'to': 'zh',
    'detect_plugin': 'baidu',
    'xf_token': {
        'ssoSessionId': '',
        'accountId': ''
    },
    'cache_size': 100
}


let config = async (key = undefined, value = undefined) => {
    let {options} = await chrome.storage.sync.get('options')
    if (value !== undefined) {
        options[key] = value
        await chrome.storage.sync.set({options})
        return
    }

    if (typeof key == 'undefined') {
        return options
    }

    if (typeof key === 'object') {
        Object.assign(options, key)
        await chrome.storage.sync.set({options})
        return
    }

    return options[key] || ''
}


let init_storage = () => {
    chrome.storage.sync.set({options: def_options})
}

export {config, init_storage}

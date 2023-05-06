import {init_storage, translate, config} from "./modules/service.js";

// 监听安装事件
chrome.runtime.onInstalled.addListener(details => {
    // 初始化application
    init_storage()

})

// 监听setting数据变化
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.options?.newValue) {
        console.debug('storage changed:', changes.options.newValue)
    }
})

// 监听前端发送的事件任务
chrome.runtime.onMessage.addListener(async (message, sender, callback) => {
    let response
    let error

    switch (message.command) {
        case "translate":
            let options = await config()
            let enable = Boolean(options['enable'])
            if (!enable) {
                error = 'not support'
                break
            }

            try {
                response = await translate(message.text, options['to'], options)
            } catch (e) {
                error = e.message
            }
            break
    }

    let msg = {
        'req': message,
        'res': response,
        'error': error
    }

    // 通过事件进行传递数据
    if (sender.tab?.id) {
        console.log(chrome.tabs)
        chrome.tabs.sendMessage(sender.tab.id, msg)
    }
})

import {translate} from "./modules/service.js";
import {init_storage} from "./modules/config.js";

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

    try {
        switch (message.command) {
            // 翻译命令
            case "translate":
                response = await translate(message.text)
                break
        }
    } catch (e) {
        error = e.message
    }

    let msg = {
        'req': message,
        'res': response,
        'error': error
    }

    // 通过事件进行传递数据
    if (sender.tab?.id) {
        chrome.tabs.sendMessage(sender.tab.id, msg)
    }
})

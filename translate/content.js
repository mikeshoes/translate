let getSelectText = () => {
    return window.getSelection().toString().trim()
}

let translate = (text) => {
    let message = {
        command: 'translate',
        text
    }

    chrome.runtime.sendMessage(message)
}


let messageEvent = (message) => {
    if (message.error) {
        console.log('error receive event ', message)
        return
    }

    switch (message.req.command) {
        case "translate":
            console.log('translate result', message.res)
            break
    }
}

let mouseup = () => {
    let text = getSelectText()
    if (text.length > 0) {
        translate(text)
    }
}

let content_loaded = () => {
    console.debug('init success')
    chrome.runtime.onMessage.addListener(messageEvent)
}

// 监听页面加载完成
document.addEventListener('DOMContentLoaded', content_loaded)
// 鼠标抬起事件
document.addEventListener('mouseup', mouseup)

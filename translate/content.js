let getSelectText = () => {
    return window.getSelection().toString().trim()
}

let currentDialog

let translate = (text) => {
    let message = {
        command: 'translate',
        text
    }

    chrome.runtime.sendMessage(message)
}

let init_dialog = (text) => {
    let client = window.getSelection().getRangeAt(0).getClientRects().item(0)

    let def_style = {
        cursor: 'pointer',
        border: 0,
        background: 'rgb(212 226 230)',
        boxShadow: '0 2px 10px 0 rgba(0,0,0,.1)',
        borderRadius: '6px',
        padding: '10px 15px 9px 16px',
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        position: 'fixed',
        left: client.x + 'px',
        top: client.y + client.height + 'px'
    }

    let div = document.createElement("div")
    div.innerText = text
    Object.assign(div.style, def_style)
    document.body.append(div)
    currentDialog = div
}

let removeDialog = () => {
    if (currentDialog) {
        currentDialog.remove()
    }
}

let messageEvent = (message, sender, callback) => {
    if (message.error) {
        console.debug('%capplication[translate]: %s', "color:red", message.error)
        return
    }

    switch (message.req.command) {
        case "translate":
            console.debug('%capplication[translate]: translate result [%s]', "color:red", message.res)
            init_dialog(message.res)
            break
    }
}

let mouseup = (event) => {
    event.preventDefault()

    let text = getSelectText()
    if (text.length > 0) {
        translate(text)
    }
}

// 注入的js无法 监听页面加载完成
// document.addEventListener('DOMContentLoaded', content_loaded)
// 鼠标抬起事件
document.addEventListener('mouseup', mouseup)

document.addEventListener('click', removeDialog)

// 监听background发回的结果
chrome.runtime.onMessage.addListener(messageEvent)

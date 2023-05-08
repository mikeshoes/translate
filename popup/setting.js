let switchDom
let enable


let onContentLoaded = async () => {
    switchDom = document.getElementById('switch')

    if (enable) {
        switchDom.style.cssText += 'active'
    }

    let {options} = await chrome.storage.sync.get('options')
    document.getElementById('translate_to').value = options.to
    document.getElementById('ssoSessionId').innerText = options.xf_token.ssoSessionId
    document.getElementById('accountId').innerText = options.xf_token.accountId
}


let switchChange = async () => {
    enable = !enable

    let {options} = await chrome.storage.sync.get('options')
    options['enable'] = enable

    chrome.storage.sync.set({options}).then(() => {
        console.log('设置启用成功')
    })
}

let translateChange = async () => {
    let translate_to = document.getElementById('translate_to').value

    let {options} = await chrome.storage.sync.get('options')
    options['to'] = translate_to

    chrome.storage.sync.set({options}).then(() => {
        console.log('设置目标语言成功')
    })
}

let token_set = async () => {
    let ssoSessionId = document.getElementById('ssoSessionId').innerText
    let accountId = document.getElementById('accountId').innerText

    let {options} = await chrome.storage.sync.get('options')
    options['xf_token'] = {ssoSessionId, accountId}

    chrome.storage.sync.set({options}).then(() => {
        console.log('设置讯飞翻译token成功')
    })
}


// 监听body体初始化完成
document.addEventListener('DOMContentLoaded', onContentLoaded)

document.getElementById('switch').onclick = switchChange

document.getElementById('translate_to').onchange = translateChange

document.getElementById('ssoSessionId').onblur = token_set

document.getElementById('accountId').onblur = token_set






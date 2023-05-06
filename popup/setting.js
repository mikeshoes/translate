let switchDom
let enable


let onContentLoaded = async () => {
    switchDom = document.getElementById('switch')

    if (enable) {
        switchDom.style.cssText += 'active'
    }

    let {options} = await chrome.storage.local.get('options')
    document.getElementById('translate_to').value = options.to
}


let switchChange = async () => {
    enable = !enable

    let {options} = await chrome.storage.local.get('options')
    options['enable'] = enable

    chrome.storage.local.set({options}).then(() => {
        console.log('设置启用成功')
    })
}

let translateChange = async () => {
    let translate_to = document.getElementById('translate_to').value

    let {options} = await chrome.storage.local.get('options')
    options['to'] = translate_to

    chrome.storage.local.set({options}).then(() => {
        console.log('设置目标语言成功')
    })
}


// 监听body体初始化完成
document.addEventListener('DOMContentLoaded', onContentLoaded)

document.getElementById('switch').onclick = switchChange

document.getElementById('translate_to').onchange = translateChange






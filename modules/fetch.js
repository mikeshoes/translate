let request = (url, options) => {
    let req = new Request(url, options)

    return fetch(req).then(res => res.json())
}

export {request}

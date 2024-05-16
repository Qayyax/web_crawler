import { JSDOM } from 'jsdom'

function normalizeURL(url) {
    const myURL = new URL(url);
    let fullPath = `${myURL.hostname}${myURL.pathname}`
    if (fullPath.slice(-1) === '/') {
        return fullPath.slice(0, -1)
    }
    return fullPath
}

function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody)
    const urls = []
    const anchors = dom.window.document.querySelectorAll('a')

    for (const anchor of anchors) {
        if (anchor.hasAttribute('href')) {
            let href = anchor.getAttribute('href')

            try {
                href = new URL(href, baseURL).href
                urls.push(href)
            } catch (err) {
                console.log(`${err.message}: ${href}`)
            }
        }
    }
    return urls
}

export { normalizeURL, getURLsFromHTML };

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

async function crawlPage(currentURL) {
    console.log(`crawling ${currentURL}`)

    let response
    try {
       response = await fetch(currentURL)
    } catch (err) {
        console.log(`Got network error: ${err.message}`)
    }

    if (response.status >= 400) {
        console.log(`Got HTTP error: ${response.status} ${response.statusText}`)
        return
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
        console.log(`Got non-HTML response: ${contentType}`)
        return
    }

    const data = await response.text()
    console.log(data)

}

export { normalizeURL, getURLsFromHTML, crawlPage };

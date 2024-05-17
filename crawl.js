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

async function fetchHTML(url) {
    let response
    try {
       response = await fetch(url)
    } catch (err) {
        throw new Error(`Got network error: ${err.message}`)
    }

    if (response.status >= 400) {
        throw new Error(`Got HTTP error: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
        throw new Error(`Got non-HTML response: ${contentType}`)
    }

    return response.text()
}

async function crawlPage(baseURL, currentURL=baseURL, pages={}) {

    // Checked that currentURL is on the baseURL host 
    const currentURLObj = new URL(currentURL)
    const baseURLObj = new URL(baseURL)
    if (currentURLObj.hostname !== baseURLObj.hostname) {
        return pages
    }

    const normalizeCurrent = normalizeURL(currentURL)

    // if we have visited the page before
    // increment the page count
    if (pages[normalizeCurrent] > 0) {
        pages[normalizeCurrent]++
        return pages
    } 
    pages[normalizeCurrent] = 1

    console.log(`crawling ${currentURL}`)

    let html = ''
    try {
        html = await fetchHTML(currentURL)
    } catch (err) {
        console.log(err.message)
        return pages
    }

    const nextURLs = getURLsFromHTML(html, baseURL)
    for (const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages)
    }

    return pages

}

export { normalizeURL, getURLsFromHTML, crawlPage };

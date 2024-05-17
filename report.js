function printReport(pages) {
    console.log('The report is starting')
    const sorted_pages = sortPages(pages)

    for (let page of sorted_pages) {
        console.log(`Found ${page[1]} internal links to ${page[0]}`)
    }
}

function sortPages(pages) {
    const sorted_pages = []
    for (let page in pages) {
        sorted_pages.push([page, pages[page]])
    }

    sorted_pages.sort((a, b) => {
        return a[1] - b[1]
    })
    return sorted_pages
}

export { printReport }

import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

async function main() {
    const argv = process.argv.slice(2);
    if (argv.length < 1) {
        console.log('no website provided')
        return
    } else if (argv.length > 1) {
        console.log('too many arguments provided')
        return
    }
    const baseURL = argv[0]
    console.log(`The crawler is starting at ${baseURL}...`)
    const pages = await crawlPage(baseURL, baseURL)
    printReport(pages)
}

main()

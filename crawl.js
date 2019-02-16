const cheerio = require('cheerio')
const axios = require('axios')

// Returns set of distinct URLs found in a given URL.

/* This function:
   1. Fetches the contents from the crawl URL
   2. Finds a list of URLs in the HTML document.
   3. Filters the list for valid URLs.
   4. Return distinct set of URLs
*/

module.exports.crawl = async (crawlUrl) => {
  const response = await axios.get(crawlUrl)
  const foundURLs = [] // Discovered URLs from the page

  console.log('crawl started: ', crawlUrl)

  const $ = cheerio.load(response.data, {
    withDomLvl1: true,
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: false
  })

  // Iterate through all hrefs on the crawled page
  $('a').each((i, link) => {
    const linkUrl = $(link).attr('href')
    console.log(i, linkUrl)

    // Validate URL
    const validatedURL = validateURL(crawlUrl, linkUrl)
    if (validatedURL) {
      console.log('Valid foundURL: ', validatedURL)
      foundURLs.push(validatedURL)
    }
  })

  // Remove the duplicates
  return new Set(foundURLs)
}

// Takes original crawled URL and link URL.
// Returns validated URL or undefined if not valid.

const validateURL = (crawlUrl, linkUrl) => {
  let foundUrl = ''
  if (!linkUrl) return // Remove nulls/empty hrefs
  if (linkUrl.charAt(0) === '#') return // Remove anchor hrefs

  const parsedCrawlUrl = new URL(crawlUrl)
  const parsedUrl = new URL(linkUrl)

  // Relative URLs/hashed URLs, etc.
  if (!parsedUrl.protocol) {
    // Remove hashed URLs (#chat, etc)
    if (!parsedUrl.path) return

    // Build absolute URL - some relative URLs don't start with a slash, so add one
    const paddedSlash = parsedUrl.path.charAt(0) === '/' ? '' : '/'
    foundUrl = `${parsedCrawlUrl.protocol}//${parsedCrawlUrl.host}${paddedSlash}${parsedUrl.pathname}`
  } else {
    // Ensure http/https
    if (!parsedUrl.protocol.includes('http')) return

    // Check same domain
    if (parsedUrl.host !== parsedCrawlUrl.host) return
    foundUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`
  }

  // Remove self references
  if (foundUrl === crawlUrl) return
  return foundUrl
}

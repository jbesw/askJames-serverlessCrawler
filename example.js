

// EXAMPLE CODE //

/* Shows the traditional way to use the Website Scraper NPM package to crawl a website */

const crawl = require('website-scraper')
const myTargetSite = 'https://myTargetSite.com/'

const crawlSite = async () => {
  return new Promise(async (resolve, reject) => {
    let URLs = []

    let options = {

      urls: myTargetSite,
      directory: '/temp/indev',
      prettifyUrls: true,
      recursive: true,
      filenameGenerator: 'bySiteStructure',
      urlFilter: (url) => url.startsWith(myTargetSite),
      onResourceSaved: (resource) => URLs.push(resource.url),
      onResourceError: (resource, err) => console.error(`${resource}: ${err}`),
      requestConcurrency: 10
    }

    console.log('Starting crawl')
    console.time('crawlSite')

    try {
      const result = await crawl(options)
      console.timeEnd('crawlSite')
      console.log('# of URLs:', URLs)
      resolve(result)
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

crawlSite()

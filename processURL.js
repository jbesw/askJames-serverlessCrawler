const { flushToDynamoDB } = require('./dynamodb')
const { crawl } = require('./crawl')
const MAX_BUFFER_SIZE = 25

const processURL = async (URL) => {
  let urlBuffer = []

  // Fetch the URLs in the URL
  const URLs = await crawl(URL)

  // Write the URLs to DynamoDB as batches

  URLs.forEach((item) => {
    urlBuffer.push({
      PutRequest: {
        Item: {
          url: { S: item }
        }
      }
    })
    if (urlBuffer.length === MAX_BUFFER_SIZE) {
      flushToDynamoDB(urlBuffer)
      urlBuffer = []
    }
  })
  // Flush any remaining items
  if (urlBuffer.length > 0) flushToDynamoDB(urlBuffer)
  console.log(`URLs found: ${URLs.size}`)
}

module.exports = { processURL }

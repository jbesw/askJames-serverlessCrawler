const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION || 'us-east-1' })
const ddb = new AWS.DynamoDB()

// Takes array of params and flushes to DynamoDB using the BatchWriteItem operation.

/* This implementation takes advantage of the fact that items already in the table
   do not cause errors or cause the stream event to be fired.
*/

module.exports.flushToDynamoDB = async (params) => {
  const batchParams = {
    RequestItems: {
      'crawler': params
    }
  }

  console.log('flushToDynamoDB: ', batchParams)

  return new Promise((resolve, reject) => {
    ddb.batchWriteItem(batchParams, function (err, data) {
      if (err) {
        console.error('flushToDynamoDB', err)
        reject(err)
      } else {
        console.log('flushToDynamoDB: ', data)
        resolve(data)
      }
    })
  })
}

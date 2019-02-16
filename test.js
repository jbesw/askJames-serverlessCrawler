const { streamUpdated } = require('./handler.js')

const main = async () => {
  await streamUpdated(require('./testEvent.json'))
}

main()

const server = require('./lib/server')
const db = require('./lib/db')
const IntegrationTest = require('./lib/jobs/integration-test')

db.connect()
  .then(() => db.migrate())
  .then(() => {
    const test = new IntegrationTest()
    test.run()
  })
  .then(() => server.start())
  .catch(e => { console.log("Uncaught error:", e.message, e.stack) })

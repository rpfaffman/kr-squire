const server = require('./lib/server')
const db = require('./lib/db')
const TestRunner = require('./lib/jobs/test-runner')

db.connect()
  .then(() => db.migrate())
  .then(() => {
    // const files = [ '/lib/tests/nightmare.js' ]
    // const files = [ '/lib/tests/zombie.js' ]
    const files = [ '/lib/tests/phantom.js' ]
    const job = new TestRunner({ files })
    job.run()
  })
  .then(() => server.start())
  .catch(e => { console.log("Uncaught error:", e.message, e.stack) })

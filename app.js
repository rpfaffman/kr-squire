const server = require('./lib/server')
const db = require('./lib/db')
const TestRunner = require('./lib/jobs/test-runner')

const start = async function() {
  try {
    await db.connect()
    await db.migrate()
    const job = new TestRunner({ files: [ '/lib/tests/phantom.js' ] })
    job.run()
    server.start()
  } catch(err) {
    console.log("Uncaught error:", err.message, err.stack)
  }
}

start()

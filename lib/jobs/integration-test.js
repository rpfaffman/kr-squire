const Mocha = require('mocha')
const db = require('../db')
const Env = require('../../env')

CONFIG = { timeout: Env.TEST_TIMEOUT }

class IntegrationTest {
  run() {
    const mocha = new Mocha(CONFIG)
    const path = process.cwd() + '/lib/jobs/integration-test/tests.js'
    mocha.addFile(path)

    mocha.run((failures) => {
      console.log('Number of failures found:', failures)
    }, CONFIG)
      .on('fail', (test, err) => {
        const { title, duration, err: testErr } = test
        const expandedTitle = `${test.parent.title} > ${title}`
        const failure = Object.assign({ title: expandedTitle, duration }, testErr)
        db.failures.insert(failure, {}, (err, results) => {
          console.log('err is:', err)
          console.log('results are:', results)
        })
      })
  }
}

module.exports = IntegrationTest

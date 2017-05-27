const Mocha = require('mocha')
const db = require('../db')
const Env = require('../../env')

CONFIG = { timeout: Env.TEST_TIMEOUT }

class TestRunner {
  constructor({ files = [] }) {
    this.files = files
  }

  run() {
    const mocha = new Mocha(CONFIG)

    this.files.forEach((file) => {
      const path = process.cwd() + file
      mocha.addFile(path)
    })

    mocha.run((failures) => {
      console.log('Number of failures found:', failures)
    }, CONFIG)
      .on('fail', (test, err) => {
        const { title, duration, err: testErr } = test
        const expandedTitle = `${test.parent.title} > ${title}`
        const failure = Object.assign({ title: expandedTitle, duration }, testErr)
        db.failures.insert(failure, {}, (err, results) => {
          console.log('err is:', err)
        })
      })
  }
}

module.exports = TestRunner

const defaults = {
  DB_URI: 'mongodb://localhost:27017/squire',
  HEADLESS: false,
  KR_TEST_URI: 'http://firetv.vevo.com',
  PORT: 3000,
  TEST_TIMEOUT: 120000,
  VEVO_TEST_EMAIL: 'vevo.test.samsung@gmail.com',
  VEVO_TEST_PASSWORD: 'asdfasdf'
}

module.exports = Object.assign(defaults, process.env)

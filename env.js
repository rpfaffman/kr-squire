const defaults = {
  DB_URI: 'mongodb://localhost:27017/squire',
  HEADLESS: false,
  KR_TEST_URI: 'http://firetv.vevo.com',
  PORT: 3000,
  TEST_TIMEOUT: 120000,
  VEVO_ACTIVATION_URI: 'https://vevo.com/activate/firetv',
  VEVO_TEST_EMAIL: 'tv.test.1@gmail.com',
  VEVO_TEST_PASSWORD: 'asdfasdf'
}

module.exports = Object.assign(defaults, process.env)

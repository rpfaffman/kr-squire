const phantom = require('phantom')
const { expect } = require('chai')
const Dom = require('../phantom/dom')
const fs = require('fs')

const {
  KR_TEST_URI,
  VEVO_ACTIVATION_URI,
  VEVO_TEST_EMAIL,
  VEVO_TEST_PASSWORD
} = require('../../env')

const CACHE_DIR = 'testing'

const clearCache = () => {
  return new Promise((res, rej) => {
    fs.readdir(CACHE_DIR, (err, files) => {
      if (err) rej(err)
      files.forEach(f => {
        console.log('removing file', f)
        fs.unlink(`${CACHE_DIR}/` + f, (err) => {
          if (err) rej(err)
        })
      })
      res()
    })
  })
}

describe('navigating to the page', () => {
  let dom, instance, page

  before(async function() {
    await clearCache() // remove all cached files beforehand
    instance = await phantom.create([ `--local-storage-path=${CACHE_DIR}` ])
    page = await instance.createPage()
    dom = new Dom(page, { timeout: 2000 })
  })

  after(() => {
    authDom.render()
    dom.render()
  })

  describe('activation', () => {
    let deviceCode

    describe('retrieving device code from knight rider', () => {
      it('should display the activation code', async function() {
        await page.open(KR_TEST_URI)
        await dom.exists('.btn-default.active')
        await dom.pressEnter()
        deviceCode = await dom.content('.step-three .bold:nth-child(2)')
        await expect(deviceCode.length).to.eq(9)
      })
    })

    describe('login and activation on vevo.com', () => {
      let authPage, authDom

      before(async function() {
        authPage = await instance.createPage()
        authDom = new Dom(authPage)
      })

      it('should successfully log in', async function() {
        await authPage.open(VEVO_ACTIVATION_URI)
        await authDom.click('.social-btn.email')
        await authDom.type('#email-input', VEVO_TEST_EMAIL)
        await authDom.click('.main-button.position-email')
        await authDom.type('#password-input', VEVO_TEST_PASSWORD)
        await authDom.click('.main-button')
        const header = await authDom.content('#activation-container .title')
        expect(header).to.eq('YOU ARE LOGGED IN!')
      })

      it('should successfully activate the device', async function() {
        await authDom.type('form input', deviceCode)
        await authDom.click('form button[type=submit]')
        const header = await authDom.content('#activation-container .title')
        expect(header).to.eq('Success!')
      })

      it.skip('should log the user into knight rider', async function() {
      })
    })
  })
})

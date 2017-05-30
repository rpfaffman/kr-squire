const phantom = require('phantom')
const { expect } = require('chai')
const Dom = require('../phantom/dom')

const {
  KR_TEST_URI,
  VEVO_ACTIVATION_URI,
  VEVO_TEST_EMAIL,
  VEVO_TEST_PASSWORD
} = require('../../env')

describe('navigating to the page', () => {
  let dom, instance, page

  before(async function() {
    instance = await phantom.create()
    page = await instance.createPage()
    dom = new Dom(page)
  })

  describe('activation', () => {
    let authPage, authDom

    before(async function() {
      authPage = await instance.createPage()
      authDom = new Dom(authPage)
    })

    it('should forward to homepage on successful activation', async function() {
      await authPage.open(VEVO_ACTIVATION_URI)
      await authDom.click('.social-btn.email')
      await authDom.type('#email-input', VEVO_TEST_EMAIL)
      authDom.render('email')
      await authDom.click('.main-button.position-email')
      await authDom.type('#password-input', VEVO_TEST_PASSWORD)
      authDom.render('password')
      await authDom.click('.main-button')
      authDom.render('submission')
      const header = await authDom.content('#activation-container .title')
      expect(header).to.eq('YOU ARE LOGGED IN!')
    })
  })
})

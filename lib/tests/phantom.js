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

  after(async function() {
    console.log('taking a screenshot')
    dom.render('failure')
    await instance.exit()
  })

  it('passes', async function() {
    const status = await page.open(KR_TEST_URI)
    expect(status).to.eq('success')
  })

  describe.only('activation', () => {
    it('should forward to homepage on successful activation', async function() {
      await page.open(VEVO_ACTIVATION_URI)
      await dom.click('.social-btn.email')
      await dom.click('#email-input')
      await dom.typeManually(VEVO_TEST_EMAIL)
      dom.render('email')
      await dom.click('.main-button.position-email')
      console.log('about to type password')
      await dom.type('#password-input', VEVO_TEST_PASSWORD)
      dom.render('password')
      console.log('about to click submit')
      await dom.click('button.main-button')
      dom.render('submission')
      const header = await dom.content('#activation-container .title')
      expect(header).to.eq('YOU ARE LOGGED IN!')
    })
  })
})

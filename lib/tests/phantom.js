const phantom = require('phantom')
const { expect } = require('chai')
const { KR_TEST_URI, VEVO_TEST_EMAIL, VEVO_TEST_PASSWORD  } = require('../../env')

describe('navigating to the page', () => {
  let instance, page

  before(async function() {
    instance = await phantom.create()
    page = await instance.createPage()
  })

  after(async function() {
    instance.exit()
  })

  it('passes', async function() {
    const status = await page.open("http://www.google.com")
    expect(status).to.eq('success')
  })
})

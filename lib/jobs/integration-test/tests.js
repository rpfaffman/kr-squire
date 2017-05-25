const { expect } = require('chai')
const Nightmare = require('nightmare')
// const Xvfb = require('xvfb')
const { HEADLESS, KR_TEST_URI, VEVO_TEST_EMAIL, VEVO_TEST_PASSWORD  } = require('../../../env')

// const xvfb = new Xvfb()

// const startXvfb = () => {
//   return new Promise((res, rej) => {
//     xvfb.start((err, xvfbProcess) => {
//       if (err) console.log(`XVFB: There was an error starting process: ${err.message}`); return rej(err)
//       console.log(`XVFB: Successfully started.`); res(xvfbProcess)
//     })
//   })
// }

// const stopXvfb = () => {
//   xvfb.stop((err) => {
//     if (err) return console.log(`XVFB: There was an error stopping process: ${err.message}`)
//     console.log(`XVFB: Successfully stopped.`)
//   })
// }

const activateDevice = code => {
  return new Promise((res, rej) => {
    new Nightmare({ show: !HEADLESS, typeInterval: 10 })
      .goto('http://vevo.com/activate')
      .wait('.login-buttons').wait(1000)
      .click('.social-btn.email')
      .type('input#email-input', VEVO_TEST_EMAIL)
      .click('button.main-button.position-email')
      .type('input#password-input', VEVO_TEST_PASSWORD)
      .click('button[type=submit].main-button')
      .wait('#activation-container').wait(1000)
      .type('#activation-container input[type=text]', code)
      .click('button[type=submit]')
      .wait(() => document.querySelector('.title').textContent === 'Success!')
      .end()
      .then(() => res())
      .catch(e => rej(e))
  })
}

describe('When visiting the homepage', () => {
  const client = new Nightmare({ show: !HEADLESS })

  // before(done => {
  //   startXvfb().then(() => done())
  // })

  after(done => {
      // .then(() => stopXvfb())
    client.end()
      .then(() => done())
  })

  describe('onboarding', () => {
    before(done => {
      client
        .goto(KR_TEST_URI)
        .wait('#appContainer')
        .then(() => done())
        .catch(done)
    })

    describe('initial screen', () => {
      it('should render the initial screen', done => {
        client
          .wait('#content-container')
          .evaluate(() => document.querySelector('#content-container').textContent)
          .then(text => {
            expect(text).to.include('OFFICIAL MUSIC VIDEOS')
            expect(text).to.include('ARTISTS YOU LOVE')
            done()
          })
          .catch(done)
      })
    })

    describe('activation', () => {
      it('should render the activation screen when the user clicks continue', done => {
        client
          .type('body', '\u000d') // hit enter
          .evaluate(() => document.querySelector('#activation .step-three').textContent)
          .then(text => {
            const activationCode = text.split('code:')[1]
            return activateDevice(activationCode)
          })
          .then(() => {
            client
              .wait('.homepage')
              .then(() => done())
          })
          .catch(done)
      })
    })
  })

  describe('reels', () => {
    before(done => {
      client.wait('.reel').then(() => done()).catch(done)
    })

    it('should have one active reel', done => {
      client
        .evaluate(() => document.querySelectorAll('.reel.active').length)
        .then(activeReelCount => {
          expect(activeReelCount).to.eq(1)
          done()
        })
        .catch(done)
    })

    it('should render the correct reels', done => {
      client
        .evaluate(() => Array.map(document.querySelectorAll('.reel'), function(reel) {
          const headerText = reel.querySelector('.header-text')
          return headerText && headerText.textContent
        }))
        .then(reelTitles => {
          expect(reelTitles).to.eql([
            null, // Carousel has no title
            'Watch Party',
            'Feed',
            'New Releases',
            'Top Videos',
            'Genres',
            'My Playlists',
            'My Videos',
            'My Artists',
            'History',
            'Search & Settings',
            'fail me'
          ])
          done()
        })
        .catch(done)
    })

    describe('group watch', () => {
      describe('starting a party', done => {
        it('should successfully create a new party', done => {
          client
            .click('.reel .group-watch-card')
            .then(() => done())
            .catch(done)
        })
      })
    })
  })
})

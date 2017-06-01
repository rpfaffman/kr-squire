CHECK_INTERVAL = 50

class Dom {
  constructor(page, { timeout = 5000 } = {}) {
    this.page = page
    this.timeout = timeout
  }

  click(selector) {
    return this._wait(`function() {
      const el = document.querySelector('${selector}')
      if (el) {
        el.click()
        return true
      } else {
        return false
      }
    }`)
  }

  content(selector = 'body') {
    return this._wait(`function() {
      const el = document.querySelector('${selector}')
      if (el) {
        return el.textContent
      } else {
        return false
      }
    }`)
  }

  exists(selector) {
    return this._wait(`function() {
      return document.querySelectorAll('${selector}').length
    }`)
  }

  pressEnter(selector = 'body') {
    return new Promise(async function(res, rej) {
      try {
        await this.exists(selector)
        await this.page.evaluate(`function() {
          document.querySelector('${selector}').focus()
          const eventObj = document.createEvent("Event")
          eventObj.initEvent("keyup", true, true)
          eventObj.keyCode = 13
          eventObj.which = 13
          document.dispatchEvent(eventObj)
        }`)
        res()
      } catch(e) { rej(e) }
    }.bind(this))
  }

  render(filename = '') {
    this.page.render(`screenshots/${Date.now()}-${filename}.png`)
  }

  type(selector, str) {
    return new Promise(async function(res, rej) {
      try {
        await this.exists(selector)
        await this.page.evaluate(`function() {
          document.querySelector('${selector}').focus()
        }`)
        str.split('').forEach(c => {
          this.page.sendEvent('keypress', c)
        })
        res()
      } catch(e) { rej(e) }
    }.bind(this))
  }


  // private

  _wait(fnStr) {
    const maxAttempts = Math.floor(this.timeout / CHECK_INTERVAL)
    return new Promise((res, rej) => {
      let attempts = 1

      const attempt = async function() {
        const check = await this.page.evaluate(fnStr)
        if (attempts >= maxAttempts) return rej(new Error(`[wait] Timeout of ${this.timeout} ms reached.`))
        check ? res(check) : attempts++; setTimeout(attempt, CHECK_INTERVAL)
      }.bind(this)

      attempt()
    })
  }
}

module.exports = Dom

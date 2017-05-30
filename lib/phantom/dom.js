CHECK_INTERVAL = 50
MAX_ATTEMPTS = 40

class Dom {
  constructor(page) {
    this.page = page
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

  render(filename) {
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
    return new Promise((res, rej) => {
      let attempts = 1

      const attempt = async function() {
        const check = await this.page.evaluate(fnStr)
        if (attempts >= MAX_ATTEMPTS) return rej(new Error(`[wait] Timeout of ${CHECK_INTERVAL * MAX_ATTEMPTS} ms reached.`))
        check ? res(check) : attempts++; setTimeout(attempt, CHECK_INTERVAL)
      }.bind(this)

      attempt()
    })
  }
}

module.exports = Dom

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
    this.page.render(`screenshots/${filename}.png`)
  }

  typeManually(str) {
    str.split('').forEach(function(c) {
      console.log('attempting to type', c)
      this.page.sendEvent('keypress', this.page.event.key[c])
    }.bind(this))
  }

  type(selector, input) {
    return this._wait(`function() {
      const el = document.querySelector('${selector}')
      if (el) {
        el.value = '${input}'
        return true
      } else {
        return false
      }
    }`)
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
    // return new Promise((res, rej) => {
    //   let interval, timeout

    //   interval = setInterval(async function() {
    //     let check
    //     check = await this.page.evaluate(fnStr)
    //     if (check) {
    //       console.log('found')
    //       clearInterval(interval)
    //       clearTimeout(timeout)
    //       res(check)
    //     }
    //   }.bind(this), CHECK_INTERVAL)

    //   timeout = setTimeout(() => {
    //     clearInterval(interval)
    //     rej(new Error(`[wait] Timeout of ${CHECK_TIMEOUT} ms reached.`))
    //   }, CHECK_TIMEOUT)
    // })
  }
}

module.exports = Dom

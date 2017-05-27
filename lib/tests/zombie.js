const Browser = require('zombie');

Browser.extend((browser) => {
  console.log('console log in browser is', browser.console.log)
  browser.console.log = (arguments) => {
    console.log('JFDKLFDJKSFSD')
  }
  JSON.stringify(console.log(Object.keys(browser)), null, 2)
  console.log(browser.runScripts)
  console.log(browser.site)
  browser.matchMedia = () => {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    }
  }
})

// We're going to make requests to http://example.com/signup
// Which will be routed to our test server localhost:3000
// Browser.localhost('example.com', 3000);

// global.matchMedia = global.matchMedia || function() {
//     return {
//         matches : false,
//         addListener : function() {},
//         removeListener: function() {}
//     };
// };

describe('User visits signup page', function() {
  const browser = new Browser();

  before(function(done) {
    browser.visit('https://firetv.vevo.com', done);
  });

  describe('goes to the site', function() {
    before(function(done) {
      setTimeout(done, 2000)
    });

    it('should be successful', function() {
      browser.assert.success();
    });
  });
});

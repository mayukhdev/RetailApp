/* Set interval incase of different currencies
  Uncomment function "setinterval in line 45"
*/

var superagent = require('superagent');
var _ = require('underscore');

// function depend on the Config service from `dependencies.js`
// and use Config.openExchangeRatesKey instead of an environment variable.
module.exports = function(Config) {
  var url = 'http://openexchangerates.org/api/latest.json?app_id=' +
    Config.openExchangeRatesKey;
  var rates = {
    USD: 1,
    INR: 65
  };

  var ping = function(callback) {
    superagent.get(url, function(error, res) {
      // Ignore if error,try again in an hour
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }

      var results;
      try {
        var results = JSON.parse(res.text);
        _.each(results.rates || {}, function(value, key) {
          rates[key] = value;
        });
        if (callback) {
          callback(null, rates);
        }
      } catch (e) {
        if (callback) {
          callback(e);
        }
      }
    });
  };

  setInterval(ping, 5 * 60 * 60 * 1000); // Repeat 5 hours (time in ms)

  // Return the current state of the exchange rates
  var ret = function() {
    return rates;
  };
  ret.ping = ping;
  return ret;
};

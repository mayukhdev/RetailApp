var fs = require('fs');
var fx = require('./fx'); //Incase of curreny in USD uncomment and line 13
var Stripe = require('stripe');

module.exports = function(wagner) {

  // Make Stripe depend on the Config service and use its `stripeKey`
  // property to get the Stripe API key.
  wagner.factory('Stripe', function(Config) {
    return Stripe(Config.stripeKey);
  });

  wagner.factory('fx', fx);

  wagner.factory('Config', function() {
    return JSON.parse(fs.readFileSync('./Database/config.json').toString());
  });
};

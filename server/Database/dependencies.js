var fs = require('fs');

module.exports = function(wagner) {

  wagner.factory('Config', function() {
    return JSON.parse(fs.readFileSync('./Database/config.json').toString());
  });

  wagner.factory('ownerMail', function(Config) {
    return Config.ownerMail;
  });

  wagner.factory('mailgunApi', function(Config) {
    return Config.mailgunApi;
  });

  wagner.factory('mailgunDomain', function(Config) {
    return Config.mailgunDomain;
  });

  wagner.factory('mailgunFrom', function(Config) {
    return Config.mailgunFrom;
  });

};

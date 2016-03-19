var mongoose = require('mongoose');
//var _ = require('underscore');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/test');

  wagner.factory('db', function() {
    return mongoose;
  });

  var Category =
    mongoose.model('Category', require('./Database/category'), 'categories');
  var User =
    mongoose.model('User', require('./Database/user'), 'users');

  var Owner =
      mongoose.model('Owner', require('./Database/owner'), 'owner');

  var models = {
    Category: Category,
    User: User
    Owner: Owner
  };

  wagner.factory('Owner', function() {
    return Owner;
  });

  wagner.factory('Category', function() {
    return Category;
  });

  wagner.factory('User', function() {
    return User;
  });

  // _.each(models, function(value, key) {
  //   wagner.factory(key, function() {
  //     return value;
  //   });
  // });

  wagner.factory('Product', require('./Database/product'));

  return models;
};

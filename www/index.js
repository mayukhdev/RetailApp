// var controllers = require('./controllers');
// var directives = require('./directives');
// var services = require('./services');
// var _ = require('underscore');

// var components = angular.module('retail.components', ['ng']);
//
// _.each(controllers, function(controller, name) {
//   components.controller(name, controller);
// });
//
// _.each(directives, function(directive, name) {
//   components.directive(name, directive);
// });
//
// _.each(services, function(factory, name) {
//   components.factory(name, factory);
// });

var app = angular.module('retail', ['ng', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.
    when('/category/:category', {
      templateUrl: '/templates/category_view.html'
    }).
    when('/checkout', {
      template: '<checkout></checkout>'
    }).
    when('/product/:id', {
      template: '<product-details></product-details>'
    }).
    when('/', {
      template: '<search-bar></search-bar>'
    });

// var app = angular.module('retail', ['retail.components', 'ngRoute']);

});

window.fbAsyncInit = function() {
FB.init({
  appId      : '1758463314386619',
  xfbml      : true,
  version    : 'v2.6'
});
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

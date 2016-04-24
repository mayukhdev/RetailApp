//var status = require('http-status');

app.factory('$user' , function($http) {
  var s = {};

  var api_link = "/api/v1";

  s.loadUser = function() {
    $http.get(api_link +'/me').
      success(function(data) {
        s.user = data.user;
        console.log(s);
      }).
      error(function(data, status) {
        if (status === 403) {
          s.user = null;
        }
      });
  };

  s.loadUser();

  setInterval(s.loadUser, 60 * 60 * 1000);

  return s;
});

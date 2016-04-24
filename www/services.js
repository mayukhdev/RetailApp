//var status = require('http-status');

app.service('$user' , function($http) {
  var s = {};

  var api_link = "";
  // var api_link = (function getApiKey(){
  //   return '/api/v1/' + require('fs').readfile('./server/key','utf8',function(err,data){
  //     if(err) console.error(err);
  //     console.log(data);
  //     return data;
  //   });
  //  })()

  s.loadUser = function() {
    $http.
      get(api_link +'/me').
      success(function(data) {
        s.user = data.user;
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

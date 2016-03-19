var fs = require('fs');
var crypto = require('crypto');

module.exports = function(n){
  var str = (function (){
    var possible = "~!@#$%^&*()_+=-{}[];:<>,.?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var text = "";
    for(var i = 0;i<n;i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  })();
  var hash = crypto.createHash('md5').update(str).digest('hex');

  fs.writeFile("./key", hash, function(err) {
      if(err) {
          throw err;
      }
      //console.log("The file was saved!");
  });

  return hash;

}

// fs.readFile('./.key', 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log(data);
// });

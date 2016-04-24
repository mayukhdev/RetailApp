var express = require('express');
var wagner = require('wagner-core');
var path = require('path');

var app = express();

//Create API key
var key = "";
//var key = require('./apikey')(15);

require('./models')(wagner);
require('./Database/dependencies')(wagner);

wagner.invoke(require('./Database/auth'), { app: app });

var api_url =  '/api/v1/' + key;

app.use(api_url, require('./api')(wagner));

var rootpath = path.normalize(__dirname + '/../');
console.log("Static: " + rootpath + 'www');

app.use(express.static(rootpath + '/www'));

app.listen(process.argv[2] || 3000);
console.log('Listening on port 3000!');

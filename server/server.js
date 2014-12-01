// external modules

var newrelic = require('newrelic');

// https://github.com/flatiron/nconf
var nconf = require('nconf');
var environment =  process.env.NODE_ENV || 'development'; // set port with $PORT environment variable
nconf.argv().env().file({file: './server/config/environments/' + environment + '.json'});

var express  = require('express');
var cookieParser = require('cookie-parser');

// internal modules
var db       = require('./config/db.js'); // for the db config, this is ignored by git

var app = express();
app.use(cookieParser(nconf.get('FLANNEL_SECRET')));

app.publicRoot = __dirname + '/../public'; // useful for serving files.
app.settings.nconf = nconf;
var port =  app.settings.nconf.get('PORT') || 8100; // set port with $PORT environment variable

app.listen(port);

require('./routes/appRoutes.js')(app);
// require('./routes/pathRoutes.js')(app);
require('./routes/authorizationRoutes.js')(app);

app.use(express.static(__dirname + '/../public'));

module.exports = app;
console.log('now serving on port: ', port);

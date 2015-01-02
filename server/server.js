/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  SERVER
  defines and runs the app on the server

  determines the environment, the port, the database, 
  the routes, cookies, the root directory (public)

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

// external modules
var newrelic     = require('newrelic'),
    nconf        = require('nconf'), // https://github.com/flatiron/nconf
    express      = require('express'),
    cookieParser = require('cookie-parser'),
    environment  = process.env.NODE_ENV || 'development';

nconf.argv().env().file({file: './server/config/environments/' + environment + '.json'});

// internal modules
var db, app, port;

db = require('./config/db.js'); // for the db config, this is ignored by git
app = express(); // the app used throughout the server

app.use(cookieParser(nconf.get('FLANNEL_SECRET')));
app.publicRoot = __dirname + '/../public'; // useful for serving files.

app.settings.nconf = nconf;
port = app.settings.nconf.get('PORT') || 8100; // set port with $PORT environment variable
app.listen(port);

// load the express routes
require('./routes/appRoutes.js')(app);
// require('./routes/pathRoutes.js')(app);
require('./routes/authorizationRoutes.js')(app);

app.use(express.static(app.publicRoot));

module.exports = app;
console.log('now serving on port: ', port);

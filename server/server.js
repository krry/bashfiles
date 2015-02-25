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
    compression  = require('compression'),
    expValid     = require('express-validator'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    env          = process.env.NODE_ENV || 'development',
    morgan       = require('morgan'),
    logger       = require('./logger'), // logger
    // db,
    portfinder   = require('portfinder'),
    app,
    port,
    publicFolder,
    oneYear;

nconf.argv().env().file({file: './server/config/environments/' + env + '.json'});

// db = require('./config/db.js'); // for the db config, this is ignored by git
app = express(); // the app used throughout the server

app.publicRoot = __dirname + '/../public';
oneYear = 1*365.25*24*60*60*1000; // 1 yr = 31557600000ms

app.use(cookieParser(nconf.get('FLANNEL_SECRET')));
app.use(express.static(app.publicRoot, {maxAge: oneYear}));
app.settings.nconf = nconf;

portfinder.getPort(function (err, port) {
  appPort = app.settings.nconf.get('PORT') || 8100;

  app.listen(appPort, function() {
    logger.info('now serving on port: ', appPort);
  });

  logger.debug('enabling GZip compression');
  app.use(compression({ threshold: 512 }));

  logger.debug('setting parse urlencoded request bodies into req.body');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(expValid());

  // load the express routes
  require('./routes/appRoutes.js')(app);
  // require('./routes/pathRoutes.js')(app);
  require('./routes/authorizationRoutes.js')(app);

  // TODO: determine why requests aren't being logged via Winston
  logger.debug("starting logger, overriding morgan");
  app.use(morgan("combined", { "stream": logger.stream }));

  module.exports = app;
});

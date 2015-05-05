/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  SERVER
  defines and runs the app on the server

  determines the environment, the port, the database,
  the routes, cookies, the root directory (public)

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

// external modules
var newrelic     = require('newrelic'),
    nconf        = require('nconf'), // https://github.com/flatiron/nconf
    fs           = require('fs'),
    express      = require('express'),
    compress  = require('compression'),
    browserSync  = require('browser-sync'),
    expValid     = require('express-validator'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    env          = process.env.NODE_ENV || 'development',
    morgan       = require('morgan'),
    logger       = require('./logger'), // logger
    portfinder   = require('portfinder'),
    app,
    port,
    publicFolder,
    oneYear;

console.log('env on server is:', process.env.NODE_ENV);
nconf.argv().env().file({file: './server/config/environments/' + env + '.json'});

app = express(); // the app used throughout the server

app.publicRoot = __dirname + '/../public';
oneYear = 1*365.25*24*60*60*1000; // 1 yr = 31557600000ms

app.settings.nconf = nconf;

// Redirect all http traffic to https
// Must be set before we define the index, static assets, and individual routes
if (app.settings.nconf.get('SSL_ENABLED')) {
  app.use(function(req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    } else {
      return next();
    }
  });
}

app.use(cookieParser(nconf.get('FLANNEL_SECRET')));
app.get('/', require('./controllers/appController.js')(app).index);
app.use(express.static(app.publicRoot, {maxAge: oneYear}));
app.settings.nconf = nconf;

portfinder.getPort(function (err, port) {
  if (env === "development") {
    // TODO: determine why requests aren't being logged via Winston
    app.use(morgan("combined", { "stream": logger.stream }));
    logger.debug("overriding morgan with logger");
    logger.debug('enabling GZip compression');
    logger.debug('setting parse urlencoded request bodies into req.body');
  }

  appPort = app.settings.nconf.get('PORT') || 8100;
  app.listen(appPort, listening);
  app.use(compress({ threshold: 512 }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(expValid());

  // load the express routes
  require('./routes/appRoutes.js')(app);
  require('./routes/authorizationRoutes.js')(app);

  // catches all other routes, ie 404.
  app.use(function(req, res, next) {
    res.status(404).sendFile('file_not_found.html', {root: app.publicRoot});
  });

  module.exports = app;
});

function listening () {
  browserSync.use({
    hooks: {
      'client:js': fs.readFileSync('./gulp/util/browserSyncReloader.js', 'utf-8')
    }
  });

  if (env === "development") {
    browserSync({
      proxy: 'localhost:' + appPort,
      files: ['./public/**/*.*'],
      open: false,
      port: appPort,
      injectChanges: true
    });
    logger.info('now serving on port: ', appPort);
  }
}

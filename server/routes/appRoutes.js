
module.exports = function(app) {
  var appController = require('../controllers/appController.js')(app),
      proxy         = require('express-http-proxy'),
      env           = process.env.NODE_ENV || 'development',
      conf          = require('../config/environments/' + env + '.json');

  app.get('/flannel/', appController.index );
  app.get('/jwt', appController.jwt );

  // Proxy to SolarCity APIs
  app.use(conf.CLIENT.API_ROOT, proxy(conf.API, {
    forwardPath: function(req, res) {
      return require('url').parse(req.url).path;
    }
  }));
};

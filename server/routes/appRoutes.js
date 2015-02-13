
module.exports = function(app) {
  var appController = require('../controllers/appController.js')(app),
      proxy         = require('express-http-proxy'),
      env           = process.env.NODE_ENV || 'development',
      conf          = require('../config/environments/' + env + '.json'),
      proxySettings;

  proxySettings = {
    forwardPath: function(req, res) {
      return require('url').parse(req.url).path;
    }
  };

  app.get('/flannel/', appController.index );
  app.get('/jwt', appController.jwt );

  app.use(conf.CLIENT.SOLAR_WORKS_ROOT, proxy(conf.SOLAR_WORKS_ROOT, proxySettings));
  app.use(conf.CLIENT.GSA_ROOT, proxy(conf.GSA_ROOT, proxySettings));
  app.use(conf.CLIENT.NEAR_ME_ROOT, proxy(conf.NEAR_ME_ROOT, proxySettings));
};

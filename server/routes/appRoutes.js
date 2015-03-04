
module.exports = function(app) {
  var appController   = require('../controllers/appController.js')(app),
      proxyController = require('../controllers/proxyController.js')(app),
      salesForceController = require('../controllers/salesForceController.js')(app),
      env             = process.env.NODE_ENV || 'development',
      conf            = require('../config/environments/' + env + '.json');

  app.get('/flannel/', appController.index );
  app.get('/jwt', appController.jwt );

  app.post(conf.CLIENT.SFLEAD_API, salesForceController.addEditLead);

  app.get(conf.CLIENT.UTILITIES_API, proxyController.utilities);
  app.get(conf.CLIENT.WAREHOUSE_API, proxyController.warehouses);
  app.get(conf.CLIENT.RATES_API, proxyController.rates);
  app.post(conf.CLIENT.CREDIT_CHECK_API, proxyController.creditCheck);
  app.post(conf.CLIENT.CONTACT_API, proxyController.contact);
  app.get(conf.CLIENT.NEAR_ME_API, proxyController.nearMe);
  app.get(conf.CLIENT.GSA_API, proxyController.gsa);
  app.post(conf.CLIENT.GSA_API, proxyController.schedule);
  app.post(conf.CLIENT.INSTALLATION_API, proxyController.installation);
};

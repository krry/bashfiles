
module.exports = function(app) {
  var appController = require('../controllers/appController.js')(app);

  app.get('/', appController.index );
  app.get('/token_fix', appController.index ); // HACK: DEV: overriding to fix Invalid Token errors.
  app.get('/jwt', appController.jwt );
};

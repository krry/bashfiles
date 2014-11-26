
module.exports = function(app) {
  var appController = require('../controllers/appController.js')(app);

  app.get('/', appController.index );
  app.get('/jwt', appController.jwt );
};

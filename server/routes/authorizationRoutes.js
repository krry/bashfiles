
module.exports = function(app) {
  var authorizationController = require('../controllers/authorizationController.js')(app);

  app.get('/encodedURLs', authorizationController.encodedURLs);
  app.get('/read_only', authorizationController.read_only);
  app.get('/editable', authorizationController.editable);
};

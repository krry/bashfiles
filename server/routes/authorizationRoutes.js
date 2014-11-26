
module.exports = function(app) {
  var authorizationController = require('../controllers/authorizationController.js')(app);

  console.log(authorizationController);

  app.get('/encodedURLs', authorizationController.encodedURLs);
  app.get('/decodeURL', authorizationController.decodeURL);
};

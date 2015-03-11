var basicAuth = require('basic-auth');
var config = require('./config')
// var error = require('./error')

var unauthorized = function(req, res) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  res.status(401);
  if (req.accepts('html')) {
    res.render('error', {
      title:'Access restricted',
      error: '401 Unauthorized',
      url: req.url
    });
    return;
  }

  if (req.accepts('json')) {
    res.send({
      title:'Access restricted',
      error: '401 Unauthorized',
      url: req.url
    });
  }
};

var basic = function (req, res, next) {
  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(req, res);
  };

  if ( user.name === config.user.basic.username && user.pass === config.user.basic.password ) {
    return next();
  } else {
    return unauthorized(req, res);
  };
};

var secret = function (req, res, next) {
  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(req, res);
  };

  if (user.name === config.user.secret.username && user.pass === config.user.secret.password ) {
    return next();
  } else {
    return unauthorized(req, res);
  };
};

exports.basic = basic;
exports.secret = secret;

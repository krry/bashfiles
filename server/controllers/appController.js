var UUID = require('node-uuid');
var FirebaseTokenGenerator = require("firebase-token-generator");

module.exports = function(app) {

  function generateJwt(uuid) {
    var firebaseSecret = app.settings.nconf.get('FIREBASE_SECRET');
    var tokenGenerator = new FirebaseTokenGenerator(firebaseSecret);
    return tokenGenerator.createToken({uid: uuid, edit: true});
  }

  function index(req, res) {
    var uuid;

    uuid = req.signedCookies.uuid;
    if (uuid != null) {
      // Look up the document by uuid and return that one
      1/0;
    } else {
      uuid = UUID.v1();
      res.cookie('uuid', uuid, { maxAge: 1*365*24*60*60*1000, signed: true });
    }

    res.sendFile('index.html', {root: app.publicRoot});
  }

  function jwt(req, res) {
    var uuid, jwt;

    uuid = req.signedCookies.uuid;
    if (uuid != null) {
      jwt = generateJwt(uuid);
    } else {
      jwt = 'you lying so and so';
    }
    // now we need to pass the jwt to the client

    res.send(jwt);
  }

  return {
    index: index,
    jwt: jwt
  };
};

var UUID = require('node-uuid');
var FirebaseTokenGenerator = require("firebase-token-generator");
var firebaseSecret = app.settings.nconf.get('FIREBASE_SECRET');
var tokenGenerator = new FirebaseTokenGenerator(firebaseSecret);

module.exports = function(app) {

  function generateJwt(uuid) {
    return tokenGenerator.createToken({uuid: uuid, edit: true});
  }

  function index(req, res) {
    var uuid, jwt;

    uuid = req.signedCookies.uuid;
    if (uuid != null) {
      // Look up the document by uuid and return that one
      1/0;
    } else {
      uuid = UUID.v1();
      res.cookie('uuid', uuid, { maxAge: 1*365*24*60*60*1000, signed: true });
    }

    jwt = generateJwt(uuid);
    // now we need to pass the jwt to the client

    res.sendFile('index.html', {root: app.publicRoot});
  }

  return {
    index: index
  };
};

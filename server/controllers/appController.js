var UUID = require('node-uuid');
var FirebaseTokenGenerator = require("firebase-token-generator");
var app = require('../server');

module.exports = function(app) {

  function generateJwt(uuid, edit) {
    if (edit === null) {
      edit = false;
    }
    var firebaseSecret = app.settings.nconf.get('FIREBASE_SECRET');
    var tokenGenerator = new FirebaseTokenGenerator(firebaseSecret);
    return tokenGenerator.createToken({uid: uuid, edit: edit});
  }

  function index(req, res) {
    var uuid;
    uuid = req.signedCookies.uuid;
    // console.log("UUID: " + uuid + ".");
    if (uuid !== null && uuid !== undefined) {
      // Look up the document by uuid and return that one
    } else {
      uuid = UUID.v1();
      res.cookie('uuid', uuid, { maxAge: 1*365*24*60*60*1000, signed: true });
      res.cookie('edit', 1, { maxAge: 1*365*24*60*60*1000, signed: true });
    }

    res.sendFile('index.html', {root: app.publicRoot});
  }

  // Return the jwt (auth token) for this session
  // Uses the signed cookie uuid
  function jwt(req, res) {
    var uuid, edit, _jwt;

    // console.log(req.signedCookies);
    uuid = req.signedCookies.uuid;
    edit = req.signedCookies.edit;
    if (uuid !== null && uuid !== undefined) {
      // console.log("About to set uuid: " + uuid + ".");
      _jwt = generateJwt(uuid, edit);
    } else {
      _jwt = 'you lying so and so';
    }
    // now we need to pass the _jwt to the client
    res.send(_jwt);
  }

  return {
    index: index,
    jwt: jwt
  };
};

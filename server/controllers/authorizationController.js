module.exports = function(app) {

  // http://stackoverflow.com/questions/6953286/node-js-encrypting-data-that-needs-to-be-decrypted
  var crypto = require('crypto');
  var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
  var key = app.settings.nconf.get('FLANNEL_SECRET');
  if (! key) {
    console.log("You must set the FLANNEL_SECRET!!");
  }
  var charset = 'utf8';
  var encoding = 'hex';

  function encodeHash(hash) {
    var hashString = JSON.stringify(hash);
    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(hashString, charset, encoding) + cipher.final(encoding);
    return encrypted;
  }

  function decodeHash(encrypted) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(encrypted, encoding, charset) + decipher.final(charset);
    return JSON.parse(decrypted);
  }

  return {
    encodedURLs: function(req, res) {
      var documentId =   req.query.documentId;
      var email =        req.query.email;
      var readOnlyPath = '/read_only?key=' + encodeHash({documentId: documentId, email: email});
      var readWritePath = '/editable?key=' + encodeHash({documentId: documentId, email: email, readWrite: true});
      res.send({readOnly: readOnlyPath, readWrite: readWritePath});
      // res.sendfile('index.html', {root: __dirname + '/../../www/'});
    },

    decodeURL: function(req, res) {
      var response = decodeHash(req.query.key);
      res.send(response);
    },
  }
};

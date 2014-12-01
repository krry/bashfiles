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

  // This is really a test funciton.  The real functionality would be to send email with these URLs.
  function encodedURLs(req, res) {
    var uuid         = req.signedCookies.uuid;
    var email        = req.query.email;
    var readOnlyPath = '/read_only?key=' + encodeHash({uuid: uuid, email: email});
    var editPath = '/editable?key=' + encodeHash({uuid: uuid, email: email, edit: true});
    res.send({readOnly: readOnlyPath, edit: editPath});
  }

  function readOnly(req, res) {
    if (req.query.key !== null) {
      var hash, uuid, edit;
      hash = decodeHash(req.query.key);
      // console.log(hash);
      uuid = hash.uuid;
      edit = hash.edit || 0;
      res.cookie('uuid', uuid, { maxAge: 1*365*24*60*60*1000, signed: true });
      res.cookie('edit', edit, { maxAge: 1*365*24*60*60*1000, signed: true });
    }
    res.redirect(302, '/');
  }

  function editable(req, res) {
    return readOnly(req, res); // It's all in the key
  }

  return {
    encodedURLs: encodedURLs,
    read_only: readOnly,
    editable: editable,
  };
};

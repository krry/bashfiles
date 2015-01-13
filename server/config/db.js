// typically, you'd require your db here. for now, we're spoofing
// var database = require('database-package')
var database = function() {
	return {}
}

// var dbURL = nconf.get('dbURL') || "example" // Can't see nconf.  Fix when needed.
var dbURL = process.env.dbURL || "example" // use nconf instead of just env
var db = new database;

module.exports = {
  db:     db,
  dbURL:  dbURL,
};

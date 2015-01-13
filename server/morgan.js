var fs     = require('fs'),
    morgan = require('morgan'),
    env    = process.env.NODE_ENV || "development";

var logStream,
    logFormat,
    logOpts;

logStream = fs.createWriteStream(__dirname + '/../logs/server.log', {flags: 'a'});

console.log(__dirname + '/../logs/server.log');

logFormat = (env === "development") ? ':method :url :status in :response-time ms @ :date[web] by :remote-user from :remote-addr :res[content-length]' : "combined";

logOpts = {
  stream: logStream
};

module.exports = morgan(logFormat, logOpts);

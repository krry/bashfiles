//////////// WINSTON LOGGER /////////////

var env     = process.env.NODE_ENV || "development",
    fs      = require('fs'),
    winston = require('winston'),
    logDir  = __dirname + '/../log/',
    logger,
    consoleLevel,
    fileLevel,
    exceptionFileLevel;

if (env === "development") {
  consoleLevel = 'debug';
  filelevel = 'debug';
  exceptionFileLevel = 'warn';
} else {
  consoleLevel = 'info';
  fileLevel = 'warn';
  exceptionFileLevel = 'error';
}

winston.emitErrs = true;

logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      handleExceptions: true,
      colorize: true,
      timestamp: true,
      prettyPrint: true,
      level: consoleLevel,
    }),
    new (winston.transports.File)({
      filename: logDir + env + '-server.json',
      maxsize: 1024 * 1024 * 10, // 10MB
      maxFiles: 5,
      json: true,
      prettyPrint: true,
      level: fileLevel,
    })
  ],
  exceptionHandlers: [
    new (winston.transports.File)({
      filename: logDir + env + '-exceptions.json',
      maxsize: 1024 * 1024 * 10, // 10MB
      maxFiles: 5,
      json: true,
      level: exceptionFileLevel,
    })
  ],
  exitOnError: false,
  statusLevel: true,
  meta: false,
  msg: "{{res.statusCode}}\t{{req.method}}\t{{res.responseTime}}ms\t{{req.url}}"
});

logger.info('winston assembled, ready to log');

module.exports = logger;
module.exports.stream = fs.createWriteStream(logDir+env+'-requests.json', {flags: 'a'});

//////// HAND ROLLED LOGGER /////////
// var fs = require('fs');

// module.exports = function (request, response, next) {
//   var startTime,
//       duration,
//       stream,
//       logFile;

//   logFile = fs.createWriteStream('./myLogFile.log', {flags: 'a'}); //use {flags: 'w'} to open in write m
//   startTime = +new Date();
//   stream = process.stdout;

//   response.on('finish', function () {
//     var message;
//     console.log(request);
//     console.log(response);
//     duration = +new Date() - startTime;
//     message = "This request took " + duration + " ms \n";

//     stream.write(message);
//   });

//   next();

// };

////////// MORGAN LOGGER /////////////
// var fs     = require('fs'),
//     morgan = require('morgan'),
//     env    = process.env.NODE_ENV || "development";

// var logStream,
//     logFormat,
//     logOpts;

// logStream = fs.createWriteStream(__dirname + '/../log/server.log', {flags: 'a'});


// logFormat = (env === "development") ? ':method :url :status in :response-time ms @ :date[web] by :remote-user from :remote-addr :res[content-length]' : "combined";

// logOpts = {
//   stream: logStream
// };

// module.exports = morgan(logFormat, logOpts);

var env     = process.env.NODE_ENV || "development",
    fs      = require('fs'),
    winston = require('winston'),
    expWin  = require('express-winston'),
    logDir  = __dirname + '/../log/',
    logger,
    consoleLevel,
    fileLevel,
    exceptionFileLevel;

if (env === "development") {
  consoleLevel = 'error';
  filelevel = 'debug';
  exceptionFileLevel = 'warn';
} else {
  consoleLevel = 'info';
  fileLevel = 'warn';
  exceptionFileLevel = 'error';
}

logger = expWin.errorLogger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      json: true,
      colorize: true,
      timestamp: true,
      prettyPrint: true,
      level: consoleLevel,
    }),
    new winston.transports.File({
      filename: logDir + env + '-server.json',
      maxsize: 1024 * 1024 * 10, // 10MB
      maxFiles: 5,
      prettyPrint: true,
      level: fileLevel,
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: logDir + env + '-exceptions.json',
      maxsize: 1024 * 1024 * 10, // 10MB
      maxFiles: 5,
      level: exceptionFileLevel,
    })
  ],
  exitOnError: false,
});

module.exports = logger;

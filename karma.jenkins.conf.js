// Karma configuration
// Generated on Wed Nov 12 2014 14:18:02 GMT-0800 (PST)
// Use:
// karma start karma.conf.js
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
    // Itemized because we include some regular and also -min frameworks in this directory
      'public/lib/angular.js',
      'public/lib/angular-mocks.js',
      'public/lib/angular-touch.js',
      'public/lib/angular-ui-router.min.js',
      'public/lib/angularfire.js',
      // 'public/lib/firebase-debug.js', not needed at this time. Conflicts with ol-debug.js
      'public/lib/jquery.js',
      'public/lib/ol-debug.js',
      'public/lib/ui-bootstrap.min.js',
      'public/lib/ui-bootstrap-tpls.min.js',
      // 'public/lib/angular.js',
      // 'public/lib/**/*.js',
      'src/js/*.js',
      'src/js/stages/**/*.js',
      'src/js/controllers/**/*.js',
      'src/js/directives/**/*.js',
      'src/js/services/*.js',
      'test/lib/**/*.js',
      'test/spec/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/js/**/*': ['jshint']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'junit'],


    // web server port
    // port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

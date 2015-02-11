// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//
// gulpfile.js
// 
// gulp is an async build system
//
// however certain aspects of this build use run-sequence
// to execute synchronously and sequentially to avoid
// creating loops in the various watchers and reloaders
//
// modularized following @greypants' ingenious approach
// [https://github.com/greypants/gulp-starter][]
//
// nodemon: loads and reloads server when code changes
// Browserify: constructs and maintains client-side js file
// BrowserSync: keeps styles and scripts fresh during dev
//
//
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

require('./gulp');

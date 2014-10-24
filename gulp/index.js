var fs = require('fs')
var onlyScripts = require('../lib/scriptFilter')

var tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts)

tasks.forEach(function(name) {
  require('./tasks/' + name)
})

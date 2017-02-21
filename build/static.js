require('shelljs/global')
var conf = require('./webpack.prod.conf')
cp('-R', 'static', conf.output.path)

var express = require('express')
var compression = require('compression')
var app = express()
var routes = require('./src/routes')
var fs = require('fs')

app.use(compression())


app.use('/static', express.static('dist/static', {
  setHeaders: function(res, path) {
    if (path.match(/\/static\/(css|js|images|img|font)\/.+/)) {
      res.setHeader('Cache-Control', 'public, max-age=3600')
    }
  }
}))

app.get('/service-worker.js', function(req, res) {
  return res.sendFile(__dirname + '/service-worker.js')
})

// Split up the routes
var staticRoutes = []
var dynamicRoutes = []
routes.map(function(route) {
  if ( route.path.indexOf(':') !== -1 ) {
    dynamicRoutes.push(route)
  } else {
    staticRoutes.push(route)
  }
})


// Catch dynamic routes and serve the standard index page
dynamicRoutes.map(function(route) {
  app.get(route.path, function(req, res) {
    res.sendFile(checkViewExists('/dynamic'))
  })
})

// Route remaining static routes to their corresponding pages
app.get('*', function (req, res) {
  
  var view = checkViewExists('/not-found')
  staticRoutes.map(function(route) {
    if ( route.path === req._parsedUrl.pathname ) {
      view = checkViewExists( route.path )
    }
  })

  if ( view.indexOf('not-found') !== -1 ) { 
    return res.status(404).sendFile( view )
  } else {
    return res.sendFile( view )
  }
})

function checkViewExists(view) {
  if ( view === '/' ) {
    view = ''
  }
  var path = __dirname + '/dist' + view + '/index.html'
  return fs.existsSync(path) ? path : __dirname + '/dist/not-found/index.html'
}

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
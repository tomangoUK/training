/* eslint-env worker, serviceworker */
/* global goog */

const cacheNameStatic = 'training-static-v4'
const cacheNameVideo = 'training-videos-v2'
const cacheNameExternal = 'training-external-v1'
const cacheNamePrefetch = 'training-prefetch-v1'

const currentCacheNames = [
  cacheNameStatic,
  cacheNameVideo,
  cacheNameExternal
]


importScripts('/static/js/offline-google-analytics-import.min.js')
goog.offlineGoogleAnalytics.initialize()


self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheNameStatic)
    .then(function (cache) {
      return cache.addAll([
        '/',
        '/offline',
        '/videos',
        '/videos/installation-of-releaser',
        '/static/css/style.css',
        '/static/images/logo.png',
        '/static/images/sprites.png',
        '/static/images/tags.jpg',
        '/static/images/installation-of-releaser.jpg'
      ])
    })
    .then( () => self.skipWaiting() )
  )
})



self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (currentCacheNames.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
  )
})



self.addEventListener('fetch', event => {
  let request = event.request
  let url = new URL(request.url)

  if (request.method !== 'GET') {
    return
  }

  if (event.request.headers.get('range')) {
    var pos =
    Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1])

    event.respondWith(
      caches.open(cacheNamePrefetch)
      .then(function(cache) {
        return cache.match(event.request.url)
      }).then(function(res) {
        if (!res) {
          return fetch(event.request)
          .then(res => {
            return res.arrayBuffer()
          })
        }
        return res.arrayBuffer()
      }).then(function(ab) {
        return new Response(
          ab.slice(pos),
          {
            status: 206,
            statusText: 'Partial Content',
            headers: [
              // ['Content-Type', 'video/webm'],
              ['Content-Range', 'bytes ' + pos + '-' +
                (ab.byteLength - 1) + '/' + ab.byteLength]]
          })
      }))
  } else {

    event.respondWith(
      caches.match(event.request)
        .then(function (response) {

          if (response) {
            return response
          }

          var fetchRequest = event.request.clone()

          return fetch(fetchRequest).then(
            function (response) {

              var cacheName = false
              if (response.type === 'basic' && response.status === 200) {
                if (url.href.indexOf('.mp4') !== -1) {
                  cacheName = cacheNameVideo
                } else {
                  cacheName = cacheNameStatic
                }
              } else {
                cacheName = cacheNameExternal
              }

              if (cacheName) {
                var responseToCache = response.clone()

                caches.open(cacheName)
                  .then(function (cache) {
                    var cacheRequest = event.request.clone()
                    cache.put(cacheRequest, responseToCache)
                  })
              }

              return response
            } 
          )
          .catch( () => {
            if (request.headers.get('Accept').indexOf('text/html') !== -1) {
              return caches.match(request)
                .then( response => response || caches.match('/offline') )
            } else if (request.headers.get('Accept').indexOf('image') !== -1) {
              return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', {headers: {'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store'}})
            }
          })

        })
      )
  }

})
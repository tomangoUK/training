/* eslint-env worker, serviceworker */
/* global goog */

importScripts('/static/js/async-waituntil.js')

const cacheNameStatic = 'training-static-v12'
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
  event.waitUntil(
    caches.open(cacheNameStatic)
      .then(cache => Promise.all(
        [
          '/',
          '/?utm_source=web_app_manifest',
          '/offline',
          '/videos',
          '/videos/installation-of-releaser',
          '/static/css/style.css',
          '/static/images/logo.png',
          '/static/images/sprites.png',
          '/static/images/tags.jpg',
          '/static/images/refresh.png',
          '/static/images/loader.png',
          '/static/images/installation-of-releaser.jpg'
        ].map(url => {
          let requestUrl = url.indexOf('?') === -1 ? `${url}?${Math.random()}` : `${url}&${Math.random()}` 
          return fetch(requestUrl).then(response => {
            if (!response.ok) throw Error('Not ok')
            return cache.put(url, response)
          })
        })
      ))
      .then( () => self.skipWaiting() )
  )
})

function clearCaches() {
  return caches.keys()
    .then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (currentCacheNames.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
}


self.addEventListener('activate', event => {
  event.waitUntil(clearCaches()
    .then(function() {
      clients.matchAll().then(clients => {
        clients.forEach(client => {
          send_message_to_client(client)
        })
      })
      self.clients.claim()
    })
  )
})


function send_message_to_client(client){
  return new Promise(function(resolve, reject){
    var msg_chan = new MessageChannel()

    msg_chan.port1.onmessage = function(event){
      if(event.data.error){
        reject(event.data.error)
      }else{
        resolve(event.data)
      }
    }

    client.postMessage('updated', [msg_chan.port2])
  })
}





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
              ['Content-Range', 'bytes ' + pos + '-' +
                (ab.byteLength - 1) + '/' + ab.byteLength]]
          })
      }))
  } else {

    event.respondWith(
      caches.match(event.request)
        .then(function (responseFromCache) {

          if (responseFromCache && request.url.indexOf('.mp4') === -1) {
            let requestUrl = request.url.indexOf('?') === -1 ? `${request.url}?${Math.random()}` : `${request.url}&${Math.random()}` 
            event.waitUntil(
                fetch(requestUrl)
                .then( responseFromFetch => {
                  caches.open(cacheNameStatic)
                  .then( cache => {
                    cache.put(request, responseFromFetch)
                  })
                })
            )
            return responseFromCache
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
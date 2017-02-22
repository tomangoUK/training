<template>
  <div class="nav-page">
    <main-layout v-bind:title="navTitle" v-bind:back="back">
      <div class="video">
        
        <div v-if="content.video" class="video-container" id="video-container">
          <video id="video" v-on:click="toggleVideoPlayback" data-object-fit="contain" :poster="content.poster" :class="loading"></video>
          <nav class="video-controls">
            <div>
              <button v-on:click="toggleVideoPlayback" type="button" id="play-button">Play</button>
              <input v-on:change="changeVideoPosition" type="range" value="0" id="seek">
              <span class="time">{{ remainingTime }}</span>
              <button v-on:click="toggleVideoMute" type="button" id="mute-button">Mute</button>
              <button v-on:click="toggleVideoFullscreen" type="button" id="fullscreen-button">Full-Screen</button>
            </div>
          </nav>
          <i class="loader"></i><i class="pauser"></i>
        </div>

        <div class="video__content">
          <h1>{{ this.$route.meta.title }}</h1>
          <p v-for="paragraph in content.content">{{ paragraph }}</p>
        </div>

      </div>
    </main-layout>
  </div>
</template>

<script>
  import 'whatwg-fetch'
  import Promise from 'promise-polyfill'

  if (!window.Promise) {
    window.Promise = Promise
  }


  import MainLayout from '../components/MainLayout.vue'
  const content = {
    'installation-of-releaser': {
      'video' : '/static/videos/installation-of-releaser.mp4',
      'poster': '/static/images/installation-of-releaser-poster.jpg',
      'length' : 60,
      'content': [
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.'
      ]
    }
  }

  export default {

    data () {
      return {
        title: this.$route.meta.title,
        remaining: content[ this.$route.path.replace('/videos/', '') ].length,
        navTitle: '',
        back: '/videos',
        content: content[ this.$route.path.replace('/videos/', '') ],
        video: '',
        seek: '',
        playButton: '',
        muteButton: '',
        fullscreenButton: '',
        loading: 'loading'
      }
    },

    mounted: function() {

      var title = this.title
      this.getVideo()
      const videoRequest = fetch(this.content.video).then(response => response.blob())
      videoRequest.then(blob => {
        const request = indexedDB.open('trainingVideos', 1)

        request.onsuccess = event => {
          const db = event.target.result

          const transaction = db.transaction(['videos'])
          const objectStore = transaction.objectStore('videos')

          const test = objectStore.get(title)

          test.onsuccess = () => {
            if ( test.result ) {
              this.video.src = window.URL.createObjectURL(test.result.blob)
              this.toggleVideoPlayback()
            } else {
              this.video.src = window.URL.createObjectURL(blob)
              this.toggleVideoPlayback()
            }
          }
        }

        request.onupgradeneeded = event => {
          const db = event.target.result
          const objectStore = db.createObjectStore('videos', { keyPath: 'name' })

          objectStore.transaction.oncomplete = () => {
            const videoObjectStore = db.transaction('videos', 'readwrite').objectStore('videos')
            videoObjectStore.add({name: title, blob: blob})
          }
        }
      })

    },

    computed: {

      remainingTime: function() {
        if ( this.remaining ) {
          var remainingTime = Math.floor(this.remaining)
          var minutes = Math.floor(remainingTime / 60)
          var seconds = remainingTime - minutes * 60

          if ( seconds < 10 && seconds > 0 ) {
            seconds = '0' + seconds
          }

          return '-' + minutes + ':' + (seconds === 0 ? '00': seconds)
        } else {
          return '-0:00'
        }
      }

    },

    head: {
      title: function () {
        return {
          inner: this.title
        }
      }
    },

    components: {
      MainLayout
    },

    methods: {

      getVideo: function() {
        if ( ! this.video ) {
          this.video = document.getElementById('video')
          this.seek = document.getElementById('seek')
          this.playButton = document.getElementById('play-button')
          this.muteButton = document.getElementById('mute-button')
          this.fullscreenButton = document.getElementById('fullscreen-button')
          var video = this.video
          var seek = this.seek
          var that = this

          this.video.addEventListener('timeupdate', function() {
            let value = (100 / video.duration) * video.currentTime

            seek.style.backgroundImage = '-webkit-gradient(linear, left top, right top, '
            + 'color-stop(' + (value / 100) + ', #E11A27), '
            + 'color-stop(' + (value / 100) + ', rgba(255, 255, 255, 0.25))'
            + ')'

            seek.value = value
            that.remaining = video.duration - video.currentTime
          })
        }
      },

      toggleVideoPlayback: function() {
        this.getVideo()
        if ( this.video.paused ) {
          var that = this
          var playPromise = this.video.play()
          if ( ! playPromise ) {
            that.video.classList.remove('playing')
            that.playButton.classList.remove('playing')
          } else {
            playPromise.then(function() {
              that.video.classList.add('playing')
              that.playButton.classList.add('playing')
              that.video.classList.remove('pausing')
            }).catch(function() {
              that.video.classList.remove('playing')
              that.playButton.classList.remove('playing')
              that.video.classList.add('pausing')
            })
          }

          this.loading = ''

        } else {
          if ( this.video !== undefined ) {
            try {
              this.video.pause() 
            }
            catch (event) {
              console.log( event )
            }
          }
          if ( this.playButton.classList ) {
            this.video.classList.remove('playing')
            this.playButton.classList.remove('playing')
          }
        }
      },

      toggleVideoFullscreen: function() {
        this.getVideo()
        const vc = document.getElementById('video-container')

        if ( ! document.fullscreenElement && ! document.mozFullScreenElement && ! document.webkitFullscreenElement && ! document.msFullscreenElement ) {
          if (vc.requestFullscreen) {
            vc.requestFullscreen()
          } else if (vc.mozRequestFullScreen) {
            vc.mozRequestFullScreen()
          } else if (vc.msRequestFullScreen) {
            vc.msRequestFullScreen()
          } else if (vc.webkitEnterFullscreen) {
            vc.webkitEnterFullscreen()
          } else if (vc.webkitRequestFullscreen) {
            vc.webkitRequestFullscreen()
          } else if ( this.video.webkitEnterFullscreen ) {
            this.video.setAttribute('controls', 'controls')
            this.video.parentNode.classList.add('hide-controls')
            this.video.webkitEnterFullscreen()
          }

          this.playButton.focus()

          if ( this.fullscreenButton.classList ) {
            this.fullscreenButton.classList.add('fullscreen')
          }

        } else {
          if (vc.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          }

          if ( this.fullscreenButton.classList ) {
            this.fullscreenButton.classList.remove('fullscreen')
          }
        }

        
      },

      toggleVideoMute: function() {
        this.getVideo()
        if ( this.video.muted ) {
          this.video.muted = false
          if ( this.muteButton.classList ) {
            this.muteButton.classList.remove('muted')
          }
        } else {
          this.video.muted = true
          if ( this.muteButton.classList ) {
            this.muteButton.classList.add('muted')
          }
        }
      },

      changeVideoPosition: function() {
        this.getVideo()
        let time = this.video.duration * (this.seek.value / 100)
        this.video.currentTime = time
      }

    }

  }
</script>

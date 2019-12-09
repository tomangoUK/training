<template>
  <div class="nav-page">
    <main-layout v-bind:title="navTitle" v-bind:back="back">
      <div class="video">
        
        <div v-if="content.video" class="video-container" id="video-container">
          <video id="video" v-on:click="toggleVideoPlayback" data-object-fit="contain" :poster="content.poster" :class="loading">
            <source :src="content.video + '.webm'" type="video/webm">
            <source :src="content.video + '.mp4'" type="video/mp4">
          </video>
          <nav class="video-controls">
            <div>
              <button v-on:click="toggleVideoPlayback" type="button" id="play-button">Play</button>
              <input v-on:change="changeVideoPosition" type="range" value="0" id="seek">
              <span class="time">{{ remainingTime }}</span>
              <button v-on:click="toggleVideoMute" type="button" id="mute-button">Mute</button>
              <button v-on:click="toggleVideoFullscreen" type="button" id="fullscreen-button">Full-Screen</button>
            </div>
          </nav>
          <i class="loader"></i>
          <i class="pauser" v-on:click="toggleVideoPlayback"></i>
        </div>

        <div class="video__content">
          <h1>{{ this.$route.meta.title }}</h1>
          <p v-for="paragraph in content.content">{{ paragraph }}</p>
          <a class="button button--left" download :href="content.video + '.mp4'">Download video</a>
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
    'installing-the-releaser': {
      'video' : '/static/videos/installing-the-releaser/',
      'poster': '/static/images/installation-of-releaser-poster.jpg',
      'length' : 58,
      'content': [
        'Step-by-step instructions and details of the tools required for installing a new Concept Tag releaser in a store’s till area.'
      ]
    },
    'releasing-a-tag': {
      'video' : '/static/videos/releasing-a-tag/',
      'poster': '/static/images/releasing-a-tag-poster.jpg',
      'length' : 40,
      'content': [
        'The Concept Tag has a locking mechanism that’s removed in a totally unique way. Make sure you’re using the releaser correctly to avoid problems.'
      ]
    },
    'replacing-the-releaser': {
      'video' : '/static/videos/replacing-the-releaser/',
      'poster': '/static/images/replacing-a-releaser-poster.jpg',
      'length' : 65,
      'content': [
        'Step-by-step instructions on how to remove a damaged releaser, install the replacement, and return the broken one for repair.'
      ]
    },
    'troubleshooting': {
      'video' : '/static/videos/troubleshooting/',
      'poster': '/static/images/troubleshooting-poster.jpg',
      'length' : 48,
      'content': [
        'Some of the more common problems you might encounter using the Concept Tag and its releaser, and how to solve them.'
      ]
    },
    'where-to-place-a-tag': {
      'video' : '/static/videos/where-to-place-a-tag/',
      'poster': '/static/images/where-to-place-a-tag-poster.jpg',
      'length' : 61,
      'content': [
        'Make sure the Concept Tag’s completely effective by fitting it correctly and in the recommended positions for t-shirts, tops, blouses, jeans and trousers.'
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

      this.getVideo()
      this.toggleVideoPlayback()

      // var title = this.title
      // const videoRequest = fetch(this.content.video).then(response => response.blob())
      // videoRequest.then(blob => {
      //   const request = indexedDB.open('trainingVideos', 1)

      //   request.onsuccess = event => {
      //     const db = event.target.result

      //     const transaction = db.transaction(['videos'])
      //     const objectStore = transaction.objectStore('videos')

      //     const test = objectStore.get(title)

      //     test.onsuccess = () => {
      //       if ( test.result ) {
      //         this.video.src = window.URL.createObjectURL(test.result.blob)
      //         this.toggleVideoPlayback()
      //       } else {
      //         this.video.src = window.URL.createObjectURL(blob)
      //         this.toggleVideoPlayback()
      //       }
      //     }
      //   }

      //   request.onupgradeneeded = event => {
      //     const db = event.target.result
      //     const objectStore = db.createObjectStore('videos', { keyPath: 'name' })

      //     objectStore.transaction.oncomplete = () => {
      //       const videoObjectStore = db.transaction('videos', 'readwrite').objectStore('videos')
      //       videoObjectStore.add({name: title, blob: blob})
      //     }
      //   }
      // })

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
            that.loading = ''
          } else {
            playPromise.then(function() {
              that.video.classList.add('playing')
              that.playButton.classList.add('playing')
              that.video.classList.remove('pausing')
              that.loading = ''
            }).catch(function() {
              that.video.classList.remove('playing')
              that.playButton.classList.remove('playing')
              that.video.classList.add('pausing')
              that.loading = ''
            })
          }

        } else {
          if ( this.video !== undefined ) {
            try {
              this.video.pause() 
            }
            catch (event) {
              console.log( '' )
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

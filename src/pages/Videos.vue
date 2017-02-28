<template>
  <div class="nav-page">
    <main-layout v-bind:title="navTitle" v-bind:back="back">
      <div class="videos">
        <article v-for="video in videos">
          <router-link :to="video.path">
            <figure>
              <img data-object-fit :src="video.image">
              <small>{{ video.time }}</small>
            </figure>
            <h4>{{ video.title }}</h4>
          </router-link>
        </article>
      </div>
      <button v-if="showDownload" class="button--download button" :class="hideDownload" v-on:click="saveVideos">Save Videos Offline</button>
    </main-layout>
  </div>
</template>

<script>
  import MainLayout from '../components/MainLayout.vue'
  const videos = [
    {
      'title' : 'Where to place a tag',
      'path' : '/videos/where-to-place-a-tag',
      'image' : '/static/images/where-to-place-a-tag.jpg',
      'time': '01:01'
    },
    {
      'title' : 'Releasing a tag',
      'path' : '/videos/releasing-a-tag',
      'image' : '/static/images/releasing-a-tag.jpg',
      'time': '00:40'
    },
    {
      'title' : 'Installing the releaser',
      'path' : '/videos/installing-the-releaser',
      'image' : '/static/images/installation-of-releaser.jpg',
      'time': '00:58'
    },
    {
      'title' : 'Troubleshooting',
      'path' : '/videos/troubleshooting',
      'image' : '/static/images/troubleshooting.jpg',
      'time': '00:48'
    },
    {
      'title' : 'Replacing the releaser',
      'path' : '/videos/replacing-the-releaser',
      'image' : '/static/images/replacing-a-releaser.jpg',
      'time': '01:05'
    }
  ]

  export default {

    data () {
      return {
        title: 'Video tutorials',
        navTitle: 'Video tutorials',
        back: '/',
        videos: videos,
        showDownload: navigator && navigator.serviceWorker && localStorage && ! localStorage.getItem('downloadedVideos') && ! localStorage.getItem('downloadingVideos'),
        hideDownload: ''
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
      saveVideos: function() {
        this.hideDownload = 'hide-download'
        localStorage.setItem('downloadingVideos', true)
        var testEl = document.createElement( 'video' )
        if ( testEl.canPlayType ) {
          navigator.serviceWorker.controller.postMessage({ 'command': 'fetchVideos' + ( testEl.canPlayType( 'video/webm; codecs="vp8, vorbis"' ) ? 'Webm' : '' ) })
        } else {
          navigator.serviceWorker.controller.postMessage({ 'command': 'fetchVideos' })
        }
      }
    }

  }
</script>

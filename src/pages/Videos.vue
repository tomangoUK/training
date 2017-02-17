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
    </main-layout>
  </div>
</template>

<script>
  import MainLayout from '../components/MainLayout.vue'
  const videos = [
    {
      'title' : 'Installation of releaser',
      'path' : '/videos/installation-of-releaser',
      'image' : '/static/images/installation-of-releaser.jpg',
      'time': '01:24'
    },
    {
      'title' : 'Installation of releaser',
      'path' : '/videos/installation-of-releaser',
      'image' : '/static/images/installation-of-releaser.jpg',
      'time': '01:24'
    },
    {
      'title' : 'Installation of releaser',
      'path' : '/videos/installation-of-releaser',
      'image' : '/static/images/installation-of-releaser.jpg',
      'time': '01:24'
    },
    {
      'title' : 'Installation of releaser',
      'path' : '/videos/installation-of-releaser',
      'image' : '/static/images/installation-of-releaser.jpg',
      'time': '01:24'
    }
  ]

  export default {

    data () {
      return {
        title: 'Video tutorials',
        navTitle: 'Video tutorials',
        back: '/',
        videos: videos
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

    created: function () {

    }

  }
</script>

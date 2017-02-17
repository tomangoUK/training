<template>
  <div>
    <div class="home-container">
      <main-layout class="home">

        <h1>Welcome</h1>
        <p>Quick video tutorials for getting the most out of The Concept Tag.</p>
        <img src="/static/images/tags.jpg" alt="A group of Concept Tags">

        <router-link to="/videos" class="button button--red">Video Tutorials</router-link>

        <a v-on:click="toggleContact" class="button">Contact Agon</a>
      
      </main-layout>

      <transition name="fade">
        <aside class="splash-overlay" v-if="splash">
          <div>
            <img src="/static/images/logo.png">
            <p>The Concept Tag is distributed by Agon Systems</p>
            <a href="http://www.concepttag.com">www.concepttag.com</a>
            <p>&copy; {{ year }} Agon Systems Ltd</p>
          </div>
        </aside>
      </transition>
    </div>
  </div>
</template>

<script>
  import MainLayout from '../components/MainLayout.vue'

  export default {

    data () {
      return {
        title: 'Home',
        year: new Date().getFullYear(),
        splash: true
      }
    },

    mounted: function() {
      if ( this.$route.query.utm_source !== undefined && this.$route.query.utm_source === 'web_app_manifest' ) {
        this.splash = true
        var that = this
        setTimeout(function() {
          that.splash = false
          history.pushState({}, '', '/')
        }, 2000)
      } else {
        this.splash = false
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
      toggleContact: function() {
        this.$parent.contact = true
      }
    }

  }
</script>

<template>
  <nav class="main-nav">
    <router-link v-bind:to="back" class="main-nav__back">Back</router-link>
    <h1 :aria-hidden="title ? 'false' : 'true'">{{ title }}</h1>
    <button v-on:click="toggleContact" class="main-nav__contact"><svg width="22" height="18" viewBox="0 0 22 18" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><rect id="a" width="21.37" height="17.07" rx="2"/><mask id="c" x="0" y="0" width="21.37" height="17.07" fill="#fff"><use xlink:href="#a"/></mask><path d="M0 2C0 .9.65.6 1.47 1.34l8.48 7.8c.4.37 1.07.36 1.47 0l8.48-7.8C20.7.6 21.37.9 21.37 2v13.08c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V1.98z" id="b"/><mask id="d" x="0" y="0" width="21.37" height="16.14" fill="#fff"><use xlink:href="#b"/></mask></defs><g stroke="#CCC" stroke-width="4" fill="none" fill-rule="evenodd"><use mask="url(#c)" xlink:href="#a"/><use mask="url(#d)" xlink:href="#b"/></g></svg></button>
  </nav>
</template>

<script>
  export default {
    props: ['title'],

    data: function() {
      return {
        back: this.$route.path.indexOf('/videos/') !== -1 ? '/videos' : '/'
      }
    },

    watch: {
      '$route': function(to) {
        this.back = to.path.indexOf('/videos/') !== -1 ? '/videos' : '/'
      }
    },

    methods: {
      toggleContact: function() {
        if ( ! this.contact ) {
          /* global ga */
          ga('send', 'event', 'contact', 'opened')
        }
        this.$root.contact = ! this.$root.contact
      }
    }

  }
</script>

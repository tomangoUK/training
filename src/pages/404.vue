<template>
  <div class="nav-page standard-page">
    <main-layout v-bind:title="navTitle" v-bind:back="back">
      <h1>404</h1>
    </main-layout>
  </div>
</template>

<script>
  import MainLayout from '../components/MainLayout.vue'

  export default {

    data () {
      return {
        title: 'Page Not Found',
        navTitle: 'Page Not Found',
        back: '/'
      }
    },

    head: {
      title: {
        inner: 'Page Not Found'
      }
    },

    components: {
      MainLayout
    }

  }
</script>

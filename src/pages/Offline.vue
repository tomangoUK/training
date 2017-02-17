<template>
  <div class="nav-page standard-page">
    <main-layout v-bind:title="navTitle" v-bind:back="back">
      <h1>Offline</h1>
      <p>It looks like you're currently offline and this page hasn't been saved.</p>
      <router-link to="/" class="button">Home</router-link>
    </main-layout>
  </div>
</template>

<script>
  import MainLayout from '../components/MainLayout.vue'

  export default {

    data () {
      return {
        title: 'Offline',
        navTitle: 'Offline',
        back: '/'
      }
    },

    head: {
      title: {
        inner: 'Offline'
      }
    },

    components: {
      MainLayout
    }

  }
</script>

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueHead from 'vue-head'
import routes from './routes'
import Navigation from './components/Navigation.vue'
import VueAnalytics from 'vue-analytics'

Vue.use(VueHead, {
  separator: '|',
  complement: 'Agon Systems'
})
Vue.use(VueRouter)

var allRoutes = []
var templates = {}
routes.map(function(el) {
  var templateName = ( el.template || el.title )
  templates[templateName] = require('./pages/' + templateName)

  if ( el.parent !== undefined ) {
    allRoutes.map(function(route) {
      if ( route.path === el.parent ) {
        if ( route.childen === undefined ) {
          route.children = [{
            path: '',
            meta: {
              title: el.title,
              navTitle: el.navTitle ? el.title : ''
            },
            component: require('./pages/' + route.templateName + '-parent'),
            templateName: templateName
          }]
        }

        route.children.push({
          path: el.path,
          meta: {
            title: el.title,
            navTitle: el.navTitle ? el.title : ''
          },
          component: templates[templateName],
          templateName: templateName
        })
      }
    })
  } else {
    allRoutes.push({
      path: el.path,
      meta: {
        title: el.title,
        navTitle: el.navTitle ? el.title : ''
      },
      component: templates[templateName],
      templateName: templateName
    })
  }

})

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: allRoutes
})

const id = 'UA-54058249-3'
Vue.use(VueAnalytics, { id, router })

document.addEventListener('DOMContentLoaded', function () {
  /* eslint-disable no-new */
  new Vue({
    router,

    components: {
      Navigation
    },

    data: function() {
      return {
        contact: false,
        transition: 'slide-left',
        title: '',
        back: ''
      }
    },

    methods: {
      toggleContact: function() {
        if ( ! this.contact ) {
          /* global ga */
          ga('send', 'event', 'contact', 'opened')
        }

        this.contact = ! this.contact
      }
    },

    watch: {
      '$route' (to, from) {
        let toPath = to.path
        let fromPath = from.path

        if ( toPath === '/' ) toPath = ''
        if ( fromPath === '/' ) fromPath = ''

        const toDepth = toPath.split('/').length
        const fromDepth = fromPath.split('/').length

        this.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    },
    
    el: '#app',

    template: `
      <div id="app">

        <header role="banner">
          <router-link to="/">
            <img src="/static/images/logo.png">
          </router-link>
        </header>

        <transition name="fade" mode="out-in">
          <navigation v-bind:title="this.$route.meta.navTitle" v-bind:back="back" v-if="$route.path != '/'"></navigation>
        </transition>
        
        <transition :name="transition">
          <router-view class="view"></router-view>
        </transition>

        <transition name="fade" mode="out-in">
          <aside class="contact" v-if="contact">
            <a v-on:click="toggleContact" class="contact__close-overlay"></a>
            <div class="contact__content">
              <h3>+44 (0)1323 738815</h3>
              <p><strong>United Kingdom</strong><br>
              Unit G4 Chaucer Business Park,<br>
              Dittons Road, Polegate, East Sussex,<br>
              BN26 6JF</p>

              <p><a href="mailto:customer-support@agon-systems.com">customer-support@agon-systems.com</a></p>

              <p><a href="http://www.agon-systems.com" target="_blank">www.agon-systems.com</a></p>
              <a v-on:click="toggleContact" class="contact__close">Close</a>
            </div>
          </aside>
        </transition>

        <footer role="contentinfo">
          <a v-on:click="toggleContact" class="button">Contact Agon</a>
          <p>The Concept Tag is distributed by Agon Systems</p>
          <small>&copy; ` + new Date().getFullYear() +` Agon Systems Ltd</small>
        </footer>

      </div>
    `
  })
})

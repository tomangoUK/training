module.exports = [
  {
    path: '/',
    title: 'Home'
  },
  {
    path: '/videos',
    title: 'Video tutorials',
    template: 'Videos',
    navTitle: true
  },
  {
    path: '/videos/installation-of-releaser',
    title: 'Installation of releaser',
    template: 'Video',
    navTitle: false
  },
  {
    path: '/offline',
    title: 'Offline',
    template: 'Offline',
    navTitle: true
  },
  {
    path: '*',
    title: 'Not Found',
    template: '404',
    altPath: '/not-found',
    navTitle: true
  }
]

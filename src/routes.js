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
    path: '/videos/installing-the-releaser',
    title: 'Installing the releaser',
    template: 'Video',
    navTitle: false
  },
  {
    path: '/videos/replacing-the-releaser',
    title: 'Replacing the releaser',
    template: 'Video',
    navTitle: false
  },
  {
    path: '/videos/troubleshooting',
    title: 'Troubleshooting',
    template: 'Video',
    navTitle: false
  },
  {
    path: '/videos/releasing-a-tag',
    title: 'Releasing a tag',
    template: 'Video',
    navTitle: false
  },
  {
    path: '/videos/where-to-place-a-tag',
    title: 'Where to place a tag',
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

import colors from 'vuetify/es5/util/colors'

export default {
  loading: {
    color: 'rgb(0, 209, 178)',
    height: '5px'
  },
  /*
  ** Nuxt target
  */
  target: 'server',

  head: {
    titleTemplate: '%s - SPL-DASHBOARD',
    title: 'SPL-DASHBOARD',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  router: {
    middleware: ['auth', 'breadcrumbs']
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/axios',
    '@/plugins/vuex-persist',
    '@/plugins/vee-validate',
    '@/plugins/qrcode-generate',
    '@/plugins/vue-qrcode.client',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    '@nuxtjs/auth',
    '@nuxtjs/toast',
    '@nuxtjs/moment',
  ],

  // Moment module
  moment: {
    defaultLocale: 'id',
    locales: ['id'],
    defaultTimezone: 'Asia/Jakarta'
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT'
    }
  },


  auth: {
    // Options
    // redirect: {
    //   login: '/login',
    //   logout: '/logout',
    //   home: '/',
    // },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/e_do/login', method: 'post', propertyName: 'id_token' },
          user: false,
          logout: false
        },
        tokenType: false,
        // rewriteRedirects: fa,lse
      }
    },
    autoFetchUser: false,
    resetOnError: true,
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    // treeShake: true,
    theme: {
      dark: false
    }
  },

  toast: {
    position: 'top-center',
    fullWidth: true,
    iconPack: 'mdi',
    containerClass: 'px-5',
    action: {
      text: 'Close',
      onClick: (e, obj) => {
        obj.goAway(0)
      }
    },
    register: [
      {
        name: 'api_error',
        message: (msg) => !msg ?  'Oops...Something went wrong' : msg,
        options: {
          type: 'error',
          theme: 'outline',
          duration: 9000
        },
      },
      {
        name: 'app_loading',
        message: 'Please wait ..',
        options: {
          type: 'info',
          theme: 'outline',
          duration: 9000,
          icon: 'mdi-information-outline'
        }
      },
      {
        name: 'app_error',
        message: msg => msg,
        options: {
          type: 'error',
          theme: 'outline',
          duration: 9000,
          icon: 'mdi-alert-circle-outline',
        }
      },
      {
        name: 'app_success',
        message: msg => msg,
        options: {
          type: 'success',
          theme: 'outline',
          duration: 9000,
          icon: 'mdi-checkbox-marked-circle-outline'
        }
      }
    ]
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ["vee-validate/dist/rules"]
  }
}

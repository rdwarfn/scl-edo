
export default {
  // env: {
  //   baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  //   API_URL: 'https://cors-anywhere.herokuapp.com/https://api-scl.herokuapp.com'
  // },

  /*
  ** Nuxt rendering mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  */
  target: 'server',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - dashboard-scl',
    title: 'dashboard-scl',
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
    '@/plugins/vuex-persist',
    '@/plugins/axios',
    '@/plugins/qrcode-generate',
    '@/plugins/vuelidate'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // '@nuxtjs/dotenv',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/auth',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    '@nuxtjs/moment',
  ],

  moment: {
    defaultLocale: 'id',
    locales: ['id'],
    defaultTimezone: 'Asia/Jakarta'
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    // proxy: true,
    // baseURL: 'https://backend-scl.herokuapp.com',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT'
    }
  },

  auth: {
    // Options
    // redirect: {
    //   // callback: '/callback',
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
        tokenRequired: true,
        tokenType: false,
        autoFetchUser: false,
        watchLoggedIn: false,
        // rewriteRedirects: false
      }
    }
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#3273DC',
        }
      }
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
    transpile: ["vee-validate/dist/rules"],
  }
}
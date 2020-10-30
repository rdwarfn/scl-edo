<template>
  <v-app>
    <DrawerDashboard />
    <v-main id="main">
      <appbar class="mb-5 px-md-5" />
      <nuxt />
    </v-main>
    <v-footer :absolute="false" app>
      <span>&copy; {{ $moment().format('YYYY') }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import DrawerDashboard from '@/components/DrawerDasboardScl.vue';
import Appbar from '@/components/Appbar.vue';

import _ from 'lodash';

export default {
  middleware ({ store, redirect }) {
    if (!store.state.auth.loggedIn)
      return redirect('/')
  },

  components: { DrawerDashboard, Appbar },

  methods: {
    getColorNotif (params) {
      if (!params) { return }
      switch (params) {
        case "success":
          return "green darken-2"

        case "error":
          return "red darken-2"

        default:
          return "info darken-2"
      }
    },

    getIconNotif (params) {
      if (!params) return
      switch (params) {
        case "success":
          return "mdi-checkbox-marked-circle-outline"

        case "error":
          return "mdi-close-circle-outline"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #main {
    background-color: #F5F5FB !important;
    height: auto !important;
  }
</style>

<template>
  <edit-edo-form
    @onSubmit="onSubmit"
    :loading="$fetchState.pending || isLoading"
    :selectData="dataSelect"
    :models="models">
  </edit-edo-form>
</template>

<script>
import EditEdoForm from '@/components/forms/EditEdo.vue';
import Notification from '@/components/Snack.vue';
import qs from 'querystring';

import { initialEdo } from '@/utils';

export default {
  meta: {
    crumbs: [{
      to: '/dokumen',
      exact: true,
      text: 'Dashboard',
      disabled: false
    },{
      to: '/dokumen/e-do/edit',
      text: 'Edit e-DO',
      disabled: true
    }]
  },
  components: { EditEdoForm, Notification },

  data () {
    return {
      isLoading: false,
      dataSelect: {
        shipperName: ["a", "b"],
        consigneeName: [],
        portOfLoading: [],
        portOfDischarge: []
      },
      models: {
        ...initialEdo
      }
    }
  },

  fetch () {
    this.$toast.global.app_loading()
    Promise.all ([
      this.getEdoByNumber (),
      this.getAllConsignee (),
      this.getAllPortOfLoading (),
      this.getAllPortOfDischarge ()
    ])
    .finally(() => {
      this.$toast.clear()
    })
  },
  fetchOnServer: false,

  methods: {
    async onSubmit (params, e) {
      this.$toast.global.app_loading()
      this.isLoading = true
      let edonumber = this.$route.params.id
      try {
        const validate = await params.observer.validate()
        if (validate) {
          const response = await this.$axios.put (`/api/e_do/${params.data.edo_id}`, qs.stringify(params.data))
          if (response) {
            this.$toast.global.app_success(`e-DO ${edonumber} successfully updated.`)
          }
        }
      } catch (error) {
        console.log(JSON.stringify(error))
        const response = error.response && error.response
        this.$toast.global.app_error(`e-DO ${edonumber} failed to update`)
      } finally {
        this.isLoading = false
        this.$router.back()
      }
    },

    async getEdoByNumber () {
      let edonumber = this.$route.params.id
      await this.$axios.get (`/api/e_do/search?e_do_number=${edonumber}`)
        .then (response => {
          this.models = response.data.data[0]
        })
        .catch (err => {
          const msg = err.response && ` ,${err.response.message}`
          this.setNotification ({
            message: `Failed to get e-DO ${edonumber}` + msg,
            status: 'error'
          })
        })
    },

    async getAllConsignee () {
      await this.$axios.get ('/api/e_do/consignee')
      .then (response => {
        this.dataSelect.consigneeName = response.data.data
      })
      .catch (err => {
        const msg = err.response && ` ,${err.response.message}`
        this.setNotification ({
          message: 'Failed get consignee' + msg,
          status: 'error'
        })
      })
    },

    async getAllPortOfLoading () {
      await this.$axios.get ('/api/e_do/port_of_lading')
      .then (response => {
        this.dataSelect.portOfLoading = response.data.data
      })
      .catch (error => {
        const msg = err.response && ` ,${err.response.message}`
        this.setNotification ({
          message: 'Failed get port of loading' + msg,
          status: 'error'
        })
      })
    },

    async getAllPortOfDischarge () {
      await this.$axios.get ('/api/e_do/port_of_discharge')
      .then (response => {
        this.dataSelect.portOfDischarge = response.data.data;
      })
      .catch (error => {
        const msg = err.response && ` ,${err.response.message}`
        this.setNotification ({
          message: 'Failed get port of discharge' + msg,
          status: 'error'
        })
      })
    },

    setNotification (params) {
      this.$store.commit ('setNotif', params)
    }
  }
}
</script>
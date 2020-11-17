<template>
  <edit-edo-form
    @onSubmit="on_submit"
    :loading="$fetchState.pending"
    :selectData="dataSelect"
    :models="models">
  </edit-edo-form>
</template>

<script>
import EditEdoForm from '@/components/forms/EditEdo.vue';
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
  components: { EditEdoForm },

  data() {
    return {
      isLoading: false,
      dataSelect: {
        shipperName: ["a", "b"],
        consigneeName: [],
        portOfLoading: [],
        portOfDischarge: [],
        finalDestination: []
      },
      models: {
        ...initialEdo
      }
    }
  },

  fetch() {
    this.$toast.global.app_loading()
    Promise.all ([
      this.get_edo_by_number(),
      // this.get_all_consignee(),
      this.get_all_port_of_loading(),
      this.get_all_port_of_discharge(),
      this.get_all_final_destination()
    ])
    .finally(() => {
      this.$toast.clear()
    })
  },
  fetchOnServer: false,

  methods: {
    /**
     * On submit e-DO
     */
    async on_submit (params, e) {
      try {
        this.$toast.global.app_loading()
        this.isLoading = true
        let edonumber = this.$route.params.id
        const validate = await params.observer.validate()
        if (validate) {
          const response = await this.$axios.put(`/api/e_do/${params.data.edo_id}`, qs.stringify(params.data))
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
    /**
     * Get e-DO by number
     */
    async get_edo_by_number() {
      let edonumber = this.$route.params.id
      await this.$axios.get(`/api/e_do/search?e_do_number=${edonumber}`)
        .then (response => {
          this.models = response.data.data[0]
        })
        .catch (err => {
          const msg = err.response && ` ,${err.response.message}`
          this.$toast.global.app_error(`Failed to get e-DO ${edonumber}${msg}`)
        })
    },
    /**
     * Get all consignee
     */
    async get_all_consignee() {
      await this.$axios.get('/api/e_do/consignee')
      .then (response => {
        this.dataSelect.consigneeName = response.data.data
      })
      .catch (err => {
        const msg = err.response && ` ,${err.response.message}`
        this.$toast.global.app_error(`Failed get consignee${msg}`)
      })
    },
    /**
     * Get all final destination
     */
    async get_all_final_destination() {
      await this.$axios.get('/api/e_do/final_destination')
      .then(response => {
        this.dataSelect.finalDestination = response.data.data
      })
      .catch(err => {
        const msg = err.response && ` ,${err.response.message}`
        this.$toast.global.app_error(`Failed get final destination${msg}`)
      })
    },
    /**
     * Get all
     */
    async get_all_port_of_loading() {
      await this.$axios.get('/api/e_do/port_of_lading')
      .then (response => {
        this.dataSelect.portOfLoading = response.data.data
      })
      .catch (error => {
        const msg = err.response && ` ,${err.response.message}`
        this.$toast.global.app_error(`Failed get port of loading${msg}`)
      })
    },

    async get_all_port_of_discharge() {
      await this.$axios.get('/api/e_do/port_of_discharge')
      .then (response => {
        this.dataSelect.portOfDischarge = response.data.data;
      })
      .catch (error => {
        const msg = err.response && ` ,${err.response.message}`
        this.$toast.global.app_error(`Failed get port of discharge${msg}`)
      })
    },
  }
}
</script>
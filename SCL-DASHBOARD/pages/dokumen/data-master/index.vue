<template>
  <v-container fluid class="px-md-5">
    <!-- Consignee -->
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader :loading="$fetchState.pending" transition="scroll-y-reverse-transition" type="table">
          <ConsigneeForm
            :headers="consignee.headers"
            :data="consignee.data"
            :is-loading="$fetchState.pending || consignee.loading"
            @onCreate="create_consignee"
            @onUpdate="update_consignee"
            @onDelete="delete_consignee"
          />
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <!-- end Consignee -->

    <!-- Port Of Loading -->
    <v-row>
      <v-col cols="12" sm="6">
        <v-skeleton-loader :loading="$fetchState.pending" transition="scroll-y-reverse-transition" type="table">
          <POLForm
            :headers="portOfLoading.headers"
            :data="portOfLoading.data"
            :is-loading="$fetchState.pending || portOfLoading.loading"
            @onCreate="create_p_o_l"
            @onUpdate="update_p_o_l"
            @onDelete="delete_p_o_l"
          />
        </v-skeleton-loader>
      </v-col>
      <!-- end Port Of Loading -->

      <!-- Port Of Discharge -->
      <v-col cols="12" sm="6">
        <v-skeleton-loader :loading="$fetchState.pending" transition="scroll-y-reverse-transition" type="table">
          <PODForm
            :headers="portOfDischarge.headers"
            :data="portOfDischarge.data"
            :is-loading="$fetchState.pending || portOfDischarge.loading"
            @onCreate="create_p_o_d"
            @onUpdate="update_p_o_d"
            @onDelete="delete_p_o_d"
          />
        </v-skeleton-loader>
      </v-col>
      <!-- end Port Of Discharge -->
    </v-row>

    <v-row>
      <!-- Final Destination -->
      <v-col cols="12" sm="6">
        <v-skeleton-loader :loading="$fetchState.pending" transition="scroll-y-reverse-transition" type="table">
          <FinalDestinationForm
            :headers="finalDestination.headers"
            :data="finalDestination.data"
            :is-loading="$fetchState.pending || finalDestination.loading"
            @onCreate="create_final_destination"
            @onUpdate="update_final_destination"
            @onDelete="delete_final_destination"
          />
        </v-skeleton-loader>
      </v-col>
      <!-- end Final Destination -->
    </v-row>
  </v-container>
</template>

<script>
import {
  HeaderTableConsignee,
  HeaderTablePortOfLoading,
  HeaderTablePortOfDischarge,
  HeaderTableFinalDestination
} from '@/utils';
import qs from 'querystring';
import ConsigneeForm from '@/components/forms/master/Consignee.vue';
import POLForm from '@/components/forms/master/PortOfLoading.vue';
import PODForm from '@/components/forms/master/PortOfDischarge.vue';
import FinalDestinationForm from '@/components/forms/master/FinalDestination.vue';

export default {
  meta: {
    crumbs: [{
      text: 'Master',
      to: '/dokumen/data-master',
      exact: true,
      disabled: true
    }]
  },
  components: {
    ConsigneeForm,
    POLForm,
    PODForm,
    FinalDestinationForm
  },
  data () {
    return {
      consignee: {
        headers: HeaderTableConsignee,
        data: [],
        loading: false
      },
      portOfLoading: {
        headers: HeaderTablePortOfLoading,
        data: [],
        loading: false
      },
      portOfDischarge: {
        headers: HeaderTablePortOfDischarge,
        data: [],
        loading: false
      },
      finalDestination: {
        headers: HeaderTableFinalDestination,
        data: [],
        loading: false
      }
    }
  },

  async fetch () {
    this.$toast.global.app_loading()
    await Promise.all([
      this.get_consignee(),
      this.get_p_o_l(),
      this.get_p_o_d(),
      this.get_final_destination()
    ])
    .then(() => {
      this.$toast.clear()
    })
  },
  fetchOnServer: false,

  methods: {
    // Consignee
    async get_consignee() {
      try {
        this.consignee.loading = true
        const response = await this.$axios.get(`/api/e_do/consignee`).then (ress => ress.data);
        if (response) {
          this.consignee.data = response.data
        }
      } catch (error) {
        this.$toast.global.app_error('Failed to get Consignee.')
      } finally {
      this.consignee.loading = false
      }
    },
    async create_consignee(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.post(`/api/e_do/consignee`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success(`Consignee successfully created.`)
        }
      } catch (error) {
        this.$toast.global.app_error(`Consignee failed to create.`)
      } finally {
        await this.get_consignee();
      }
    },
    async update_consignee(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.put(`/api/e_do/consignee/${params.id}`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success(`Consignee with ID ${params.id} successfully updated.`)
        }
      } catch (error) {
        this.$toast.global.app_error(`Consignee with ID ${params.id} failed to update.`)
      } finally {
        await this.get_consignee();
      }
    },
    async delete_consignee(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.delete(`/api/e_do/consignee/${params.id}`)
        this.$toast.global.app_success(`Consignee with ID ${params.id} successfully deleted.`)
      } catch (error) {
        this.$toast.global.app_error(`Consignee with ID ${params.id} failed to delete.`)
      } finally {
        await this.get_consignee();
      }
    },
    // end Consignee

    // Port Of Loading
    async get_p_o_l() {
      try {
        this.portOfLoading.loading = true
        const response = await this.$axios.get(`/api/e_do/port_of_lading`).then (ress => ress.data);
        if (response) {
          this.portOfLoading.data = response.data
        }
      } catch (error) {
        this.$toast.global.app_error('Failed to get Port Of Lading.')
      } finally {
        this.portOfLoading.loading = false
      }
    },
    async create_p_o_l(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.post(`/api/e_do/port_of_lading`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success(`Port Of Lading successfully created.`)
        }
      } catch (error) {
        this.$toast.global.app_error(`Port Of Lading failed to create.`)
      } finally {
        await this.get_p_o_l();
      }
    },
    async update_p_o_l(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.put(`/api/e_do/port_of_lading/${params.Id}`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success(`Port Of Lading with ID ${params.Id} successfully updated.`)
        }
      } catch (error) {
        this.$toast.global.app_error(`Port Of Lading with ID ${params.Id} failed to update.`)
      } finally {
        await this.get_p_o_l();
      }
    },
    async delete_p_o_l(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.delete(`/api/e_do/port_of_lading/${params.Id}`)
        this.$toast.global.app_success(`Port Of Lading with ID ${params.Id} successfully deleted.`)
      } catch (error) {
        this.$toast.global.app_error(`Port Of Lading with ID ${params.Id} failed to delete.`)
      } finally {
        await this.get_p_o_l();
      }
    },
    // end Port Of Loading

    // Port Of Discharge
    async get_p_o_d () {
      try {
        this.portOfDischarge.loading = true
        const response = await this.$axios.get (`/api/e_do/port_of_discharge`).then (ress => ress.data);
        if (response) {
          this.portOfDischarge.data = response.data
        }
      } catch (error) {
        this.$toast.global.app_error ('Failed to get Port Of Discharge.')
      } finally {
        this.portOfDischarge.loading = false
      }
    },
    async create_p_o_d(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.post(`/api/e_do/port_of_discharge`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success(`Port Of Discharge successfully created.`)
        }
      } catch (error) {
        this.$toast.global.app_error(`Port Of Discharge failed to create.`)
      } finally {
        await this.get_p_o_d();
      }
    },
    async update_p_o_d(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.put(`/api/e_do/port_of_discharge/${params.Id}`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success(`Port Of Discharge with ID ${params.Id} successfully updated.`)
        }
      } catch (error) {
        this.$toast.global.app_error(`Port Of Discharge with ID ${params.Id} failed to update.`)
      } finally {
        await this.get_p_o_d();
      }
    },
    async delete_p_o_d(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.delete(`/api/e_do/port_of_discharge/${params.Id}`)
        this.$toast.global.app_success(`Port Of Discharge with ID ${params.Id} successfully deleted.`)
      } catch (error) {
        this.$toast.global.app_error(`Port Of Discharge with ID ${params.Id} failed to delete.`)
      } finally {
        await this.get_p_o_d();
      }
    },
    // end Port Of Discharge

    // Final Destination
    async get_final_destination() {
      try {
        this.finalDestination.loading = true
        const response = await this.$axios.get(`/api/e_do/final_destination`).then(ress => ress.data);
        if (response) {
          this.finalDestination.data = response.data
        }
      } catch (error) {
        this.$toast.global.app_error('Failed to get Final Destination.')
      } finally {
        this.finalDestination.loading = false
      }
    },
    async create_final_destination(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.post(`/api/e_do/final_destination`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success(`Final Destination successfully created.`)
        }
      } catch (error) {
        this.$toast.global.app_error(`Final Destination failed to create.`)
      } finally {
        await this.get_final_destination();
      }
    },
    async update_final_destination(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.put(`/api/e_do/final_destination/${params.Id}`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success(`Final Destination with ID ${params.Id} successfully updated.`)
        }
      } catch (error) {
        this.$toast.global.app_error(`Final Destination with ID ${params.Id} failed to update.`)
      } finally {
        await this.get_final_destination();
      }
    },
    async delete_final_destination(params) {
      try {
        this.$toast.global.app_loading();
        const response = await this.$axios.delete(`/api/e_do/final_destination/${params.Id}`)
        this.$toast.global.app_success(`Final Destination with ID ${params.Id} successfully deleted.`)
      } catch (error) {
        this.$toast.global.app_error(`Final Destination with ID ${params.Id} failed to delete.`)
      } finally {
        await this.get_final_destination();
      }
    },
    // end Final Destination
  }
}
</script>

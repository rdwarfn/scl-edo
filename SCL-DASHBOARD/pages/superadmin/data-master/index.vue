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
            @onCreate="createConsignee"
            @onUpdate="updateConsignee"
            @onDelete="deleteConsignee"
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
            @onCreate="createPOL"
            @onUpdate="updatePOL"
            @onDelete="deletePOL"
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
            @onCreate="createPOD"
            @onUpdate="updatePOD"
            @onDelete="deletePOD"
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
            @onCreate="createFinalDestination"
            @onUpdate="updateFinalDestination"
            @onDelete="deleteFinalDestination"
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
      href: '/admin/data-master',
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
      this.getConsignee (),
      this.getPOL (),
      this.getPOD (),
      this.getFinalDestination ()
    ])
    .then(() => {
      this.$toast.clear()
    })
  },
  fetchOnServer: false,

  methods: {
    // Consignee
    async getConsignee () {
      this.consignee.loading = true
      try {
        const response = await this.$axios.get (`/api/e_do/consignee`).then (ress => ress.data);
        if (response) {
          this.consignee.data = response.data
        }
      } catch (error) {
        this.$toast.global.app_error ('Failed to get Consignee.')
      } finally {
      this.consignee.loading = false
      }
    },
    async createConsignee (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.post (`/api/e_do/consignee`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success (`Consignee successfully created.`)
        }
      } catch (error) {
        this.$toast.global.app_error (`Consignee failed to create.`)
      } finally {
        this.getConsignee ();
      }
    },
    async updateConsignee (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.put (`/api/e_do/consignee/${params.id}`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success (`Consignee with ID ${params.id} successfully updated.`)
        }
      } catch (error) {
        this.$toast.global.app_error (`Consignee with ID ${params.id} failed to update.`)
      } finally {
        this.getConsignee ();
      }
    },
    async deleteConsignee (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.delete (`/api/e_do/consignee/${params.id}`)
        this.$toast.global.app_success (`Consignee with ID ${params.id} successfully deleted.`)
      } catch (error) {
        this.$toast.global.app_error (`Consignee with ID ${params.id} failed to delete.`)
      } finally {
        this.getConsignee ();
      }
    },
    // end Consignee

    // Port Of Loading
    async getPOL () {
      this.portOfLoading.loading = true
      try {
        const response = await this.$axios.get (`/api/e_do/port_of_lading`).then (ress => ress.data);
        if (response) {
          this.portOfLoading.data = response.data
        }
      } catch (error) {
        this.$toast.global.app_error ('Failed to get Port Of Lading.')
      } finally {
        this.portOfLoading.loading = false
      }
    },
    async createPOL (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.post (`/api/e_do/port_of_lading`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success (`Port Of Lading successfully created.`)
        }
      } catch (error) {
        this.$toast.global.app_error (`Port Of Lading failed to create.`)
      } finally {
        this.getPOL ();
      }
    },
    async updatePOL (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.put (`/api/e_do/port_of_lading/${params.Id}`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success (`Port Of Lading with ID ${params.Id} successfully updated.`)
        }
      } catch (error) {
        this.$toast.global.app_error (`Port Of Lading with ID ${params.Id} failed to update.`)
      } finally {
        this.getPOL ();
      }
    },
    async deletePOL (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.delete (`/api/e_do/port_of_lading/${params.Id}`)
        this.$toast.global.app_success (`Port Of Lading with ID ${params.Id} successfully deleted.`)
      } catch (error) {
        this.$toast.global.app_error (`Port Of Lading with ID ${params.Id} failed to delete.`)
      } finally {
        this.getPOL ();
      }
    },
    // end Port Of Loading

    // Port Of Discharge
    async getPOD () {
      this.portOfDischarge.loading = true
      try {
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
    async createPOD (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.post (`/api/e_do/port_of_discharge`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success (`Port Of Discharge successfully created.`)
        }
      } catch (error) {
        this.$toast.global.app_error (`Port Of Discharge failed to create.`)
      } finally {
        this.getPOD ();
      }
    },
    async updatePOD (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.put (`/api/e_do/port_of_discharge/${params.Id}`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success (`Port Of Discharge with ID ${params.Id} successfully updated.`)
        }
      } catch (error) {
        this.$toast.global.app_error (`Port Of Discharge with ID ${params.Id} failed to update.`)
      } finally {
        this.getPOD ();
      }
    },
    async deletePOD (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.delete (`/api/e_do/port_of_discharge/${params.Id}`)
        this.$toast.global.app_success (`Port Of Discharge with ID ${params.Id} successfully deleted.`)
      } catch (error) {
        this.$toast.global.app_error (`Port Of Discharge with ID ${params.Id} failed to delete.`)
      } finally {
        this.getPOD ();
      }
    },
    // end Port Of Discharge

    // Final Destination
    async getFinalDestination () {
      this.finalDestination.loading = true
      try {
        const response = await this.$axios.get (`/api/e_do/final_destination`).then (ress => ress.data);
        if (response) {
          this.finalDestination.data = response.data
        }
      } catch (error) {
        this.$toast.global.app_error ('Failed to get Final Destination.')
      } finally {
        this.finalDestination.loading = false
      }
    },
    async createFinalDestination (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.post (`/api/e_do/final_destination`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success (`Final Destination successfully created.`)
        }
      } catch (error) {
        this.$toast.global.app_error (`Final Destination failed to create.`)
      } finally {
        this.getFinalDestination ();
      }
    },
    async updateFinalDestination (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.put (`/api/e_do/final_destination/${params.Id}`, qs.stringify(params))
        if (response) {
          this.$toast.global.app_success (`Final Destination with ID ${params.Id} successfully updated.`)
        }
      } catch (error) {
        this.$toast.global.app_error (`Final Destination with ID ${params.Id} failed to update.`)
      } finally {
        this.getFinalDestination ();
      }
    },
    async deleteFinalDestination (params) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.delete (`/api/e_do/final_destination/${params.Id}`)
        this.$toast.global.app_success (`Final Destination with ID ${params.Id} successfully deleted.`)
      } catch (error) {
        this.$toast.global.app_error (`Final Destination with ID ${params.Id} failed to delete.`)
      } finally {
        this.getFinalDestination ();
      }
    },
    // end Final Destination
  }
}
</script>

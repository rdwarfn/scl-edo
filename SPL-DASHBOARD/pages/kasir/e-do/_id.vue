<template>
  <div class="px-5 py-5">
    <v-row>
      <!-- Alert Status e-DO -->
      <v-col cols="12">
        <template>
          <v-alert
            v-show="alert.show"
            :icon="alert.icon"
            :type="alert.type"
            width="calc(100vw - 200)"
            transition="slide-x-reverse-transition"
            outlined
          >
            {{ alert.message  }}
          </v-alert>
        </template>
      </v-col>
      <!-- end Alert Status e-DO -->
    </v-row>

    <v-row>
      <!-- Card Status e-DO -->
      <v-col cols="12" sm="6">
        <v-skeleton-loader :loading="$fetchState.pending" type="image" min-width="90" height="104">
          <card-status-edo
            :loading="$fetchState.pending"
            :color="card.color"
            :icon="card.icon"
            :title="card.title"
            :status="card.status"
          />
        </v-skeleton-loader>
      </v-col>
      <!-- end Card Status e-DO -->
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <v-row>
          <!-- Created At -->
          <v-col cols="12" sm>
            <div class="label">Created At</div>
            <div class="font-weight-bold">
              {{ created_at_formated }}
              <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Created At -->

          <!-- Created By -->
          <v-col cols="12" sm>
            <div class="label">Created By</div>
            <div class="font-weight-bold text-capitalize">
              {{ edo.created_by }}
              <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Created By -->

          <!-- Status e-DO -->
          <v-col cols="12" sm>
            <div class="label">Status</div>
            <div class="font-weight-bold" :style="{color: colors(edo.status)}">
              {{ edo.status }}
              <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Status e-DO -->
        </v-row>
      </v-col>

      <v-col cols="12" sm>
        <v-row justify-sm="end">
          <!-- QrCode -->
          <v-skeleton-loader :loading="!edo.edo_number" type="image" width="80" height="80">
            <qrcode
              :value="edo.edo_number"
              :options="{width: 80, height: 80}"
            />
          </v-skeleton-loader>
          <!-- end QrCode -->

          <!-- e-DO Number -->
          <div class="ml-3 d-flex flex-column justify-center">
            <div class="label">e-DO Number</div>
            <div class="font-weight-bold">
              {{ edo.edo_number }}
              <v-skeleton-loader v-if="!edo.status" loading type="text"></v-skeleton-loader>
            </div>
          </div>
          <!-- end e-DO Number -->
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-8" />

    <v-row>
      <v-col>
        <v-row>
          <!-- Shipper name -->
          <v-col cols="12" sm>
            <div class="label">Shipper name</div>
            <div class="text-h5">
              {{ edo. shipper_name }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Shipper name -->

          <!-- Consignee name -->
          <v-col cols="12" sm>
            <div class="label">Consignee name</div>
            <div class="text-h5">
              {{ edo. consignee_name }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Consignee name -->
        </v-row>


        <v-row>
          <!-- Shipper e-mail -->
          <v-col cols="12" sm>
            <div class="label">Shipper e-mail</div>
            <div class="text-h5">
              {{ edo. shipper_email || '-' }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Shipper e-mail -->

          <!-- Consignee e-mail -->
          <v-col cols="12" sm>
            <div class="label">Consignee e-mail</div>
            <div class="text-h5">
              {{ edo. consignee_email }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Consignee e-mail -->
        </v-row>


        <v-row>
          <!-- Shipper address -->
          <v-col cols="12" sm>
            <div class="label">Shipper address</div>
            <div class="text-h5">
              {{ edo. shipper_address }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Shipper address -->

          <!-- Consignee address -->
          <v-col cols="12" sm>
            <div class="label">Consignee address</div>
            <div class="text-h5">
              {{ edo. consignee_address }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Consignee address -->
        </v-row>


        <v-row>
          <!-- Notify -->
          <v-col cols="12" sm>
            <div class="label">Notify</div>
            <div class="text-h5">
              {{ edo. notify }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Notify -->

          <!-- House BL Number -->
          <v-col cols="12" sm>
            <div class="label">House BL Number</div>
            <div class="text-h5">
              {{ edo. house_bl_number }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end House BL Number -->
        </v-row>


        <v-row>
          <!-- Notify address -->
          <v-col cols="12" sm>
            <div class="label">Notify Address</div>
            <div class="text-h5">
              {{ edo. notify }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Notify address -->
        </v-row>


        <v-row>
          <!-- MBL number -->
          <v-col cols="12" sm>
            <div class="label">MB/L Number</div>
            <div class="text-h5">{{ edo. mbl_number }}</div>
          </v-col>
          <!-- end MBL number -->

          <!-- House BL date -->
          <v-col cols="12" sm>
            <div class="label">House BL Date</div>
            <div class="text-h5">
              {{ edo. house_bl_date }}
                <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end House BL date -->
        </v-row>


        <v-row>
          <!-- Arrival date -->
          <v-col cols="12" sm>
            <div class="label">Arrival Date (ETA)</div>
            <div class="text-h5">
              {{ edo. arrival_date }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Arrival date -->

          <!-- Place of receipt -->
          <v-col cols="12" sm>
            <div class="label">Place of receipt</div>
            <div class="text-h5">
              {{ edo. place_of_receipt }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Place of receipt -->
        </v-row>


        <v-row>
          <!-- Container seal number -->
          <v-col cols="12" sm>
            <div class="label">Container/Seal number</div>
            <div class="text-h5">
              {{ edo. container_seal_number }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Container seal number -->

          <!-- Ocean vessel -->
          <v-col cols="12" sm>
            <div class="label">Ocean vessel</div>
            <div class="text-h5">
              {{ edo. ocean_vessel }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Ocean vessel -->
        </v-row>


        <v-row>
          <!-- Port of lading -->
          <v-col cols="12" sm>
            <div class="label">Port of lading</div>
            <div class="text-h5">
              {{ edo. port_of_loading }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Port of lading -->

          <!-- Voyage number -->
          <v-col cols="12" sm>
            <div class="label">Voyage Number</div>
            <div class="text-h5">
              {{ edo. voyage_number }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Voyage number -->
        </v-row>


        <v-row>
          <!-- Final destination -->
          <v-col cols="12" sm>
            <div class="label">Final Destination</div>
            <div class="text-h5">
              {{ edo. final_destination }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Final destination -->

          <!-- Port of discharges -->
          <v-col cols="12" sm>
            <div class="label">Port of discharges</div>
            <div class="text-h5">
              {{ edo. port_of_discharges }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Port of discharges -->
        </v-row>


        <v-row>
          <!-- Gross weight -->
          <v-col cols="12" sm>
            <div class="label">Gross weight (Kg)</div>
            <div class="text-h5">
              {{ edo. gross_weight }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Gross weight -->

          <!-- Package -->
          <v-col cols="12" sm>
            <div class="label">Package</div>
            <div class="text-h5">
              {{ edo. package }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Package -->
        </v-row>


        <v-row>
          <!-- Number of package -->
          <v-col cols="12" sm>
            <div class="label">Number of Package</div>
            <div class="text-h5">
              {{ edo. number_of_package }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Number of package -->

          <!-- Measurement -->
          <v-col cols="12" sm>
            <div class="label">Measurement</div>
            <div class="text-h5">
              {{ edo. measurment }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Measurement -->
        </v-row>


        <v-row>
          <!-- Description of goods -->
          <v-col cols="12" sm>
            <div class="label">Description of goods</div>
            <div class="text-h5">
              {{ edo. description_of_goods }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Description of goods -->

          <!-- Marks and number -->
          <v-col cols="12" sm>
            <div class="label">Marks and number</div>
            <div class="text-h5">
              {{ edo. marks_and_number }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Marks and number -->
        </v-row>
      </v-col>
    </v-row>

    <v-divider class="my-7" />

    <v-row justify="end" class="text-right">
      <v-btn color="primary" @click="() => $router.back()">
        Back to dashboard
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import _ from 'lodash';
import CardStatusEdo from '@/components/CardStatusEdo.vue';
import { getColorStatus } from '@/utils';
import * as Colors from '@/utils/colors';

export default {
  meta: {
    crumbs: [{
      to: '/',
      text: 'Dashboard',
      exact: true,
      replace: true,
      // disabled: false,
    },{
      to: `/kasir/e-do`,
      exact: true,
      text: 'Detail e-DO',
      disabled: true,
    }]
  },

  data () {
    return {
      edo: {},
      confirmDelete: "",
      alert: {
        show: false,
        message: "",
        icon: "mdi-checkbox-marked-circle-outline",
        type: "success"
      },
      card: {
        title: 'e-DO Status',
        icon: '',
        color: '',
        status: ''
      }
    }
  },

  async fetch () {
    this.$toast.global.app_loading()
    try {
      await this.search_edo()
      this.alert.message = `e-DO ${this.$route.params.id} is valid from SCL System`;
      this.alert.type = "success"
      this.alert.icon = "mdi-checkbox-marked-circle-outline"
    } catch (error) {
      this.alert.message = `e-DO ${this.$route.params.id} is not valid or has been deleted from SCL System`;
      this.alert.type = "error"
      this.alert.icon = "mdi-close-circle-outline"
    } finally {
      this.alert.show = true
    }
  },
  fetchOnServer: false,

  watch: {
    edo(newVal) {
      const { status } = newVal
      this.get_card_status(status)
    }
  },

  computed: {
    isNotEmpty() { return !_.isEmpty(this.edo) },
    isCanPickedUp() { return this.isNotEmpty && _.isEqual (this.edo.status, 'PAID') },
    created_at_formated() {
      const dateFormated = this.$moment(this.edo.created_at, "DD-MM-YYYY hh:mm:ss", 'id');
      return dateFormated.isValid() ? dateFormated.format('DD/MM/YYYY hh:mm:ss') : this.edo.created_at;
    }
  },

  methods: {
    colors (params) { return getColorStatus (params) },
    async search_edo() {
      try {
        const response = await this.$axios.get(`/api/e_do/search?e_do_number=${this.$route.params.id}`)
        if (response) {
          const { data } = response.data
          this.edo = data[0]
        }
      } catch (error) {
        this.$toast.global.app_error(`Failed to get e-DO` + err.response.message)
      }
    },
    get_card_status(params) {
      const context = _.upperCase(params);
      this.card.status = _.isEqual("Hold on") ? "On Hold" : _.capitalize(params)
      switch (context) {
        case 'PAID':
          this.card.icon = "mdi-checkbox-marked-circle-outline"
          this.card.color = Colors.primary
          break;
        case 'REJECTED':
          this.card.icon = "mdi-close-circle-outline"
          this.card.color = Colors.danger
          break;
        case 'RELEASED':
          this.card.icon = "mdi-truck-outline"
          this.card.color = Colors.purple
          break;
        case 'HOLD ON':
          this.card.icon = "mdi-delta"
          this.card.color = Colors.warning
          break;
        default:
          this.card.icon = "mdi-magnify"
          this.card.color = Colors.link
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .label {
    color: #B5B5B5 !important;
  }
</style>
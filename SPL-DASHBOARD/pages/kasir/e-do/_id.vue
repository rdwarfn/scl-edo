<template>
  <div class="px-5 py-5">
    <v-row>
      <v-col cols="12">
        <template>
          <v-alert
            v-show="alert.show"
            width="calc(100vw - 200)"
            icon="mdi-checkbox-marked-circle-outline"
            outlined
            type="success"
          >
            {{ alert.message  }}
          </v-alert>
        </template>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col cols="12" sm>
            <div class="label">Created At</div>
            <div class="font-weight-bold">
              {{ edo.created_at }}
              <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Created By</div>
            <div class="font-weight-bold text-capitalize">
              {{ edo.created_by }}
              <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Status</div>
            <div class="font-weight-bold" :style="{color: colors(edo.status)}">
              {{ edo.status }}
              <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" sm>
        <v-row justify-sm="end">
          <v-skeleton-loader :loading="!edo.edo_number" type="image" width="80" height="80">
            <qrcode
              :value="edo.edo_number"
              :options="{width: 80, height: 80}"
            />
          </v-skeleton-loader>
          <div class="ml-3 d-flex flex-column justify-center">
            <div class="label">e-DO Number</div>
            <div class="font-weight-bold">
              {{ edo.edo_number }}
              <v-skeleton-loader v-if="!edo.status" loading type="text"></v-skeleton-loader>
            </div>
          </div>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-8" />

    <v-row>
      <v-col>
        <v-row>
          <v-col cols="12" sm>
            <div class="label">Shipper name</div>
            <div class="text-h5">
              {{ edo. shipper_name }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Consignee name</div>
            <div class="text-h5">
              {{ edo. consignee_name }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Shipper e-mail</div>
            <!-- belum ada field di api -->
            <div class="text-h5">
              {{ edo. shipper_email || '-' }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Consignee e-mail</div>
            <div class="text-h5">
              {{ edo. consignee_email }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <!-- belum ada field api -->
            <div class="label">Shipper address</div>
            <div class="text-h5">
              {{ edo. shipper_address }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <!-- belum ada field api -->
            <div class="label">Consignee address</div>
            <div class="text-h5">
              {{ edo. consignee_address }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Notify</div>
            <div class="text-h5">
              {{ edo. notify }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">House BL Number</div>
            <div class="text-h5">
              {{ edo. house_bl_number }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Notify Address</div>
            <div class="text-h5">
              {{ edo. notify }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">MB/L Number</div>
            <div class="text-h5">{{ edo. mbl_number }}</div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">House BL Date</div>
            <!-- belum ada field api -->
            <div class="text-h5">
              {{ edo. house_bl_date }}
                <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Arrival Date (ETA)</div>
            <div class="text-h5">
              {{ edo. arrival_date }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Place of receipt</div>
            <div class="text-h5">
              {{ edo. place_of_receipt }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Container/Seal number</div>
            <div class="text-h5">
              {{ edo. container_seal_number }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Ocean vessel</div>
            <div class="text-h5">
              {{ edo. ocean_vessel }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Port of loading</div>
            <div class="text-h5">
              {{ edo. port_of_loading }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Voyage Number</div>
            <div class="text-h5">
              {{ edo. voyage_number }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Final Destination</div>
            <div class="text-h5">
              {{ edo. final_destination }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Port of discharges</div>
            <div class="text-h5">
              {{ edo. port_of_discharges }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Gross weight (Kg)</div>
            <div class="text-h5">
              {{ edo. gross_weight }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Package</div>
            <div class="text-h5">
              {{ edo. package }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Number of Package</div>
            <!-- belum ada field di api -->
            <div class="text-h5">
              {{ edo. package_number }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Measurement</div>
            <div class="text-h5">
              {{ edo. measurment }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Description of goods</div>
            <div class="text-h5">
              {{ edo. description_of_goods }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Marks and number</div>

            <div class="text-h5">
              {{ edo. marks_and_number }}
              <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
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
import { getColorStatus } from '@/utils';

export default {
  meta: {
    crumbs: [{
      to: '/',
      text: 'Dashboard',
      replace: true,
      // disabled: false,
    },{
      to: `/kasir/e-do`,
      text: 'Detail e-DO',
      disabled: true,
    }]
  },

  async fetch () {
    this.$toast.global.app_loading()
    try {
      const response = await this.$axios.get(`/api/e_do/search?e_do_number=${this.$route.params.id}`)
      if (response.status === 200) {
        const { data } = response.data
        this.edo = data[0]
        this.alert.message = `e-DO ${this.$route.params.id} is valid from SCL System`;
      }
    } catch (error) {
      this.$toast.global.app_error (`Failed to get e-DO` + err.response.message)
      this.alert.message = `e-DO ${this.$route.params.id} is not valid or has been deleted from SCL System`;
    } finally {
      this.alert.show = true
    }
  },
  fetchOnServer: false,

  data () {
    return {
      edo: {},
      confirmDelete: "",
      alert: {
        show: false,
        message: ""
      }
    }
  },

  computed: {
    isNotEmpty () {
      return !_.isEmpty(this.edo)
    },
    isCanPickedUp () {
      return this.isNotEmpty && _.isEqual (this.edo.status, 'PAID')
    }
  },

  methods: {
    colors (params) { return getColorStatus (params) },
  }
}
</script>

<style lang="scss" scoped>
  .label {
    color: #B5B5B5 !important;
  }
</style>
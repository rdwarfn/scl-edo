<template>
  <v-container fluid class="px-md-5 py-5">
    <!-- <v-dialog transition="slide-y-transition" max-width="768px" v-model="reject.showDescriptionDialog" persistent>
      <v-alert
        tile
        border="right"
        colored-border
        type="error"
        elevation="2"
        class="pt-5 ma-0"
      >
        <validation-observer ref="observer" v-slot="{handleSubmit, invalid}">
          <v-card flat class="pa-0 mt-n1" tag="form" @submit.prevent="handleSubmit(handle_reject)">
            <v-card-title class="pt-0">
              Reject this e-DO &nbsp;<span style="color: #3273DC !important">{{ edo.edo_number }}</span> ?
              <v-spacer></v-spacer>
              <v-btn icon @click.prevent="close_dialog_reject">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="py-0">
              <validation-provider name="Note rejection" rules="required" v-slot="{errors}">
                <label for="rejectNotes">Notes</label>
                <v-textarea
                  id="rejectNotes"
                  class="mt-3"
                  v-model="reject.description"
                  :loading="reject.loading"
                  :disabled="reject.loading"
                  :error-messages="errors"
                  placeholder="Enter your comment here"
                  solo
                ></v-textarea>
              </validation-provider>
            </v-card-text>

            <v-card-actions class="px-5">
              <v-spacer></v-spacer>
              <v-btn text color="error" @click.prevent="close_dialog_reject">Cancel</v-btn>
              <v-btn
                color="error"
                :disabled="reject.loading || invalid"
                :loading="reject.loading"
                type="submit"
              >Yes, Reject</v-btn>
            </v-card-actions>
          </v-card>
        </validation-observer>
      </v-alert>
    </v-dialog> -->

    <!-- dialog house bl number - reject -->
    <dialog-house-bl-number
      :loading="reject.loading"
      :dialog="reject.showHouseBLDialog"
      @onSubmit="on_submit_dialog_house_bl_reject"
      @onCancel="close_dialog_reject"
    ></dialog-house-bl-number>
    <!-- end dialog house bl number - reject -->

    <!-- Dialog Reject -->
    <dialog-rejection-edo
      :loading="reject.loading"
      :dialog="reject.showDescriptionDialog"
      :edo-number="edo.edo_number"
      @onSubmit="on_submit_dialog_reject_description"
      @onCancel="close_dialog_reject"
    >
    </dialog-rejection-edo>
    <!-- End Dialog Reject -->


    <!-- dialog house bl number - on hold -->
    <dialog-house-bl-number
      :dialog="house_bl.showDialog"
      :loading="house_bl.loading"
      @onSubmit="on_dialog_house_bl_on_hold_submit"
      @onCancel="close_dialog_house_bl_on_hold"
    ></dialog-house-bl-number>
    <!-- end dialog house bl number - on hold -->

    <!-- Alert Status e-DO -->
    <v-alert
      :outlined="alertStatus.outline"
      transition="slide-x-reverse-transition"
      :color="alertStatus.color"
      :value="alertStatus.show"
      :icon="alertStatus.icon"
    >
      {{ alertStatus.message }}
    </v-alert>
    <!-- end Alert Status e-DO -->

    <v-row class="mt-8">
      <v-col cols="auto">
        <!-- Action Print -->
        <v-btn class="mr-3" @click="crete_pdf" :disabled="$fetchState.pending" :loading="$fetchState.pending">
          Print <v-icon class="ml-2">mdi-printer</v-icon>
        </v-btn>

        <!-- Action Send to Consignee  -->
        <v-btn :dark="isCanSend" color="#00D1B2" :disabled="!isCanSend" :loading="$fetchState.pending" @click.prevent="">
          Send to Consignee <v-icon class="ml-2">mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
      </v-col>

      <v-col class="text-right">
        <!-- Action Hold -->
        <v-btn class="mr-3" color="warning" @click.prevent="open_dialog_house_bl_on_hold" :disabled="!isCanReissue" :loading="$fetchState.pending">
          Hold this e-DO <v-icon class="ml-2">mdi-delta</v-icon>
        </v-btn>

        <!-- Action Reject -->
        <v-btn :dark="isCanReject" color="#FF3860" :disabled="!isCanReject" :loading="$fetchState.pending" @click.prevent="open_dialog_house_bl_reject">
          Reject <v-icon class="ml-2">mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>


    <v-row align-md="center">
      <v-col cols="12" sm="6">
        <v-row no-gutters>
          <!-- Created By e-DO -->
          <v-col>
            <div class="label">Created At</div>
            <div class="font-weight-bold">
              {{ edo.created_at }} <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Created By e-DO -->
          <v-col>
            <div class="label">Created By</div>
            <div class="font-weight-bold text-capitalize">
              {{ edo.created_by }} <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Status e-DO -->
          <v-col>
            <div class="label">Status</div>
            <div class="font-weight-bold" :style="{color: colors(edo.status)}">
              {{ edo.status }} <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-row no-gutters justify="end">
          <!-- QrCode-->
          <v-skeleton-loader :loading="!edo.edo_number" type="image" width="80" height="80">
            <qrcode
              :value="edo.edo_number"
              :options="{width: 80, height: 80}"
            />
          </v-skeleton-loader>
          <!-- e-DO Number -->
          <div class="ml-3 d-flex flex-column justify-center">
            <div class="label">e-DO Number</div>
            <div class="font-weight-bold">
              {{ edo.edo_number }} <v-skeleton-loader v-if="!edo.status" loading type="text"></v-skeleton-loader>
            </div>
          </div>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-8" />

    <v-row>
      <v-col>
        <v-row>
          <!-- Shipper Name -->
          <v-col cols="12" sm>
            <div class="label">Shipper name</div>
            <div class="text-h5">
              {{ edo. shipper_name }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Consignee Name -->
          <v-col cols="12" sm>
            <div class="label">Consignee name</div>
            <div class="text-h5">
              {{ edo. consignee_name }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Shipper e-Mail -->
          <v-col cols="12" sm>
            <div class="label">Shipper e-mail</div>
            <div class="text-h5">
              {{ edo. shipper_email || '-' }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Consignee e-Mail -->
          <v-col cols="12" sm>
            <div class="label">Consignee e-mail</div>
            <div class="text-h5">
              {{ edo. consignee_email }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Shipper Address -->
          <v-col cols="12" sm>
            <div class="label">Shipper address</div>
            <div class="text-h5">
              {{ edo. shipper_address || '-' }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Consignee Address -->
          <v-col cols="12" sm>
            <div class="label">Consignee address</div>
            <div class="text-h5">
              {{ edo. consignee_address || '-' }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Notify -->
          <v-col cols="12" sm>
            <div class="label">Notify</div>
            <div class="text-h5">
              {{ edo. notify }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- House BL Number -->
          <v-col cols="12" sm>
            <div class="label">House BL Number</div>
            <div class="text-h5">
              {{ edo. house_bl_number }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Notify Address -->
          <v-col cols="12" sm>
            <div class="label">Notify Address</div>
            <div class="text-h5">
              {{ edo. notify }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- MB/L Number -->
          <v-col cols="12" sm>
            <div class="label">MB/L Number</div>
            <div class="text-h5">{{ edo. mbl_number }}</div>
          </v-col>
          <!-- House BL Date -->
          <v-col cols="12" sm>
            <div class="label">House BL Date</div>
            <div class="text-h5">
              {{ edo. house_bl_date }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Arrival Date -->
          <v-col cols="12" sm>
            <div class="label">Arrival Date (ETA)</div>
            <div class="text-h5">
              {{ edo. arrival_date }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Place of Receipt -->
          <v-col cols="12" sm>
            <div class="label">Place of receipt</div>
            <div class="text-h5">
              {{ edo. place_of_receipt }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Container / Seal Number -->
          <v-col cols="12" sm>
            <div class="label">Container/Seal number</div>
            <div class="text-h5">
              {{ edo. container_seal_number }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Ocean Vessel -->
          <v-col cols="12" sm>
            <div class="label">Ocean vessel</div>
            <div class="text-h5">
              {{ edo. ocean_vessel }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Port of lading -->
          <v-col cols="12" sm>
            <div class="label">Port of lading</div>
            <div class="text-h5">
              {{ edo. port_of_loading }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Voyage Number -->
          <v-col cols="12" sm>
            <div class="label">Voyage Number</div>
            <div class="text-h5">
              {{ edo. voyage_number }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Final Destination -->
          <v-col cols="12" sm>
            <div class="label">Final Destination</div>
            <div class="text-h5">
              {{ edo. final_destination }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Port of Discharges -->
          <v-col cols="12" sm>
            <div class="label">Port of discharges</div>
            <div class="text-h5">
              {{ edo. port_of_discharges }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Gross Weight -->
          <v-col cols="12" sm>
            <div class="label">Gross weight (Kg)</div>
            <div class="text-h5">
              {{ edo. gross_weight }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Package -->
          <v-col cols="12" sm>
            <div class="label">Package</div>
            <div class="text-h5">
              {{ edo. package }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Number of Package -->
          <v-col cols="12" sm>
            <div class="label">Number of Package</div>
            <div class="text-h5">
              {{ edo. number_of_package }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Measurement -->
          <v-col cols="12" sm>
            <div class="label">Measurement</div>
            <div class="text-h5">
              {{ edo. measurment }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <!-- Description of goods -->
          <v-col cols="12" sm>
            <div class="label">Description of goods</div>
            <div class="text-h5">
              {{ edo. description_of_goods }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- Marks and Number -->
          <v-col cols="12" sm>
            <div class="label">Marks and number</div>
            <div class="text-h5">
              {{ edo. marks_and_number }} <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
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
  </v-container>
</template>

<script>
import _ from 'lodash';
import qs from 'querystring';
import pdfmake from 'pdfmake';
import DialogRejectionEdo from '@/components/DialogRejectionEdo.vue';
import {
  getColorStatus,
  isCanReject,
  isCanSendToConsignee
} from '@/utils';
import {
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from 'vee-validate';
import DialogHouseBlNumber from '@/components/DialogHouseBlNumber.vue';


setInteractionMode ('eager');
export default {
  components: {
    DialogHouseBlNumber,
    ValidationObserver,
    ValidationProvider,
  },

  meta: {
    crumbs: [{
      to: '/admin',
      exact: true,
      text: 'Dashboard',
    },{
      text: 'Detail e-DO',
    }]
  },
  data () {
    return {
      edo: {},
      reject: {
        loading: false,
        showHouseBLDialog: false,
        showDescriptionDialog: false,
        formDialog: {
          description: null,
          house_bl_number: null,
        }
      },
      alertStatus: {
        show: false,
        message: '',
        color: '',
        icon: 'mdi-checkbox-marked-circle-outline',
        outline: true
      },
      house_bl: {
        showDialog: false,
        loading: false
      }
    }
  },
  async fetch () {
    this.$toast.global.app_loading()
    await Promise.all([
      this.get_edo_by_id()
    ])
    .then (() => {
      this.$toast.clear()
    })
  },
  fetchOnServer: false,

  watch: {
    edo (val) {
      const user_role = this.$auth.hasScope('admin') ? 'Superadmin' : ''
      if (val.status !== 'UNPAID' && val.status !== 'PAID' && val.status !== 'REISSUED') {
        let statusReleased = val.status === 'RELEASED' &&
          `e-DO ${val.edo_number} has been Released at ${(val.released_at)}`
        let statusRejected = val.status === 'REJECTED' &&
          `e-DO ${val.edo_number} has been Rejected at ${val.rejected_at}`
        let statusOnHold = val.status == 'HOLD ON' &&
          `e-DO ${val.edo_number} is Hold by ${user_role} ${this.$store.state.auth.user.name}`
        this.alertStatus.message = statusReleased || statusRejected || statusOnHold
        this.alertStatus.color = statusReleased ? 'purple' : statusRejected ? 'error' : 'warning'
        // this.alertStatus.outline = !statusOnHold
        this.alertStatus.icon = statusOnHold ? 'mdi-delta' : this.alertStatus.icon
        // 'rgba(255, 221, 87, 0.15)'
        this.alertStatus.show = true
      }
    }
  },
  computed: {
    isNotEmpty () { return !_.isEmpty(this.edo) },
    isCanSend () { return this.isNotEmpty && isCanSendToConsignee(this.edo.status) },
    isCanReject () { return this.isNotEmpty && isCanReject (this.edo.status) },

    isCanReissue () {
      if (this.isNotEmpty && _.upperCase(this.edo.status) === 'PAID') {
        return true
      } else {
        return false
      }
      // else if (this.isNotEmpty && _.upperCase(this.edo.status) === 'REJECTED') {
      //   return true
      // }
    },
  },

  methods: {
    colors (params) { return getColorStatus (params) },
    /**
     * Get e-DO By ID
     */
    async get_edo_by_id () {
      try {
        const response = await this.$axios.get(`/api/e_do/${this.$route.params.id}`)
        if (response.status === 200) {
          const { data } = response.data
          this.edo = data[0]
        }
      } catch (error) {
        this.$toast.global.app_error (`Failed to get e-DO ${this.$route.params.id}`)
      }
    },
    /**
     * Block Reissue / on Hold Action
     */
    /**
     * Open dialog house bl - on hold
     */
    open_dialog_house_bl_on_hold() {
      this.house_bl.showDialog = true
    },
    /**
     * Close dialog house bl - on hold
     */
    close_dialog_house_bl_on_hold() {
      this.house_bl.showDialog = false
    },
    /**
     * On submit house bl - on hold
     */
    on_dialog_house_bl_on_hold_submit(data) {
      console.log(data);
      this.handle_reissue_on_hold(this.edo.edo_id, this.edo.edo_number, data.form)
    },
    /**
     * Handle Action Reissued / On Hold
     */
    async handle_reissue_on_hold(edo_id, edo_number, house_bl_number) {
      this.$toast.global.app_loading ();
      this.house_bl.loading = true
      try {
        const response = await this.$axios.put(`/api/e_do/reissued/${edo_id}`, qs.stringify(house_bl_number))
        this.$toast.clear()
        this.$toast.global.app_success(`e-DO ${edo_number} successfully Hold.`)
      } catch (error) {
        this.$toast.clear()
        this.$toast.global.app_error(`${error.response.data.status}`)
      } finally {
        this.house_bl.loading = false
        this.$fetch ();
        this.close_dialog_house_bl_on_hold();
      }
    },
    /**
     * End Block Reissued Action
     */

    /**
     * Block Action Reject
     */
    /**
     * Open dialog house bl
     */
    open_dialog_house_bl_reject() {
      this.reject.showHouseBLDialog = true
    },
    /**
     * Close dialog house bl & description
     */
    close_dialog_reject() {
      this.reject.showHouseBLDialog = false
      this.reject.showDescriptionDialog = false
    },
    /**
     * On submit house bl form dialog - reject
     */
    on_submit_dialog_house_bl_reject(data) {
      try {
        this.reject.formDialog = _.assign(this.reject.formDialog, data.form)
      } finally {
        this.reject.showHouseBLDialog = false
        this.reject.showDescriptionDialog = true
      }
    },
    /**
     * On submit description form dialog - reject
     */
    async on_submit_dialog_reject_description(data) {
      console.log(this.reject.formDialog);
      try {
        this.reject.loading = true
        this.reject.formDialog = _.assign(this.reject.formDialog, data.form)
        await this.handle_reject()
      } finally {
        this.reject.loading = false
        this.reject.showDescriptionDialog = false
        await this.$fetch()
      }
    },
    /**
     * Action Reject
     */
    async handle_reject() {
      try {
        this.$toast.global.app_loading()
        const response = await this.$axios.put(
          `/api/e_do/reject/${this.edo.edo_id}`,
          qs.stringify(this.reject.formDialog)
        )
        if (response) {
          this.$toast.global.app_success(`e-DO ${this.edo.edo_number} successfully rejected.`)
        }
      } catch (error) {
        this.$toast.clear()
        this.$toast.global.app_error(`e-DO ${this.edo.edo_number} failed to reject.`)
      }
    },

    to_data_url (url, callback) {
      let xhr = new XMLHttpRequest()
      xhr.onload = function () {
        let reader = new FileReader()
        reader.onloadend = function () {
          callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.open('GET', url)
      xhr.responseType = 'blob'
      xhr.send()
    },

    crete_pdf (e) {
      let edo = this.edo;
      let dateNow = this.$moment().format('DD/MM/YYYY');

      this.to_data_url(require('@/assets/images/logo-scl.png'), function (dataURL) {
        let docDefinition = {
          content: [
            {
              table: {
                widths: ['55%', '*'],
                headerRows: 2,
                body: [
                  [
                    {
                      rowSpan: 2,
                      text: [
                        {
                          text: 'Shipper\n',
                          style: 'label'
                        },
                        {
                          text: edo.shipper_name,
                          style: 'content'
                        }
                      ]
                    },
                    {
                      layout: 'noBorders',
                      table: {
                        widths: ['*', '*'],
                        body: [
                          [
                            [{
                              text: 'D/O No.',
                              style: 'label'
                            },
                            {
                              text: edo.edo_number,
                              style: 'content'
                            }],

                            [{
                              text: 'Print Date',
                              style: 'label'
                            },
                            {
                              text: dateNow,
                              style: 'content'
                            }],
                          ]
                        ]
                      }
                    }
                  ],

                  [
                    {},
                    {
                      layout: 'noBorders',
                      table: {
                        widths: ['*', '*'],
                        body: [
                          [
                            [{
                              text: 'House B/L No.',
                              style: 'label'
                            },
                            {
                              text: edo.house_bl_number,
                              style: 'content'
                            }],

                            [{
                              text: 'MB/L No.',
                              style: 'label'
                            },
                            {
                              text: edo.mbl_number,
                              style: 'content'
                            }],
                          ]
                        ]
                      }
                    },
                  ],

                  [
                    {
                      text: [
                        {
                          text: 'Consignee\n',
                          style: 'label'
                        },
                        {
                          text: edo.consignee_name,
                          style: 'content'
                        }
                      ]
                    },
                    {
                      rowSpan: 2,
                      layout: 'noBorders',
                      table: {
                        widths: ['*'],
                        body: [
                          [
                            {
                              image: dataURL,
                              width: 150,
                              margin: [0, 2, 0, 10]
                            }
                          ],
                          [
                            {
                              qr: edo.edo_number,
                              fit: '70'
                            }
                          ]
                        ]
                      },
                      alignment: 'center',
                    }
                  ],

                  [
                    {
                      text: [
                        {
                          text: 'Notify\n',
                          style: 'label'
                        },
                        {
                          text: edo.notify,
                          style: 'content'
                        }
                      ]
                    },
                    {}
                  ]
                ]
              }
            },
            {
              table: {
                widths: ['*', '*', '*'],
                body: [
                  [
                    {
                      text: [
                        {
                          text: 'Pre-carriage by\n',
                          style: 'label'
                        },
                        {
                          text: '',
                          style: 'content'
                        }
                      ]
                    },
                    {
                      text: [
                        {
                          text: 'Place Of Receipt\n',
                          style: 'label'
                        },
                        {
                          text: edo.place_of_receipt,
                          style: 'content'
                        }
                      ]
                    },
                    {
                      text: [
                        {
                          text: 'Arrival Date\n',
                          style: 'label'
                        },
                        {
                          text: edo.arrival_date,
                          style: 'content'
                        }
                      ]
                    },
                  ],

                  [
                    {
                      text: [
                        {
                          text: 'Ocean Vessel\n',
                          style: 'label'
                        },
                        {
                          text: edo.ocean_vessel,
                          style: 'content'
                        }
                      ]
                    },
                    {
                      text: [
                        {
                          text: 'Voyage No.\n',
                          style: 'label'
                        },
                        {
                          text: edo.voyage_number,
                          style: 'content'
                        }
                      ]
                    },
                    {
                      text: [
                        {
                          text: 'Container/Seal no.\n',
                          style: 'label'
                        },
                        {
                          text: edo.container_seal_number,
                          style: 'content'
                        }
                      ]
                    },
                  ],

                  [
                    {
                      text: [
                        {
                          text: 'Port Of Lading\n',
                          style: 'label'
                        },
                        {
                          text: edo.port_of_loading,
                          style: 'content'
                        }
                      ]
                    },
                    {
                      text: [
                        {
                          text: 'Port Of Discharges\n',
                          style: 'label'
                        },
                        {
                          text: edo.port_of_discharges,
                          style: 'content'
                        }
                      ]
                    },
                    {
                      text: [
                        {
                          text: 'Final Destination\n',
                          style: 'label'
                        },
                        {
                          text: edo.final_destination,
                          style: 'content'
                        }
                      ]
                    },
                  ],

                  [
                    {
                      colSpan: 2,
                      text: [
                        {
                          text: 'Description Of Goods\n',
                          style: 'label'
                        },
                        {
                          text: edo.description_of_goods,
                          style: 'content'
                        }
                      ]
                    },
                    {},
                    {
                      layout: 'noBorders',
                      table: {
                        body: [
                          [
                            {
                              text: [
                                {
                                  text: 'Gross Weight\n',
                                  style: 'label'
                                },
                                {
                                  text: `${edo.gross_weight} Kgm`,
                                  style: 'content'
                                }
                              ],
                              margin: [0,0,0,10]
                            }
                          ],
                          [
                            {
                              text: [
                                {
                                  text: 'Measurement\n',
                                  style: 'label'
                                },
                                {
                                  text: edo.measurment,
                                  style: 'content'
                                }
                              ],
                              margin: [0,10,0,10]
                            }
                          ],
                          [
                            {
                              text: [
                                {
                                  text: 'Package\n',
                                  style: 'label'
                                },
                                {
                                  text: edo.package,
                                  style: 'content'
                                }
                              ],
                              margin: [0,10,0,5]
                            }
                          ]
                        ]
                      }
                    }
                  ],

                  [
                    {
                      colSpan: 3,
                      text: [
                        {
                          text: 'Marks & Numbers\n',
                          style: 'label'
                        },
                        {
                          text: edo.marks_and_number,
                          style: 'content'
                        }
                      ]
                    }
                  ]
                ]
              }
            }
          ],
          defaultStyle: {
            lineHeight: 1.2,
          },
          styles: {
            label: {
              fontSize: 8,
            },
            content: {
              bold: true,
              fontSize: 10
            }
          }
        };
        pdfmake.fonts = {
          Roboto: {
            normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
            bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
            italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
            bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
          },
        }
        return pdfmake.createPdf (docDefinition).print();
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .label {
    color: #B5B5B5 !important;
  }
</style>

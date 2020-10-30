<template>
  <v-container fluid class="px-md-5 py-5">
    <v-dialog transition="slide-y-transition" max-width="768px" v-model="reject.showDialog" persistent>
      <v-alert
        tile
        border="right"
        colored-border
        type="error"
        elevation="2"
        class="pt-5 ma-0"
      >
        <validation-observer ref="observer" v-slot="{handleSubmit, invalid}">
          <v-card flat class="pa-0 mt-n1" tag="form" @submit.prevent="handleSubmit(_handleReject)">
            <v-card-title class="pt-0">
              Reject this e-DO &nbsp;<span style="color: #3273DC !important">{{ edo.edo_number }}</span> ?
              <v-spacer></v-spacer>
              <v-btn icon @click.prevent="_closeDialogReject">
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
              <v-btn text color="error" @click.prevent="_closeDialogReject">Cancel</v-btn>
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
    </v-dialog>

    <v-alert
      outlined
      transition="slide-x-reverse-transition"
      :color="alertStatus.color"
      :value="alertStatus.show"
      icon="mdi-checkbox-marked-circle-outline"
    >
      {{ alertStatus.message }}
    </v-alert>

    <v-row class="mt-8">
      <v-col cols="auto">
        <v-btn class="mr-3" @click="cretePdf" :disabled="$fetchState.pending" :loading="$fetchState.pending">
          Print <v-icon class="ml-2">mdi-printer</v-icon>
        </v-btn>

        <v-btn :dark="isCanSend" color="#00D1B2" :disabled="!isCanSend" :loading="$fetchState.pending" @click.prevent="">
          Send to Consignee <v-icon class="ml-2">mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
      </v-col>

      <v-col class="text-right">
        <v-btn class="mr-3" color="primary" v-show="isCanReissue" @click="_handleReissue (edo.edo_id, edo.edo_number)" :disabled="$fetchState.pending" :loading="$fetchState.pending">
          Re-Issue <v-icon class="ml-2">mdi-undo-variant</v-icon>
        </v-btn>

        <v-btn :dark="isCanReject" color="#FF3860" :disabled="!isCanReject" :loading="$fetchState.pending" @click.stop="reject.showDialog = true">
          Reject <v-icon class="ml-2">mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>


    <v-row>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col>
            <div class="label">Created At</div>
            <div class="font-weight-bold">
              {{ edo.created_at }} <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col>
            <div class="label">Created By</div>
            <div class="font-weight-bold text-capitalize">
              {{ edo.created_by }} <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col>
            <div class="label">Status</div>
            <div class="font-weight-bold" :style="{color: colors(edo.status)}">
              {{ edo.status }} <v-skeleton-loader v-if="$fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-row justify="end">
          <v-skeleton-loader :loading="!edo.edo_number" type="image" width="80" height="80">
            <qrcode
              :value="edo.edo_number"
              :options="{width: 80, height: 80}"
            />
          </v-skeleton-loader>
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
          <v-col cols="12" sm>
            <div class="label">Shipper name</div>
            <div class="text-h5">
              {{ edo. shipper_name }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Consignee name</div>
            <div class="text-h5">
              {{ edo. consignee_name }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Shipper e-mail</div>
            <!-- belum ada field di api -->
            <div class="text-h5">
              {{ edo. shipper_email || '-' }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Consignee e-mail</div>
            <div class="text-h5">
              {{ edo. consignee_email }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <!-- belum ada field api -->
            <div class="label">Shipper address</div>
            <div class="text-h5">
              {{ edo. shipper_address || '-' }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <!-- belum ada field api -->
            <div class="label">Consignee address</div>
            <div class="text-h5">
              {{ edo. consignee_address || '-' }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Notify</div>
            <div class="text-h5">
              {{ edo. notify }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">House BL Number</div>
            <div class="text-h5">
              {{ edo. house_bl_number }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Notify Address</div>
            <div class="text-h5">
              {{ edo. notify }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              {{ edo. house_bl_date }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Arrival Date (ETA)</div>
            <div class="text-h5">
              {{ edo. arrival_date }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Place of receipt</div>
            <div class="text-h5">
              {{ edo. place_of_receipt }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Container/Seal number</div>
            <div class="text-h5">
              {{ edo. container_seal_number }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Ocean vessel</div>
            <div class="text-h5">
              {{ edo. ocean_vessel }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Port of lading</div>
            <div class="text-h5">
              {{ edo. port_of_loading }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Voyage Number</div>
            <div class="text-h5">
              {{ edo. voyage_number }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Final Destination</div>
            <div class="text-h5">
              {{ edo. final_destination }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Port of discharges</div>
            <div class="text-h5">
              {{ edo. port_of_discharges }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Gross weight (Kg)</div>
            <div class="text-h5">
              {{ edo. gross_weight }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Package</div>
            <div class="text-h5">
              {{ edo. package }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Number of Package</div>
            <!-- belum ada field di api -->
            <div class="text-h5">
              {{ edo. number_of_package }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

          <v-col cols="12" sm>
            <div class="label">Measurement</div>
            <div class="text-h5">
              {{ edo. measurment }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm>
            <div class="label">Description of goods</div>
            <div class="text-h5">
              {{ edo. description_of_goods }}  <v-skeleton-loader v-if="$fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>

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
import { getColorStatus, isCanReject, isCanSendToConsignee } from '@/utils';
import { ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate';
import pdfmake from 'pdfmake';


setInteractionMode ('eager');
export default {
  components: { ValidationObserver, ValidationProvider },

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
        showDialog: false,
        description: ''
      },
      alertStatus: {
        show: false,
        message: '',
        color: ''
      }
    }
  },

  async fetch () {
    this.$toast.global.app_loading()
    await Promise.all([
      this.getEdoByID()
    ])
    .then (() => {
      this.$toast.clear()
    })
  },
  fetchOnServer: false,

  watch: {
    edo (val) {
      if (val.status !== 'UNPAID' && val.status !== 'PAID' && val.status !== 'REISSUED') {
        let statusReleased = val.status === 'RELEASED' &&
          `e-DO ${val.edo_number} has been Released at ${this.$moment(val.released_at).format('DD MMMM YYYY - hh:mm')}`
        let statusRejected = val.status === 'REJECTED' &&
          `e-DO ${val.edo_number} has been Rejected at ${this.$moment(val.rejected_at).format('DD MMMM YYYY - hh:mm')}`
        this.alertStatus.message = statusReleased || statusRejected
        this.alertStatus.color = statusRejected ? 'error' : 'purple'
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
    }
  },

  methods: {
    colors (params) { return getColorStatus (params) },

    // async _handleSenToConsignee (e) {
    //   this.$toast.global.app_loading ();
    //   await this.$axios.post (`/api/e_do/send_to_consignee`)
    //   .then (response => {

    //   })
    // },

    async getEdoByID () {
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

    async _handleReissue (edo_id, edo_number) {
      this.$toast.global.app_loading ();
      try {
        const response = await this.$axios.put (`/api/e_do/reissued/${edo_id}`)
        this.$toast.global.app_success (`Success reissued e-DO ${edo_number}`)
      } catch (error) {
        this.$toast.global.app_error (`${error.response.data.status}`)
      } finally {
        this.$fetch ()
      }
    },

    _closeDialogReject () {
      this.reject.showDialog = false
      this.$refs.observer.reset()
    },

    async _handleReject() {
      this.$toast.global.app_loading()
      this.reject.loading = true
      try {
        const success = await this.$refs.observer.validate()
        if (!success) return
        const response = await this.$axios.put(`/api/e_do/reject/${this.edo.edo_id}`, qs.stringify(this.reject.description))
        if (response) {
          this.$toast.global.app_success(`e-DO ${this.edo.edo_number} successfully rejected.`)
        }
      } catch (error) {
        this.$toast.global.app_error(`e-DO ${this.edo.edo_number} failed to reject.`)
      } finally {
        this.reject.loading = false
        this.reject.showDialog = false
        this.$refs.observer.reset()
        this.$fetch();
      }
    },

    toDataURL (url, callback) {
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

    cretePdf (e) {
      let edo = this.edo;
      let dateNow = this.$moment().format('DD/MM/YYYY');

      this.toDataURL(require('@/assets/images/logo-scl.png'), function (dataURL) {
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

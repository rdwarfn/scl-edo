<template>
  <v-container fluid class="mx-auto px-md-5 py-5">
    <!-- Dialog delete -->
    <v-dialog :disabled="loadingDelete" v-model="modalDeleteDialog" max-width="600px" persistent>
      <v-alert colored-border type="warning" border="top" icon="mdi-alert-outline" close-icon class="ma-0 pt-7">
        <div class="text-h6">
          Are you sure you want to delete this e-DO
          <span class="headline" style="color: #3273DC">{{ edo.edo_number }}</span> ?
        </div>
        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <v-btn :disabled="loadingDelete" :loading="loadingDelete" text color="error" @click.stop="modalDeleteDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="loadingDelete" :loading="loadingDelete" dark color="error" @click="handle_delete_edo">Yes, Delete</v-btn>
        </v-card-actions>
      </v-alert>
    </v-dialog>
    <!-- end Dialog delete -->


    <v-row class="mt-8">
      <v-col cols="12" sm="6">
        <v-row no-gutters>
        <!-- Print action -->
          <v-col cols="12" sm="auto" class="mb-5">
            <v-btn class="mr-3" @click.prevent="crete_pdf" :disabled="!isCanPrint" :loading="loadingDelete || $fetchState.pending">
              Print <v-icon class="ml-2">mdi-printer</v-icon>
            </v-btn>
          </v-col>
        <!-- end Print action -->

        <!-- Edit action -->
          <v-col cols="12" sm="auto">
            <v-btn nuxt :to="`/dokumen/e-do/edit/${edo.edo_number}`" :dark="isCanEdit" color="#00D1B2" :disabled="!isCanEdit" :loading="loadingDelete || $fetchState.pending">
              Edit <v-icon class="ml-2">mdi-pencil-outline</v-icon>
            </v-btn>
          </v-col>
        <!-- end Edit action -->
        </v-row>
      </v-col>

      <v-col cols="12" sm="6" class="text-sm-right">
        <!-- Delete action -->
        <v-btn @click.stop="modalDeleteDialog = true" :dark="isCandDelete" color="#FF3860" :disabled="!isCandDelete" :loading="loadingDelete || $fetchState.pending">
          Delete <v-icon class="ml-2">mdi-trash-can-outline</v-icon>
        </v-btn>
        <!-- end Delete action -->
      </v-col>
    </v-row>


    <v-row>
      <v-col cols="12" sm="6">
        <v-row>
          <!-- Created at -->
          <v-col cols="12" sm>
            <div class="label">Created At</div>
            <div class="font-weight-bold">
              {{ created_at_formated }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Created at -->

          <!-- Created By -->
          <v-col cols="12" sm>
            <div class="label">Created By</div>
            <div class="font-weight-bold text-capitalize">
              {{ edo.created_by }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Created By -->

          <!-- Status e-DO -->
          <v-col cols="12" sm>
            <div class="label">Status</div>
            <div class="font-weight-bold" :style="{color: colors(edo.status)}">
              {{ edo.status }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" loading type="text"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Status e-DO -->
        </v-row>
      </v-col>

      <v-col cols="12" sm="6">
        <v-row justify="end">
          <!-- QrCode -->
          <v-col cols="12" sm="auto">
            <v-skeleton-loader :loading="!edo.edo_number" type="image" width="80" height="80">
              <qrcode
                :value="edo.edo_number"
                :options="{width: 80, height: 80}"
              />
            </v-skeleton-loader>
          </v-col>
          <!-- end QrCode -->

          <!-- e-DO Number -->
          <v-col cols="12" sm="auto">
            <div class="ml-3 d-flex flex-column justify-center">
              <div class="label">e-DO Number</div>
              <div class="font-weight-bold">
                {{ edo.edo_number }}
                <v-skeleton-loader v-if="!edo.status" loading type="text"></v-skeleton-loader>
              </div>
            </div>
          </v-col>
          <!-- end e-DO Number -->
        </v-row>
      </v-col>
    </v-row>

    <v-divider class="my-8" />

    <template>
      <v-row v-show="isShowNotes">
        <v-col cols="12" sm>
          <div class="label-reject">Notes</div>
          <div class="text-h5">
            {{ edo.status_description || '-' }}
          </div>
        </v-col>
      </v-row>

      <v-divider v-show="isShowNotes" class="my-8" />
    </template>

    <v-row>
      <v-col>
        <v-row>
          <!-- Shipper name -->
          <v-col cols="12" sm>
            <div class="label">Shipper name</div>
            <div class="text-h5">
              {{ edo. shipper_name }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Shipper name -->

          <!-- Consignee name -->
          <v-col cols="12" sm>
            <div class="label">Consignee name</div>
            <div class="text-h5">
              {{ edo. consignee_name }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Shipper e-mail -->

          <!-- Consignee e-mail -->
          <v-col cols="12" sm>
            <div class="label">Consignee e-mail</div>
            <div class="text-h5">
              {{ edo. consignee_email }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Shipper address -->

          <!-- Consignee address -->
          <v-col cols="12" sm>
            <div class="label">Consignee address</div>
            <div class="text-h5">
              {{ edo. consignee_address }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Notify -->

          <!-- House BL number -->
          <v-col cols="12" sm>
            <div class="label">House BL Number</div>
            <div class="text-h5">
              {{ edo. house_bl_number }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end House BL number -->
        </v-row>


        <v-row>
          <!-- Notify address -->
          <v-col cols="12" sm>
            <div class="label">Notify Address</div>
            <div class="text-h5">
              {{ edo. notify }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Notify address -->

          <!-- Number of quantity -->
          <v-col cols="12" sm>
            <div class="label">No. of quantity</div>
            <div class="text-h5">
              {{ edo. number_of_quantity || '-' }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Number of quantity -->
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
              {{ $moment(edo. house_bl_date).format("DD/MM/YYYY") }}
                <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end House BL date -->
        </v-row>


        <v-row>
          <!-- Arrival date -->
          <v-col cols="12" sm>
            <div class="label">Arrival Date (ETA)</div>
            <div class="text-h5">
              {{ $moment(edo. arrival_date).format("DD/MM/YYYY") }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Arrival date -->

          <!-- Place of receipt -->
          <v-col cols="12" sm>
            <div class="label">Place of receipt</div>
            <div class="text-h5">
              {{ edo. place_of_receipt }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Container seal number -->

          <!-- Ocean vessel -->
          <v-col cols="12" sm>
            <div class="label">Ocean vessel</div>
            <div class="text-h5">
              {{ edo. ocean_vessel }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Port of lading -->

          <!-- Voyage number -->
          <v-col cols="12" sm>
            <div class="label">Voyage Number</div>
            <div class="text-h5">
              {{ edo. voyage_number }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Final destination -->

          <!-- Port of discharges -->
          <v-col cols="12" sm>
            <div class="label">Port of discharges</div>
            <div class="text-h5">
              {{ edo. port_of_discharges }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Gross weight -->

          <!-- Package -->
          <v-col cols="12" sm>
            <div class="label">Package</div>
            <div class="text-h5">
              {{ edo. package }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Number of package -->

          <!-- Measurement -->
          <v-col cols="12" sm>
            <div class="label">Measurement</div>
            <div class="text-h5">
              {{ edo. measurment }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
            </div>
          </v-col>
          <!-- end Description of goods -->

          <!-- Marks and number -->
          <v-col cols="12" sm>
            <div class="label">Marks and number</div>
            <div class="text-h5">
              {{ edo. marks_and_number }}
              <v-skeleton-loader v-if="loadingDelete || $fetchState.pending" type="table-cell"></v-skeleton-loader>
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
  </v-container>
</template>

<script>
import { getColorStatus, isCanReject, isCanSendToConsignee } from '@/utils';
import Notification from '@/components/Snack.vue';
const _ = require('lodash');
import pdfmake from 'pdfmake';

import {
  isAdminCanEdit,
  isAdminCanDelete,
  isAdminCanPrint
} from '@/utils';

export default {
  components: { Notification },
  meta: {
    crumbs: [{
      to: '/dokumen',
      exact: true,
      text: 'Dashboard',
      replace: true,
    },{
      to: `/dokumen/e-do`,
      text: 'Detail e-DO',
      disabled: true,
    }]
  },

  async fetch () {
    this.$toast.global.app_loading()
    try {
      const response = await this.$axios.get(`/api/e_do/${this.$route.params.id}`)
      if (response) {
        const { data } = response.data
        this.edo = data[0]
      }
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.message && ` ,${error.response.data.message}`
      this.$toast.global.app_error (`Failed to get e-DO${message}`)
    } finally {
      this.$toast.clear()
    }
  },
  fetchOnServer: false,

  data () {
    return {
      edo: {},
      dialog: false,
      loadingDelete: false,
      notif: {
        message: "",
        status: ""
      },
      confirmDelete: "",

      modalDeleteDialog: false,
    }
  },

  computed: {
    isNotEmpty () { return !_.isEmpty(this.edo) },
    isCanSend () { return this.isNotEmpty && isCanSendToConsignee(this.edo.status) },
    isCanReject () { return this.isNotEmpty && isCanReject (this.edo.status) },
    isCandDelete () { return this.isNotEmpty && isAdminCanDelete (this.edo.status) },
    isCanEdit () { return this.isNotEmpty && isAdminCanEdit (this.edo.status) },
    isCanPrint () { return this.isNotEmpty && isAdminCanPrint (this.edo.status) },
    isShowNotes() { return this.isNotEmpty && this.edo.status === 'REJECTED' || this.edo.status === 'HOLD ON' },
    computeConfirmDelete () { return this.confirmDelete === this.edo.edo_number },
    created_at_formated () {
      const dateFormated = this.$moment(this.edo.created_at, "DD-MM-YYYY hh:mm:ss", 'id')
      return dateFormated.isValid() ? dateFormated.format('DD/MM/YYYY - hh:mm:ss') : this.edo.created_at
    }
  },

  methods: {
    colors (params) { return getColorStatus (params) },

    async handle_delete_edo (e) {
      this.$toast.global.app_loading ();
      this.loadingDelete    = true;
      const edonumber       = this.edo.edo_number;
      const edoid           = this.edo.edo_id;
      try {
        const result = await this.$axios.delete (`/api/e_do/${edoid}`);
        if (result) {
          this.$toast.global.app_success (`e-DO ${edonumber} successfully deleted.`)
        }
      } catch (error) {
        const msg   = error.response.message && ` ,${error.response.message}` || '';
        this.$toast.global.app_error (`e-DO ${edonumber} failed to delete`, msg);
      } finally {
        this.loadingDelete = false;
        this.modalDeleteDialog= false;
        this.$router.back ()
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

      this.to_data_url(require('@/static/logo-scl-new.png'), function (dataURL) {
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
                              margin: [0, 20, 0, 20]
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
                          text: '-',
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
  .label-reject {
    color: #FF3860 !important;
  }
</style>
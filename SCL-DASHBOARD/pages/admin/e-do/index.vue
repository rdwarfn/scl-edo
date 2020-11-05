<template>
  <v-container fluid class="px-md-5">
    <!-- dialog reject -->
    <v-dialog transition="slide-y-transition" max-width="768px" v-model="reject.showDialog" persistent>
      <v-alert
        tile
        border="right"
        colored-border
        type="error"
        elevation="2"
        class="pt-5 ma-0"
      >
        <validation-observer ref="observer" v-slot="{ handleSubmit, invalid }">
          <v-card flat class="pa-0 mt-n1" tag="form" @submit.prevent="handleSubmit(_handleReject)">
            <v-card-title class="pt-0">
              Reject this e-DO &nbsp;<span style="color: #3273DC !important">{{ reject.edo.edo_number }}</span> ?
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
                  :loading="paidRejectLoading"
                  :disabled="paidRejectLoading"
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
                :disabled="paidRejectLoading || invalid"
                :loading="paidRejectLoading"
                type="submit"
              >Yes, Reject</v-btn>
            </v-card-actions>
          </v-card>
        </validation-observer>
      </v-alert>
    </v-dialog>
    <!-- end dialog reject -->

    <!-- dialog paid -->
    <dialog-paid :dialog="paid.showDialog" :loading="paidRejectLoading" @onSubmit="_onDialogPaidSubmit" @onCancel="_onDialogPaidCancel"></dialog-paid>
    <!-- end dialog paid -->

    <!-- status e-do: total, unpaid, paid, rejected -->
    <card-list-status-edo :count="count" />
    <!-- end status e-do -->

    <!-- tabs bar: new e-do, history -->
    <v-toolbar color="transparent" flat dense>
      <template v-slot:extension>
        <v-tabs
          v-model="currentItem"
          :centered="$vuetify.breakpoint.smAndDown"
        >
          <v-tab
            style="width: 181px"
            v-for="item in tabItems"
            :key="item.text"
            :href="'#tab-' + kebabCase(item.text)"
          >
            {{ item.text }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <!-- end tabs bar -->

    <v-divider class="my-5" />

    <v-row class="my-10" align="end">
      <!-- search e-do -->
      <v-col cols="4">
        <v-text-field
          :disabled="$fetchState.pending"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search e-DO"
          solo rounded
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      <!-- end search e-do -->

      <!-- filter e-do -->
      <v-col class="text-right">
        <v-btn large @click.stop="dialog = !dialog" :disabled="$fetchState.pending">
          Filter By <v-icon>mdi-filter-outline</v-icon>
        </v-btn>
      </v-col>
      <!-- end filter e-do -->

      <!-- item per-page show -->
      <v-col cols="auto" sm="2">
        <v-row no-gutters>
          <v-col cols="12">
            Show Data
          </v-col>
          <v-col class="mt-3">
            <v-text-field
              :disabled="$fetchState.pending"
              :value="itemsPerPage"
              label="Show Data"
              type="number"
              min="-1"
              solo
              hide-details
              @input="itemsPerPage = parseInt($event)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <!-- end item per-page show -->
    </v-row>

    <v-row>
      <!-- tabs item -->
      <v-col>
      <v-tabs-items v-model="currentItem">
        <v-tab-item
          v-for="item in tabItems"
          :key="item.text"
          :value="'tab-' + kebabCase(item.text)"
          transition="scroll-x-transition"
          reverse-transition="scroll-x-reverse-transition"
        >
          <v-skeleton-loader :loading="$fetchState.pending" type="table">
            <!-- table e-do -->
            <v-data-table
              :headers="item.headers"
              :items="item.data"
              :search.sync="search"
              :page.sync="page"
              :items-per-page.sync="itemsPerPage"
              class="elevation-0 py-5"
              @page-count="pageCount = $event"
              @pagination="pagination = $event"
              loading-text="Loading... Please wait"
              hide-default-footer
            >
              <template v-slot:[`item.released_at`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ item.released_at || '-' }}
                </div>
              </template>

              <template v-slot:[`item.house_bl_number`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ item.house_bl_number }}
                </div>
              </template>

              <template v-slot:[`item.edo_number`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ item.edo_number }}
                </div>
              </template>

              <template v-slot:[`item.consignee_name`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ item.consignee_name }}
                </div>
              </template>

              <template v-slot:[`item.created_at`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ item.created_at }}
                </div>
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <div class="py-md-6 text-subtitle-2" :style="`color: ${getColor(item.status)}`">
                  {{ item.status }}
                </div>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-row no-gutters class="py-md-6 font-weight-bold">
                  <v-col>
                    <v-btn
                      small
                      depressed
                      color="#00D1B2"
                      :loading="paidRejectLoading"
                      :disabled="isNotRequested(item.status) || paidRejectLoading"
                      @click.prevent="_openDialogPaid (item)"
                    >
                      <!-- :dark="!isNotRequested(item.status) || !paidRejectLoading" -->
                      <span style="color: white">Paid</span>
                    </v-btn>
                  </v-col>

                  <v-col>
                    <v-btn
                      small
                      depressed
                      color="#FF3860"
                      :loading="paidRejectLoading"
                      :disabled="isNotRequested(item.status) || paidRejectLoading"
                      @click="_openDialogReject (item)"
                    >
                      <!-- :dark="!isNotRequested(item.status) || !paidRejectLoading" -->
                      <span style="color: white">Reject</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:[`item.detail`]="{ item }">
                  <v-btn text nuxt class="text-capitalize" :to="`${$route.path}/detail/${item.edo_id}`">
                  Detail
                </v-btn>
              </template>
            </v-data-table>
            <!-- end table e-do -->
          </v-skeleton-loader>
        </v-tab-item>
      </v-tabs-items>
      </v-col>
      <!-- end tabs item -->
    </v-row>

    <v-row justify="space-between" align="center">
      <!-- page count -->
      <v-col cols="12" sm="6">
        <v-skeleton-loader :loading="$fetchState.pending" type="text">
          <div>Showing {{ pagination.pageStop - pagination.pageStart }} of {{ pagination.itemsLength }} data</div>
        </v-skeleton-loader>
      </v-col>
      <!-- end page count -->

      <v-col cols="12" sm="6" md="3">
        <v-pagination
          circle
          v-model="page"
          :length="pagination.pageCount"
        ></v-pagination>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" scrollable :overlay="false" max-width="500" transition="dialog-transition">
      <v-card>
        <v-toolbar flat>
          <span class="headline">Filter by</span>
          <v-spacer />
          <v-btn icon @click.stop="dialog = !dialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="menuDateFrom"
                  v-model="menuDateFrom"
                  :close-on-content-click="false"
                  :return-value.sync="dateFrom"
                  transition="slide-x-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      v-model="dateFrom"
                      chips
                      small-chips
                      clear-icon
                      clearable
                      readonly
                      label="Start from"
                      v-bind="attrs"
                      v-on="on"
                    ></v-combobox>
                  </template>
                  <v-date-picker v-model="dateFrom" no-title>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menuDateFrom = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menuDateFrom.save(dateFrom)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6">
                <v-menu
                  ref="menuDateTo"
                  v-model="menuDateTo"
                  :close-on-content-click="false"
                  :return-value.sync="dateToSearch"
                  transition="slide-x-reverse-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      v-model="dateToSearch"
                      chips
                      small-chips
                      clear-icon
                      clearable
                      readonly
                      label="To"
                      v-bind="attrs"
                      v-on="on"
                    ></v-combobox>
                  </template>
                  <v-date-picker v-model="dateToSearch" no-title>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menuDateTo = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menuDateTo.save(dateToSearch)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  :items="[{
                    text: 'All',
                    value: 'ALL'
                  }, {
                    text: 'Unpaid',
                    value: 'UNPAID'
                  }, {
                    text: 'Paid',
                    value: 'PAID'
                  }, {
                    text: 'Rejected',
                    value: 'REJECTED'
                  }, {
                    text: 'Released',
                    value: 'RELEASED'
                  }]"
                  v-model="statusSearch"
                  item-text="text"
                  item-value="value"
                  label="Status"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="House BL Number"
                  v-model="houseBlSearch"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Vessel Name"
                  v-model="vesselSearch"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary">Filter now</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import jwt_decode from 'jwt-decode';
import qs from 'querystring';
import _ from 'lodash';
import {
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from 'vee-validate';
import {
  HeaderTableTabNewEDO,
  HeaderTableTabHistory,
  getColorStatus,
  setDisabledActions
} from '@/utils';
import CardListStatusEdo from '@/components/CardListStatusEdo.vue';
import DialogPaid from '@/components/DialogPaid.vue';

setInteractionMode ('eager');

export default {
  meta: {
    crumbs: [{
      text: 'Dashboard',
      to: '/admin/e-do',
      disabled: true
    }]
  },
  components: {
    CardListStatusEdo,
    DialogPaid,
    ValidationObserver,
    ValidationProvider
  },
  data () {
    return {
      paidRejectLoading: false,
      reject: {
        showDialog: false,
        description: '',
        edo: {}
      },
      paid: {
        showDialog: false,
        edo: {},
      },

      currentItem: 'tab-history',
      tabItems: [{
          text: 'New Edo',
          headers: HeaderTableTabNewEDO,
          data: [],
          showAction: true
        },{
          text: 'History',
          headers: HeaderTableTabHistory,
          data: [],
          showAction: false
        },
      ],

      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      pagination: {},

      isSearching: false,
      searchModel: null,
      search: null,

      tabelData: [],
      tabelDataFilter: [],

      dialog: false,

      menuDateFrom: false,
      menuDateTo: false,
      dateFrom: null,
      dateToSearch: null,
      statusSearch: null,
      houseBlSearch: null,
      vesselSearch: null,

      count: {
        total: null,
        requested: null,
        approved: null,
        rejected: null,
        picked_up: null
      }
    }
  },
  watch: {
    tabelData: function (val) {
      // const newEdo = _.filter (val, function (o) {
      //   let status = _.upperCase (o.status)
      //   return status === 'UNPAID';
      // });
      // const history = _.filter (val, function (obj) {
      //   let status = _.upperCase (obj.status);
      //   return status !== 'UNPAID';
      // })
      this.tabItems[0].data = this.tabelDataFilter;
      this.tabItems[1].data = this.tabelDataFilter;
    },

    statusSearch (val) {
      const newEdo = val === 'ALL' ? this.tabelData : _.filter (this.tabelData, { status: val })
      this.tabItems[1].data = newEdo
    }
  },
  async fetch () {
    await this.getAll()
  },
  fetchOnServer: false,
  methods: {
    getColor (params) { return getColorStatus (params) },
    isNotRequested: params => setDisabledActions(params),
    kebabCase (params) { return _.kebabCase (params) },
    inputSearch (event) { this.itemsPerPage = _.toInteger(event, 10) },

    async getAll () {
      this.$toast.global.app_loading()
      await Promise.all([
        this.getAllEdo(),
        this.getCountEdos()
      ])
      .then (() => {
        this.$toast.clear()
      })
    },

    async getAllEdo () {
      try {
        const response = await this.$axios.get (`/api/e_do`)
        if (response.status === 200) {
          const { data } = response.data
          this.tabelData = data
          this.tabelDataFilter = data
        }
      } catch (error) {
        const response = error.response.data
        const message = response && response.message && ` , ${response.message}`
        this.$toast.global.app_error(`Failed to load all e-DO${message}`)
      }
    },

    async getCountEdos () {
      const response = await this.$axios.get ('/api/e_do/total_e_do')
      if (response.status === 200) {
        const { data } = response
        this.count = data;
      }
    },


    _openDialogPaid(edo) {
      this.paid.showDialog = true
      this.paid.edo = _.assign(this.paid.edo, edo)
    },
    async _onDialogPaidSubmit(data) {
      await this.putApprove(data)
    },
    _onDialogPaidCancel() {
      this.paid.showDialog = false
    },
    async putApprove (obj) {
      this.$toast.global.app_loading();
      this.paidRejectLoading = true
      try {
        const response = await this.$axios.put(`/api/e_do/approve/${this.paid.edo.edo_id}`, qs.stringify(obj.form))
        if (response) {
          this.$toast.clear()
          this.$toast.global.app_success (`e-DO ${this.paid.edo.edo_number} successfully Paid.`)
        }
      } catch (error) {
        this.$toast.clear()
        this.$toast.global.app_error (`e-DO ${this.paid.edo.edo_number} failed to Paid.`)
      } finally {
        this.paidRejectLoading = false
        obj.observer.reset()
        this.paid.edo = {}
        this.paid.showDialog = false
        await this.getAll()
      }
    },


    _openDialogReject (params) {
      this.reject.edo = params
      this.reject.showDialog = true
    },

    _closeDialogReject () {
      this.reject.showDialog = false
      this.$refs.observer.reset ()
    },

    async _handleReject () {
      this.$toast.global.app_loading ()
      this.paidRejectLoading = true
      try {
        const response = await this.$axios.put (`/api/e_do/reject/${this.reject.edo.edo_id}`)
        if (response) {
          this.$toast.clear()
          this.$toast.global.app_success (`e-DO ${this.reject.edo.edo_number} successfully Rejected.`)
        }
      } catch (error) {
        this.$toast.clear()
        this.$toast.global.app_error (`e-DO ${this.reject.edo.edo_number} failed to Reject.`)
      } finally {
        this.paidRejectLoading = false
        this.reject.showDialog = false
        this.$refs.observer.reset()

        await this.getAll()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
.icon {
  margin-right: 10px;
}

a.v-tab.v-tab--active {
  background-color: #FFFFFF !important;
}

// ::v-deep .v-data-table {
//   tr {
//     border-bottom: none !important;
//   }

//   .v-data-table__wrapper > table > thead > tr {
//     @media #{map-get($display-breakpoints, 'md-and-up')} {
//       padding: {
//         left: 22px !important;
//         right: 22px !important;
//       }
//     }
//     th {
//       font-size: 14px !important;
//       color: rgba(0, 0, 0, 0.8) !important;
//       font-weight: normal;
//       line-height: 21px;
//     }
//   }

//   tbody {
//     tr {
//       .data-item-tbody-tr-div {
//         border-radius: 10px !important;
//         margin-bottom: 16px !important;
//         // width: 100%;
//         // max-width: 100vw;
//         display: flex;
//       }
//       padding-top: 8px !important;
//       padding-bottom: 8px !important;
//       border: unset !important;
//       &:hover:not(.v-data-table__expanded__content) {
//         background: #ffffff !important;
//       }
//       td {
//         padding-left: 0 !important;
//         padding-right: 0 !important;
//       }
//     }
//   }
// }
</style>

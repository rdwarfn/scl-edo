<template>
  <v-container fluid class="px-md-5">
    <!-- dialog reject -->
    <dialog-rejection-edo
      :loading="paidRejectLoading"
      :dialog="reject.showDescriptionDialog"
      :edo-number="reject.edo.edo_number"
      @onSubmit="on_submit_dialog_reject_description"
      @onCancel="close_dialog_reject"
    ></dialog-rejection-edo>
    <!-- end dialog reject -->

    <!-- dialog reject house bl number -->
    <dialog-house-bl-number
      :dialog="reject.showHouseBLDialog"
      :loading="paidRejectLoading"
      @onSubmit="on_submit_dialog_reject_house_bl"
      @onCancel="close_dialog_reject"
    ></dialog-house-bl-number>
    <!-- end dialog reject house bl number -->

    <!-- dialog paid house bl number -->
    <dialog-house-bl-number
      :dialog="paid.showDialog"
      :loading="paidRejectLoading"
      @onSubmit="on_submit_dialog_paid_house_bl"
      @onCancel="close_dialog_paid"
    ></dialog-house-bl-number>
    <!-- end paid dialog house bl number -->

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
        <v-btn large @click.stop="dialog_filter = !dialog_filter" :disabled="$fetchState.pending">
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
              @page-count.once="pageCount = $event"
              @pagination.once="pagination = $event"
              loading-text="Loading... Please wait"
            >
              <!-- hide-default-footer -->
              <!-- Released at -->
              <template v-slot:[`item.released_at`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ datetime_formated(item.released_at) }}
                </div>
              </template>
              <!-- end Relased at -->

              <!-- House BL number -->
              <template v-slot:[`item.house_bl_number`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ item.house_bl_number }}
                </div>
              </template>
              <!-- end House BL number -->

              <!-- e-DO number -->
              <template v-slot:[`item.edo_number`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ item.edo_number }}
                </div>
              </template>
              <!-- end e-DO number -->

              <!-- Consignee name -->
              <template v-slot:[`item.consignee_name`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ item.consignee_name }}
                </div>
              </template>
              <!-- end Consignee name -->

              <!-- Created at -->
              <template v-slot:[`item.created_at`]="{ item }">
                <div class="py-md-6 text-subtitle-2">
                  {{ datetime_formated(item.created_at) }}
                </div>
              </template>
              <!-- end Created at -->

              <!-- Status e-DO -->
              <template v-slot:[`item.status`]="{ item }">
                <div class="py-md-6 text-subtitle-2" :style="`color: ${getColor(item.status)}`">
                  {{ item.status }}
                </div>
              </template>
              <!-- end Status e-DO -->

              <template v-slot:[`item.actions`]="{ item }">
                <v-row no-gutters class="py-md-6 font-weight-bold">
                  <v-col>
                    <v-btn
                      small
                      depressed
                      color="#00D1B2"
                      :loading="paidRejectLoading"
                      :disabled="isNotRequested(item.status) || paidRejectLoading"
                      @click.prevent="open_dialog_paid (item)"
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
                      @click.prevent="open_dialog_reject (item)"
                    >
                      <!-- :dark="!isNotRequested(item.status) || !paidRejectLoading" -->
                      <span style="color: white">Reject</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </template>

              <!-- Detail action -->
              <template v-slot:[`item.detail`]="{ item }">
                  <v-btn text nuxt class="text-capitalize" :to="`${$route.path}/detail/${item.edo_id}`">
                  Detail
                </v-btn>
              </template>
              <!-- end Detail action -->
            </v-data-table>
            <!-- end table e-do -->
          </v-skeleton-loader>
        </v-tab-item>
      </v-tabs-items>
      </v-col>
      <!-- end tabs item -->

      <!-- <v-col cols="12">
        <v-row justify="space-between" align="center"> -->
          <!-- page count -->
          <!-- <v-col cols="12" sm="6">
            <v-skeleton-loader :loading="$fetchState.pending" type="text">
              <div>Showing {{ pagination.pageStop - pagination.pageStart }} of {{ pagination.itemsLength }} data</div>
            </v-skeleton-loader>
          </v-col> -->
          <!-- end page count -->

          <!-- <v-col cols="12" sm="6" md="3">
            <v-pagination
              circle
              v-model="page"
              :length="pagination.pageCount"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-col> -->
    </v-row>

    <v-dialog v-model="dialog_filter" scrollable :overlay="false" max-width="500" transition="dialog-transition">
      <v-card>
        <v-toolbar flat>
          <span class="headline">Filter by</span>
          <v-spacer />
          <v-btn icon @click.stop="dialog_filter = !dialog_filter">
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
                    <v-text-field
                      v-model="dateFrom"
                      label="Start date from"
                      prepend-inner-icon="mdi-calendar"
                      clearable
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
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
                  :return-value.sync="dateTo"
                  transition="slide-x-reverse-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateTo"
                      label="End date to"
                      prepend-inner-icon="mdi-calendar"
                      clearable
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="dateTo" no-title>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menuDateTo = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menuDateTo.save(dateTo)">
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
                  clearable
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Vessel Name"
                  v-model="vesselSearch"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click.stop="dialog_filter = false">Cancel</v-btn>
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
import DialogHouseBlNumber from '@/components/DialogHouseBlNumber.vue';
import DialogRejectionEdo from '@/components/DialogRejectionEdo.vue';

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
    DialogHouseBlNumber,
    DialogRejectionEdo,
    ValidationObserver,
    ValidationProvider
  },
  data () {
    return {
      paidRejectLoading: false,
      reject: {
        showHouseBLDialog: false,
        showDescriptionDialog: false,
        edo: {},
        formDialog: {
          description: null,
          house_bl_number: null,
        }
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

      dialog_filter: false,

      // filter
      menuDateFrom: false,
      menuDateTo: false,
      dateFrom: null,
      dateTo: null,
      statusSearch: "ALL",
      houseBlSearch: null,
      vesselSearch: null,

      count: {
        total: null,
        requested: null,
        approved: null,
        rejected: null,
        picked_up: null,
        hold_on: null
      }
    }
  },
  watch: {
    tabelData: function (val) {
      const newEdo = _.filter (val, function (o) {
        let status = _.upperCase (o.status)
        return status === 'UNPAID';
      });
      const history = _.filter (val, function (obj) {
        let status = _.upperCase (obj.status);
        return status !== 'UNPAID';
      })
      // this.tabItems[0].data = this.tabelDataFilter;
      // this.tabItems[1].data = this.tabelDataFilter;
      this.tabItems[0].data = newEdo;
      this.tabItems[1].data = history;
    },

    // statusSearch (val) {
    //   const newEdo = val === 'ALL' ? this.tabelData : _.filter (this.tabelData, { status: val })
    //   this.tabItems[1].data = newEdo
    // },

    houseBlSearch(newVal) {
      let filtered_edo = !newVal
        ? this.tabelData
        : _.filter(this.tabelData, { house_bl_number: newVal })
      this.tabItems[1].data = filtered_edo
    },
    vesselSearch(newVal) {
      let filtered_edo = !newVal
        ? this.tabelData
        : _.filter(this.tabelData, { ocean_vessel: newVal })
      this.tabItems[1].data = filtered_edo
    }
  },
  async fetch () {
    await this.get_all()
  },
  fetchOnServer: false,
  methods: {
    getColor (params) { return getColorStatus (params) },
    isNotRequested: params => setDisabledActions(params),
    kebabCase (params) { return _.kebabCase (params) },
    inputSearch (event) { this.itemsPerPage = _.toInteger(event, 10) },

    async get_all () {
      this.$toast.global.app_loading()
      await Promise.all([
        this.get_all_edo(),
        this.get_count_edos()
      ])
      .then (() => {
        this.$toast.clear()
      })
    },
    /**
     * Get All e-DO
     */
    async get_all_edo () {
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
    /**
     * Get Count e-DO
     */
    async get_count_edos () {
      const response = await this.$axios.get ('/api/e_do/total_e_do')
      if (response.status === 200) {
        const { data } = response
        this.count = data;
      }
    },
    /**
     * Block Approve/Paid Action
     */
    open_dialog_paid(edo) {
      this.paid.showDialog = true
      this.paid.edo = _.assign(this.paid.edo, edo)
    },
    close_dialog_paid() {
      this.paid.showDialog = false
      this.paid.edo = {}
    },
    /**
     * On submit house bl form dialog
     */
    async on_submit_dialog_paid_house_bl(data) {
      await this.put_paid(data)
    },
    /**
     * Action Paid
     */
    async put_paid(obj) {
      try {
        this.$toast.global.app_loading();
        this.paidRejectLoading = true
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
        this.close_dialog_paid()
        await this.getAll()
      }
    },

    /**
     * Block Reject Actions
     */
    open_dialog_reject(edo) {
      this.reject.edo = edo
      this.reject.showHouseBLDialog = true
    },
    close_dialog_reject() {
      this.reject.showDescriptionDialog = false
      this.reject.showHouseBLDialog = false
      this.reject.edo = {}
    },
    /**
     * On submit house bl form dialog
     */
    on_submit_dialog_reject_house_bl(data) {
      try {
        this.reject.formDialog = _.assign(this.reject.formDialog, data.form);
      } finally {
        this.reject.showHouseBLDialog = false
        this.reject.showDescriptionDialog = true
      }
    },
    /**
     * On submit description form dialog
     */
    async on_submit_dialog_reject_description(data) {
      try {
        this.paidRejectLoading = true
        this.reject.formDialog = _.assign(this.reject.formDialog, data.form);
        await this.handle_reject()
      } finally {
        this.paidRejectLoading = false
        this.reject.showDescriptionDialog = false
        await this.get_all()
      }
    },
    /**
     * Submit filter
     */
    on_submit_filter() {
      let filtered_status_edo = this.statusSearch === 'ALL' || this.statusSearch === undefined
        ? this.tabelData
        : _.filter(this.tabelData, { status: this.statusSearch })
      let filtered_datebetween_edo = _.filter(filtered_status_edo, (data) => {
          if (!this.dateFrom && !this.dateTo) { return true }
          else if (!this.dateTo) {
            return this.$moment(data.created_at).isSameOrAfter(this.dateFrom)
          }
          else if (!this.dateFrom) {
            return this.$moment(data.created_at).isSameOrBefore(this.dateTo)
          }
          else {
            return this.$moment(data.created_at).isBetween(this.dateFrom, this.dateTo)
          }
        })

      this.tabItems[1].data = filtered_datebetween_edo || filtered_status_edo
      this.dialog_filter = false
    },
    /**
     * Action Reject
     */
    async handle_reject () {
      try {
        this.$toast.global.app_loading ()
        const response = await this.$axios.put(
          `/api/e_do/reject/${this.reject.edo.edo_id}`,
          qs.stringify(this.reject.formDialog)
        )
        if (response) {
          this.$toast.clear()
          this.$toast.global.app_success (`e-DO ${this.reject.edo.edo_number} successfully Rejected.`)
        }
      } catch (error) {
        this.$toast.clear()
        this.$toast.global.app_error (`e-DO ${this.reject.edo.edo_number} failed to Reject.`)
      }
    },
    /**
     * Datetime format
     */
    datetime_formated(params) {
      const date_formated = this.$moment(params)

      if (!date_formated.isValid()) return "-"
      return date_formated.format("DD/MM/YYYY - hh:mm:ss")
    },
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
</style>

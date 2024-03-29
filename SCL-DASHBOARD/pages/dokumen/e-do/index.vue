<template>
  <v-container fluid class="px-md-5">
    <!-- Dialog Delete -->
    <v-dialog :disabled="loadingDelete" v-model="modalDeleteDialog" max-width="600px" persistent>
      <v-alert colored-border type="warning" border="top" icon="mdi-alert-outline" close-icon class="ma-0 pt-7">
        <div class="text-h6">
          Are you sure you want to delete this e-DO
          <span class="headline" style="color: #3273DC">{{ contextDelete.edo_number }}</span> ?
        </div>
        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <!-- Cancel action -->
          <v-btn :disabled="loadingDelete" :loading="loadingDelete" text color="error" @click.stop="modalDeleteDialog = false">Cancel</v-btn>
          <!-- end Cancel action -->
          <v-spacer></v-spacer>
          <!-- Delete action -->
          <v-btn :disabled="loadingDelete" :loading="loadingDelete" dark color="error" @click="handle_delete_edo">Yes, Delete</v-btn>
          <!-- end Delete action -->
        </v-card-actions>
      </v-alert>
    </v-dialog>
    <!-- end Dialog delete -->

    <card-list-status-edo :count="count" />

    <v-row justify="space-between" align="end" class="my-10">
      <v-col cols="7">
        <v-row align="end" class="py-0">
          <!-- Search e-DO -->
          <v-col cols="auto">
            <v-text-field
              :disabled="$fetchState.pending"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search e-DO"
              solo
              hide-details
              rounded clearable
            ></v-text-field>
          </v-col>
          <!-- end Search e-DO -->

          <!-- Filter by -->
          <v-col cols="auto">
            <v-btn large @click.stop="dialog_filter = true" :disabled="$fetchState.pending">
              Filter By <v-icon>mdi-filter-outline</v-icon>
            </v-btn>
          </v-col>
          <!-- end Filter by -->

          <!-- Show data action -->
          <v-col>
            <v-row no-gutters align="end">
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
          <!-- end Show data action -->
        </v-row>
      </v-col>

      <!-- Created new e-DO -->
      <v-col cols="auto">
        <v-btn color="primary" :disabled="$fetchState.pending" nuxt :to="`${$route.path}/create`">
          Create new e-DO <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-col>
      <!-- end Created new e-DO -->
    </v-row>


    <!-- Table -->
    <v-row>
      <v-col>
        <v-skeleton-loader :loading="$fetchState.pending" type="table">
          <v-data-table
            :headers="tabelHeaders"
            :items="tabelDataFilter"
            :search.sync="search"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            class="elevation-0 py-6"
            @page-count="pageCount = $event"
            @pagination="pagination = $event"
            loading-text="Loading... Please wait"
            hide-default-footer
            calculate-widths
          >
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
              <div class="py-md-6 text-subtitle-2">
                <!-- edit action -->
                <v-btn icon color="primary" :disabled="!isCanEdit(item.status)" nuxt :to="`${$route.path}/edit/${item.edo_number}`">
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
                <!-- end edit action -->

                <!-- delete action -->
                <v-btn icon color="red" :disabled="!isCandDelete(item.status)" @click.stop="open_dialog_delete(item.edo_id, item.edo_number)">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
                <!-- end delete action -->
              </div>
            </template>

            <!-- Detail action -->
            <template v-slot:[`item.detail`]="{ item }">
                <v-btn
                text nuxt
                class="text-capitalize"
                :to="`${$route.path}/detail/${item.edo_number}`">
                Detail
              </v-btn>
            </template>
            <!-- end Detail action -->
          </v-data-table>
        </v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center">
      <!-- Showing -->
      <v-col cols="12" sm="6">
        <v-skeleton-loader :loading="$fetchState.pending" type="text">
          <div>Showing {{ pagination.pageStop - pagination.pageStart }} of {{ pagination.itemsLength }} data</div>
        </v-skeleton-loader>
      </v-col>
      <!-- end Showing -->

      <!-- Pagination table -->
      <v-col cols="12" sm="6" md="3">
        <v-pagination
          circle
          v-model="page"
          :length="pageCount"
        ></v-pagination>
      </v-col>
      <!-- end Pagination table -->
    </v-row>

    <!-- Dialog Filter -->
    <v-dialog
      v-model="dialog_filter"
      persistent
      max-width="500px"
      transition="slide-y-reverse-transition"
    >
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
                  }, {
                    text: 'On Hold',
                    value: 'HOLD ON'
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
          <v-btn color="primary" @click.prevent="on_submit_filter">Filter now</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end Dialog Filter -->
  </v-container>
</template>

<script>
import jwt_decode from 'jwt-decode';
import qs from 'querystring';
import _ from 'lodash';
import CardListStatusEdo from '@/components/CardListStatusEdo.vue';

import {
  getColorStatus,
  HeaderTableTabNewEDO,
  isAdmintCanDelete,
  isAdminCanEdit, isAdminCanDelete
} from '@/utils';
export default {
  meta: {
    crumbs: [{
      text: 'Dashboard',
      exact: true,
      href: '/dokumen/e-do'
    }]
  },
  middleware: 'dokumenscl',

  data () {
    return {
      count: {
        total: null,
        requested: null,
        approved: null,
        rejected: null,
        picked_up: null
      },

      modalDeleteDialog: false,
      loadingDelete: false,
      contextDelete: {
        edo_id: "",
        edo_number: "",
      },

      search: '',

      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      pagination: {},

      tabelHeaders: HeaderTableTabNewEDO,
      tabelData: [],
      allEdo: [],
      tabelDataFilter: [],


      // filter
      dialog_filter: false,
      menuDateFrom: false,
      menuDateTo: false,
      statusSearch: "ALL",
      inputSearch: '',
      vesselSearch: '',
      houseBlSearch: '',
      dateTo: '',
      dateFrom: '',
    }
  },
  async fetch() {
    await this.get_all()
  },
  fetchOnServer: false,

  watch: {
    allEdo(val) {
      const notPickedUp = _.filter (val, function (o) {
        return _.upperCase(o.status) !== 'PICKED UP'
      });

      this.tabelData = notPickedUp && notPickedUp;
      this.tabelDataFilter = notPickedUp && notPickedUp;
    },

    // statusSearch (val) {
    //   const filteredEdo = val === 'ALL' || val === undefined ? this.tabelData : _.filter (this.tabelData, { status: val })
    //   this.tabelDataFilter= filteredEdo
    // },
    houseBlSearch(newVal) {
      let filtered_edo = !newVal
        ? this.tabelData
        : _.filter(this.tabelData, { house_bl_number: newVal })
      this.tabelDataFilter = filtered_edo
    },
    vesselSearch(newVal) {
      let filtered_edo = !newVal
        ? this.tabelData
        : _.filter(this.tabelData, { ocean_vessel: newVal })
      this.tabelDataFilter = filtered_edo
    }
  },

  methods: {
    /**
     * Get e-DO & Get total e-DO
     */
    async get_all() {
      this.$toast.global.app_loading()
      await Promise.all([
        this.get_all_edo (),
        this.get_total_edo ()
      ])
      .then(() => {
        this.$toast.clear()
      })
    },
    /**
     * Get e-DO (all e-DO)
     */
    async get_all_edo() {
      try {
        const response = await this.$axios.get ('/api/e_do')
        if (response.status === 200) {
          const { data } = response.data
          this.allEdo = data
        }
      } catch (error) {
        this.$toast.global.app_error(`Failed to load e-DO.`)
      }
    },
    /**
     * Get total e-DO
     */
    async get_total_edo() {
      try {
        const response = await this.$axios.get ('/api/e_do/total_e_do')
        if (response.status === 200) {
          const { data } = response
          this.count = data
        }
      } catch (error) {
        this.$toast.global.app_error ('Failed to get total e-DO.')
      }
    },

    /**
     * Handle delete e-DO
     */
    async handle_delete_edo() {
      this.$toast.global.app_loading();
      this.loadingDelete = true
      try {
        const response = await this.$axios.delete(`/api/e_do/${this.contextDelete.edo_id}`)
        if (response) {
          this.$toast.clear()
          this.$toast.global.app_success(`e-DO ${this.contextDelete.edo_number} successfully deleted.`)
        }
      } catch (error) {
        this.$toast.clear()
        this.$toast.global.app_error(`e-DO ${this.contextDelete.edo_number} failed to delete.`)
      } finally {
        this.loadingDelete = false
        this.modalDeleteDialog = false

        await this.get_all()
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

      this.tabelDataFilter = filtered_datebetween_edo || filtered_status_edo
      this.dialog_filter = false
    },

    getColor(params) { return getColorStatus (params) },
    isCandDelete(params) { return isAdminCanDelete (params) },
    isCanEdit(params) { return isAdminCanEdit (params) },

    open_dialog_delete(edo_id, edo_number) {
      this.contextDelete = { edo_id, edo_number }
      this.modalDeleteDialog = true
    }
  },

  components: {
    CardListStatusEdo
  }
}
</script>

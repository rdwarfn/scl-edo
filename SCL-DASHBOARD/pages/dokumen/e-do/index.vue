<template>
  <v-container fluid class="px-md-5">
    <v-dialog :disabled="loadingDelete" v-model="modalDeleteDialog" max-width="600px" persistent>
      <v-alert colored-border type="warning" border="top" icon="mdi-alert-outline" close-icon class="ma-0 pt-7">
        <div class="text-h6">
          Are you sure you want to delete this e-DO
          <span class="headline" style="color: #3273DC">{{ contextDelete.edo_number }}</span> ?
        </div>
        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <v-btn :disabled="loadingDelete" :loading="loadingDelete" text color="error" @click.stop="modalDeleteDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="loadingDelete" :loading="loadingDelete" dark color="error" @click="_handleDeleteEdo">Yes, Delete</v-btn>
        </v-card-actions>
      </v-alert>
    </v-dialog>

    <card-list-status-edo :count="count" />

    <v-row justify="space-between" align="end" class="my-10">
      <v-col cols="6">
        <v-row align="end" class="py-0">
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

          <v-col cols="auto">
            <v-btn large @click.stop="dialog = true" :disabled="$fetchState.pending">
              Filter By <v-icon>mdi-filter-outline</v-icon>
            </v-btn>
          </v-col>

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
        </v-row>
      </v-col>


      <v-col cols="auto">
        <v-btn color="primary" :disabled="$fetchState.pending" nuxt :to="`${$route.path}/create`">
          Create new e-DO <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-col>
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
                <div class="py-md-6 text-subtitle-2">
                  <!-- edit action -->
                  <v-btn icon color="primary" :disabled="!isCanEdit(item.status)" nuxt :to="`${$route.path}/edit/${item.edo_number}`">
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                  <!-- end edit action -->

                  <!-- delete action -->
                  <v-btn icon color="red" :disabled="!isCandDelete(item.status)" @click.stop="_openDialogDelete(item.edo_id, item.edo_number)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                  <!-- end delete action -->
                </div>
              </template>

              <template v-slot:[`item.detail`]="{ item }">
                  <v-btn
                  text nuxt
                  class="text-capitalize"
                  :to="`${$route.path}/detail/${item.edo_id}`">
                  Detail
                </v-btn>
              </template>
          </v-data-table>
        </v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center">
      <v-col cols="12" sm="6">
        <v-skeleton-loader :loading="$fetchState.pending" type="text">
          <div>Showing {{ pagination.pageStop - pagination.pageStart }} of {{ pagination.itemsLength }} data</div>
        </v-skeleton-loader>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-pagination
          circle
          v-model="page"
          :length="pageCount"
        ></v-pagination>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      scrollable
      :overlay="false"
      max-width="500"
      transition="dialog-transition"
    >
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
                  :return-value.sync="dateTo"
                  transition="slide-x-reverse-transition"
                  offset-y
                  min-width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                      <v-combobox
                        v-model="dateTo"
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
      href: '/dokumen/e-do',
      disabled: true
    }]
  },

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
      dialog: false,

      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      pagination: {},

      tabelHeaders: HeaderTableTabNewEDO,
      tabelData: [],
      allEdo: [],
      tabelDataFilter: [],


      // filter
      menuDateFrom: false,
      menuDateTo: false,
      statusSearch: "",
      inputSearch: '',
      vesselSearch: '',
      houseBlSearch: '',
      dateTo: '',
      dateFrom: '',
    }
  },

  async fetch () {
    await this.getAll()
  },
  fetchOnServer: false,

  watch: {
    allEdo (val) {
      const notPickedUp = _.filter (val, function (o) {
        return _.upperCase(o.status) !== 'PICKED UP'
       });

      this.tabelData = notPickedUp && notPickedUp;
      this.tabelDataFilter = notPickedUp && notPickedUp;
    },

    statusSearch (val) {
      const filteredEdo = val === 'ALL' ? this.tabelData : _.filter (this.tabelData, { status: val })
      this.tabelDataFilter= filteredEdo
    }
  },

  methods: {
    async getAll () {
      this.$toast.global.app_loading()
      await Promise.all([
        this.getAllEdo (),
        this.getTotalEdo ()
      ])
      .then(() => {
        this.$toast.clear()
      })
    },
    async getAllEdo () {
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

    async getTotalEdo () {
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

    async _handleDeleteEdo () {
      this.$toast.global.app_loading ();
      this.loadingDelete = true
      try {
        const response = await this.$axios.delete (`/api/e_do/${this.contextDelete.edo_id}`)
        if (response) {
          this.$toast.clear()
          this.$toast.global.app_success (`e-DO ${this.contextDelete.edo_number} successfully deleted.`)
        }
      } catch (error) {
        this.$toast.clear()
        this.$toast.global.app_error (`e-DO ${this.contextDelete.edo_number} failed to delete.`)
      } finally {
        this.loadingDelete = false
        this.modalDeleteDialog = false

        await this.getAll()
      }
    },

    getColor (params) { return getColorStatus (params) },
    isCandDelete (params) { return isAdminCanDelete (params) },
    isCanEdit (params) { return isAdminCanEdit (params) },

    _openDialogDelete (edo_id, edo_number) {
      this.contextDelete = { edo_id, edo_number }
      this.modalDeleteDialog = true
    }
  },

  components: {
    CardListStatusEdo
  }
}
</script>

<style>

</style>
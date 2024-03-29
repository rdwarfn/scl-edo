<template>
  <v-container fluid class="py-10 px-md-5">
    <v-row class="mb-5" align="end" justify="space-between">
      <v-col cols="12" sm="auto">
        <v-row no-gutters class="font-weight-bold">
          <span class="mr-4">Total user :</span> <v-skeleton-loader min-width="30" :loading="$fetchState.pending" type="chip">{{ total }}</v-skeleton-loader>
        </v-row>
      </v-col>

      <v-col cols="12" sm="auto">
        <v-row no-gutters align="end" class="py-0">
          <v-col cols="auto" class="mr-sm-3">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search User"
              solo
              hide-details
              rounded
              :disabled="$fetchState.pending"
            ></v-text-field>
          </v-col>

          <v-col cols="auto" class="mr-sm-3">
            <v-row no-gutters>
              <v-col cols="12">
                Show Data
              </v-col>
              <v-col class="mt-3">
                <v-text-field
                  :value="itemsPerPage"
                  label="Items per page"
                  type="number"
                  min="-1"
                  max="15"
                  @input="inputSearch"
                  solo
                  hide-details
                  :disabled="$fetchState.pending"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="auto">
            <v-btn color="primary" nuxt :to="`/superadmin/user-management/create`"
              :disabled="$fetchState.pending" :loading="$fetchState.pending">
              Create new user <v-icon class="ml-3">mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-skeleton-loader :loading="$fetchState.pending" type="table">
          <v-data-table
            :headers="headers"
            :items="users"
            :search.sync="search"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :loading="isUserLoading"
            hide-default-footer
            class="elevation-1 py-5 px-sm-6"
            @page-count="pageCount = $event"
            loading-text="Loading... Please wait"
          >
            <template v-slot:[`item.email`]="{ item }">
              <div class="py-md-5 my-md-4 text-subtitle-2">
                {{ item.email }}
              </div>
            </template>

            <template v-slot:[`item.name`]="{ item }">
              <div class="py-md-5 my-md-4 text-subtitle-2">
                {{ item.name }}
              </div>
            </template>

            <template v-slot:[`item.role`]="{ item }">
              <div class="py-md-5 my-md-4 text-subtitle-2">
                {{ item.role }}
              </div>
            </template>

            <template v-slot:[`item.created_at`]="{ item }">
              <div class="py-md-5 my-md-4 text-subtitle-2">
                {{ $moment(item.created_at).format('DD/MM/YYYY - hh:mm:ss') }}
              </div>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="primary" icon @click="_edit(item)">
                <v-icon>
                  mdi-pencil-outline
                </v-icon>
              </v-btn>

              <v-btn color="red" icon @click="_delete(item)">
                <v-icon>
                  mdi-trash-can-outline
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center">
      <v-col cols="12" sm="6">
        <v-skeleton-loader :loading="$fetchState.loading" type="text">
          <div>Showing {{ page * itemsPerPage }} of {{ users.length }} Data </div>
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

    <v-dialog v-model="dialog" max-width="768px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit user</span>
        </v-card-title>
        <v-divider />

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="editedUser.email"
                  label="E-mail"
                  type="email"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="editedUser.name"
                  label="Name"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  v-model="editedUser.role"
                  label="Role"
                  :items="roleItems"
                  class="text-capitalize"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="userPassword"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
                  label="Password"
                  hint="password encrypted"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="_close">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="Update">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm -->
    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="600px"
      transition="scale-transition"
    >
      <v-alert colored-border type="warning" border="top" icon="mdi-alert-outline" close-icon class="ma-0 pt-7">
        <div class="text-h6">
          Are you sure you want to delete this User ?
        </div>
        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <v-btn text color="primary" @click="_closeDelete">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn dark color="red" @click="deleteUser">Delete</v-btn>
        </v-card-actions>
      </v-alert>
    </v-dialog>
    <!-- Delete Confirm -->
  </v-container>
</template>

<script>
import qs from 'querystring';
import _ from 'lodash';
import { HeaderTableUser, initRole } from '@/utils';
import Snack from '@/components/Snack.vue';

export default {
  meta: {
    crumbs: [{
      to: '/superadmin/user-management',
      exact: true,
      text: 'User Management'
    }]
  },
  middleware: 'superadminscl',

  data: () => ({
    search: '',
    users: [],
    headers: HeaderTableUser,
    total: null,

    page: 1,
    pageCount: 0,
    itemsPerPage: 5,

    show: false,

    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedUser: {
      email: '',
      name: '',
      role: '',
    },
    userPassword: '',
    passwordEncrypted: '',
    defaultUser: {
      email: '',
      name: '',
      role: '',
    },
    roleItems: initRole,
    isUserLoading: false,
  }),

  async fetch () {
    this.$toast.global.app_loading()
    await Promise.all([
      this.getAllUser()
    ])
    .then(() => {
      this.$toast.clear()
    })
  },
  fetchOnServer: false,

  methods: {
    inputSearch (event) {
      this.itemsPerPage = _.toInteger(event, 10)
    },

    async getAllUser () {
      try {
        const response = await this.$axios.get('/api/e_do/users')
        if (response.status === 200) {
          const { data } = response.data
          const totalUser = response.data["total users"]
          this.users = data
          this.total = totalUser
        }
      } catch (error) {
        const response = error.response.data
        const message = response && response.message && ` , ${response.message}`
        this.$toast.global.app_error(`Failed to load all user${message}`)
      }
    },

    _edit(params) {
      this.editedIndex = _.indexOf(this.users, params)
      this.editedUser = _.assign({}, params)
      this.passwordEncrypted = params.password
      this.userPassword = params.password
      this.dialog = true
    },

    _close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedUser = _.assign({}, this.defaultUser)
        this.passwordEncrypted = ''
        this.userPassword = ''
      })
    },

    _closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedUser = _.assign({}, this.defaultUser)
        this.passwordEncrypted = ''
        this.userPassword = ''
        this.editedIndex = -1
      })
    },

    async Update (e) {
      this.isUserLoading = true
      this._close()
      this.$toast.global.app_loading ()
      try {
        let dataForm;
        if (!_.isEqual(this.passwordEncrypted, this.userPassword)) {
          dataForm = _.assign(this.editedUser, { password: this.userPassword })
        } else {
          dataForm = this.editedUser
        }
        const response = await this.$axios.put (`/api/e_do/users/${this.editedUser.user_id}`, qs.stringify(dataForm))
        if (response) {
          this.$toast.global.app_success (`User ${this.editedUser.name} successfully updated.`)
        }
      } catch (error) {
        this.$toast.global.app_error (`User ${this.editedUser.name} failed to update.`)
      } finally {
        this.isUserLoading = false
        this._close()
        this.$fetch()
      }
    },

    _delete (params) {
      this.editedIndex = _.indexOf(this.users, params)
      this.editedUser = _.assign({}, params)
      this.dialogDelete = true
    },

    async deleteUser () {
      try {
        this.$toast.global.app_loading ();
        const response = await this.$axios.delete (`/api/e_do/users/${this.editedUser.user_id}`)
        if (response) {
          this.$toast.clear()
          this.$toast.global.app_success (`User ${this.editedUser.name} successfully deleted.`)
        }
      } catch (error) {
        this.$toast.clear()
        this.$toast.global.app_error (`User ${item.name} failed to delete.`)
      } finally {
        this._closeDelete()
        this.$fetch ()
      }
    },

    kebabCase: (params) => _.kebabCase(params),
  }
};
</script>
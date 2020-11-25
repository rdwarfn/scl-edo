<template>
  <v-container>
    <v-card class="mx-auto pa-10" max-width="500" rounded="">
      <v-img
        class="mx-auto mb-10"
        :src="require('@/assets/images/logo-scl-login.png')"
        :lazy-src="require('@/assets/images/logo-scl-login.png')"
        max-width="190"
      >
        <template #placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <v-form
        ref="form"
        v-model="valid"
        lazy-validation>
          <label class="_label" for="email">E-mail</label>
          <v-text-field
            id="email"
            v-model="login.email"
            type="email"
            outlined
            class="mt-2"
            :disabled="isSubmiting"
            :loading="isSubmiting"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <label class="_label" for="password">Password</label>
          <v-text-field
            id="password"
            v-model="login.password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"

            outlined
            class="mt-2"
            @click:append="show = !show"
            :disabled="isSubmiting"
            :loading="isSubmiting"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-card-actions class="mt-n3">
            <v-spacer />
            <v-btn large @click.prevent="userLogin" type="submit" :disabled="isSubmiting" :loading="isSubmiting" class="align-self-end ml-auto" color="primary">Login</v-btn>
          </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
const qs = require('querystring');
import { mapState } from 'vuex';
export default {
  layout: 'auth',

  head: {
    title: 'Authentication'
  },

  data () {
    return {
      valid: true,
      formForgotValid: true,

      dialog: false,
      show: false,

      forgot: {
        email: ''
      },
      login: {
        email: 'adminscl@gmail.com',
        password: 'admin123',
      },

      isSubmiting: false,

      rules: {
        required: value => !!value || 'Required.'
      },
    }
  },

  methods: {
    async userLogin (e) {
      if (this.$refs.form.validate()) {
        this.isSubmiting = true
        this.$toast.global.app_loading()
        try {
          const response = await this.$store.dispatch('UserLogin', this.login)
          this.$toast.clear()
          if (response) {
            this.$refs.form.reset()
          }
        } catch (error) {
          this.$toast.clear()
          const msg = error.response.data && ', ' + error.response.data.message
          this.$toast.global.app_error ('Login failed' + msg)
        } finally {
          this.isSubmiting = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep label {
    font-size: 16px !important;
    line-height: 24px !important;
    color: #373A3C !important;
  }
</style>
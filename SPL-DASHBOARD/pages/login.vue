<template>
  <v-container>
    <v-card class="mx-auto pa-13" max-width="500" rounded="">
      <div class="text-center mx-auto text-h3 text-uppercase font-weight-bold mb-10">SPL Logo</div>

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
          <v-btn text color="primary" @click.stop="dialog = !dialog">Forgot password</v-btn>

          <v-card-actions class="mt-n3">
            <v-spacer />
            <v-btn large @click.prevent="userLogin" type="submit" :disabled="isSubmiting" :loading="isSubmiting" class="align-self-end ml-auto" color="primary">Login</v-btn>
          </v-card-actions>
      </v-form>
    </v-card>


    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title class="text-h5 font-weight-bold">Forgot Password</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider />

        <v-form ref="formForgot" v-model="formForgotValid" lazy-validation>
          <v-card-text class="pt-5">
            <label for="email">Your e-mail</label>
            <v-text-field
              id="email"
              v-model="forgot.email"
              type="email"
              outlined
              class="mt-2"
              :disabled="isSubmiting"
              :loading="isSubmiting"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-end py-5">
            <v-btn :disabled="isSubmiting" text @click="dialog = false">
              Cancel
            </v-btn>

            <v-btn :loading="isSubmiting" :disabled="!valid" color="primary" @click="dialog = false">
              Send
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const qs = require('querystring');
import { mapState } from 'vuex';
export default {
  layout: 'auth',

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
        email: 'adminspl@gmail.com',
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
          await this.$store.dispatch('UserLogin', this.login)
        } catch (error) {
          const msg = error.response.data && ', ' + error.response.data.message
          this.$toast.global.app_error ('Login failed' + msg)
        } finally {
          this.$refs.form.reset();
          this.isSubmiting = false
        }
      }
    },

    async forgotPassword (e) {
      if (this.$refs.formForgotPassworrd.validate()) {
        this.isSubmiting = true
        try {
          
        } catch (error) {
          
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
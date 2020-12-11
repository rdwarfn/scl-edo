<template>
  <v-container fluid class="py-10 px-md-5">
    <snack
      :msg="message"
      :status="statusMessage"
      :show.sync="showMessage"
      @close="showMessage = false"
    />

    <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
      <v-form @submit="handleSubmit(on_submit)">
        <v-row>
          <v-col cols="12" sm="6">
            <validation-provider v-slot="{ valid, errors }" rules="required|email" name="e-mail">
              <label for="email" class="text-body-1">E-mail</label>
              <v-text-field
                v-model="form.email"
                id="email"
                class="mt-3"
                placeholder="Input e-mail"
                type="email"
                :rules="errors"
                :success="valid"
                :loading="isSubmiting"
                solo
                required
                clearable
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" sm="6">
            <validation-provider v-slot="{ valid, errors }" rules="required" name="name">
              <label for="name" class="text-body-1">Name</label>
              <v-text-field
                v-model="form.name"
                id="name"
                class="mt-3"
                placeholder="Input name"
                :rules="errors"
                :success="valid"
                :loading="isSubmiting"
                solo
                required
                clearable
              />
            </validation-provider>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm="6">
            <validation-provider v-slot="{ valid, errors }" rules="required" name="role">
              <label for="role" class="text-body-1">Role</label>
              <v-select
                v-model="form.role"
                id="role"
                class="mt-3 text-capitalize"
                placeholder="Select role"
                :items="roleItems"
                :rules="errors"
                :success="valid"
                :loading="isSubmiting"
                solo
                required
                clearable
              />
            </validation-provider>
          </v-col>
        </v-row>


        <v-row>
          <v-col cols="12" sm="6">
            <validation-provider v-slot="{ valid, errors }" rules="required" name="password">
              <label for="password" class="text-body-1">Password</label>
              <v-text-field
                v-model="form.password"
                id="password"
                class="mt-3"
                placeholder="Input password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                :rules="errors"
                :success="valid"
                :loading="isSubmiting"
                solo
                required
                clearable
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" sm="6">
            <validation-provider v-slot="{ valid, errors }" rules="required" name="re-type password">
              <label for="rePassword" class="text-body-1">Re-type Password</label>
              <v-text-field
                v-model="rePassword"
                id="rePassword"
                class="mt-3"
                placeholder="Input password again"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                @click:append="show2 = !show2"
                :rules="errors"
                :success="valid"
                :loading="isSubmiting"
                solo
                required
                clearable
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn text color="red" @click="cancel">
              Cancel
            </v-btn>
          </v-col>
          <v-col>
            <v-btn :loading="isSubmiting" color="primary" @click="submit" :disabled="invalid">
              Create
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </validation-observer>
  </v-container>
</template>

<script>
import qs from 'querystring';
import { initRole, validateEmail } from '@/utils';
import Snack from '@/components/Snack.vue';

export default {
  meta: {
    crumbs: [{
      to: '/superadmin/user-management/',
      exact: true,
      text: 'User Management',
    },{
      to: '/superadmin/user-management/create',
      exact: true,
      text: 'Create User',
    }]
  },
  middleware: 'superadminscl',

  data () {
    return {
      valid: true,
      isSubmiting: false,
      form: {
        email: "",
        name: "",
        role: "",
        password: "",
      },
      rules: {
        emailRules: v => !!v || "E-mail is required.",
        nameRules: [v => !!v || "Name is required."],
        roleRules: v => !!v || 'Role is required.',
        passwordRules: [v => !!v || "Password is required."],
        rePasswordRules: v => !!v || "Re-type password is required."
      },
      roleItems: initRole,
      rePassword: "",

      message: "",
      showMessage: false,
      statusMessage: "",

      show1: false,
      show2: false,
    }
  },

  computed: {
    passwordConfirm () {
      return () => (this.form.password === this.rePassword) || "Password doesn't match."
    },
    isValidEmail () {
      return validateEmail(this.form.email) || "E-mail must be valid."
    }
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isSubmiting = true;
        this.$axios.post("/api/e_do/users", qs.stringify(this.form))
          .then((response) => {
            this.message = 'New user has been created.';
            this.statusMessage = "success";
          })
          .catch((err) => {
            this.message = 'User failed to create.';
            this.statusMessage = "error";
          })
          .finally(() => {
            this.isSubmiting = false;
            this.showMessage = true;
            this.clear();
          })
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    cancel () {
      this.clear()
      this.$router.back()
    }
  },

  fetchOnServer: false,
}
</script>

<style>

</style>
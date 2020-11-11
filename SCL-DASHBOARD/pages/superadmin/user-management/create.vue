<template>
  <v-container fluid class="py-10 px-md-5">
    <snack
      :msg="message"
      :status="statusMessage"
      :show.sync="showMessage"
      @close="showMessage = false"
    />

    <v-form v-model="valid" ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6">
          <label for="email" class="text-body-1">E-mail</label>
          <v-text-field
            id="email"
            class="mt-3"
            placeholder="Input e-mail"
            type="email"
            v-model="form.email"
            :rules="[rules.emailRules, isValidEmail]"
            solo validate-on-blur
            required :loading="isSubmiting"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <label for="name" class="text-body-1">Name</label>
          <v-text-field
            id="name"
            class="mt-3"
            placeholder="Input name"
            v-model="form.name"
            :rules="rules.nameRules"
            solo validate-on-blur
            required :loading="isSubmiting"
          ></v-text-field>
        </v-col>
      </v-row>


      <v-row>
        <v-col cols="12" sm="6">
          <label for="role" class="text-body-1">Role</label>
          <v-select
            id="role"
            class="mt-3 text-capitalize"
            placeholder="Select role"
            v-model="form.role"
            :items="roleItems"
            :rules="[rules.roleRules]"
            solo validate-on-blur
            required :loading="isSubmiting"
          ></v-select>
        </v-col>
      </v-row>


      <v-row>
        <v-col cols="12" sm="6">
          <label for="password" class="text-body-1">Password</label>
          <v-text-field
            id="password"
            class="mt-3"
            placeholder="Input password"
            v-model="form.password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            :rules="rules.passwordRules"
            solo validate-on-blur
            required :loading="isSubmiting"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <label for="rePassword" class="text-body-1">Re-type Password</label>
          <v-text-field
            id="rePassword"
            class="mt-3"
            placeholder="Input password again"
            v-model="rePassword"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            @click:append="show2 = !show2"
            :rules="[rules.rePasswordRules, passwordConfirm]"
            solo validate-on-blur
            required :loading="isSubmiting"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn text color="red" @click="cancel">
            Cancel
          </v-btn>
        </v-col>
        <v-col>
          <v-btn :loading="isSubmiting" color="primary" @click="submit" :disabled="!valid">
            Create
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
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
<template>
  <v-dialog transition="slide-y-transition" max-width="768px" v-model="dialogModel" persistent>
    <v-alert
      tile
      border="right"
      colored-border
      type="warning"
      elevation="2"
      class="pt-5 ma-0"
    >
      <validation-observer ref="observer" v-slot="{ handleSubmit, invalid }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <v-card :loading="loading" flat class="pa-0 mt-n1">
            <v-card-title class="pt-0">
              Hold this e-DO &nbsp;<span style="color: #3273DC !important">{{ edoNumber }}</span> ?
              <v-spacer />
            </v-card-title>

            <v-card-text class="py-0">
              <validation-provider name="House BL number" rules="required" v-slot="{ errors, valid }">
                <label for="houseBLNumber">House BL Number</label>
                <v-text-field
                  id="houseBLNumber"
                  class="mt-3"
                  v-model="form.house_bl_number"
                  :loading="loading"
                  :disabled="loading"
                  :success="valid"
                  :error-messages="errors"
                  placeholder="Input house bl number"
                  solo required
                ></v-text-field>
              </validation-provider>

              <validation-provider name="Note hold" rules="required" v-slot="{ errors, valid }">
                <label for="holdNotes">Notes</label>
                <v-textarea
                  id="holdNotes"
                  class="mt-3"
                  v-model.trim="form.description"
                  :loading="loading"
                  :disabled="loading"
                  :success="valid"
                  :error-messages="errors"
                  placeholder="Enter your comment here"
                  solo required
                ></v-textarea>
              </validation-provider>
            </v-card-text>

            <v-card-actions class="px-5">
              <v-spacer></v-spacer>
              <v-btn text color="error" @click.prevent="onCancel">Cancel</v-btn>
              <v-btn
                color="warning"
                :loading="loading"
                :disabled="invalid || loading"
                type="submit"
              >Yes, Hold</v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </validation-observer>
    </v-alert>
  </v-dialog>
</template>

<script>
import { required } from 'vee-validate/dist/rules';
import {
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
  extend
} from 'vee-validate';
setInteractionMode ('eager');
extend ('required', {
  ...required,
  message: '{_field_} is required.',
});
export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    loading: { type: Boolean, default: false, required: true },
    dialog: { type: Boolean, default: false, required: true },
    edoNumber: { type: String, default: '',  required: true }
  },
  data() {
    return {
      dialogModel: this.dialog,
      form: {
        house_bl_number: "",
        description: "",
      }
    }
  },
  watch: {
    dialog(newValue) {
      this.dialogModel = newValue
    }
  },
  computed: {
    observer() { return this.$refs.observer }
  },
  methods: {
    onSubmit() {
      this.$emit('onSubmit', {
        form: this.form
      });
      setTimeout(() => {
        this.reset();
      }, 1000);
    },
    onCancel() {
      this.$emit('onCancel');
      this.reset();
    },
    reset() {
      this.form.description = '';
      this.form.house_bl_number = '';
      this.observer.reset();
    }
  },
}
</script>

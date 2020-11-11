<template>
  <v-dialog transition="slide-y-transition" max-width="768px" v-model="dialogModel" persistent>
    <v-alert
      tile
      border="right"
      colored-border
      type="error"
      elevation="2"
      class="pt-5 ma-0"
    >
      <ValidationObserver ref="rejectionObserver" v-slot="{ handleSubmit, invalid }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <v-card :loading="loading" flat class="pa-0 mt-n1">
            <v-card-title class="pt-0">
              Reject this e-DO &nbsp;<span style="color: #3273DC !important">{{ edoNumber }}</span> ?
              <v-spacer></v-spacer>
              <v-btn icon @click.prevent="_closeDialogReject">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="py-0">
              <ValidationProvider name="Note rejection" rules="required" v-slot="{ errors }">
                <label for="rejectNotes">Notes</label>
                <v-textarea
                  id="rejectNotes"
                  class="mt-3"
                  v-model.trim="form.description"
                  :loading="loading"
                  :disabled="loading"
                  :error-messages="errors"
                  placeholder="Enter your comment here"
                  solo required
                ></v-textarea>
              </ValidationProvider>
            </v-card-text>

            <v-card-actions class="px-5">
              <v-spacer></v-spacer>
              <v-btn text color="error" @click.prevent="onCancel">Cancel</v-btn>
              <v-btn
                color="error"
                :loading="loading"
                type="submit"
                :disabled="invalid || loading"
              >Yes, Reject</v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </ValidationObserver>
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
  inheritAttrs: false,
  props: {
    loading: { type: Boolean, default: false, required: true },
    dialog: { type: Boolean, default: false, required: true },
    edoNumber: { type: String, default: '',  required: true }
  },
  data() {
    return {
      dialogModel: this.dialog,
      form: {
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
    observer() { return this.$refs.rejectionObserver }
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
      this.observer.reset();
    }
  },
}
</script>

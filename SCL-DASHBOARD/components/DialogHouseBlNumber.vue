<template>
  <v-dialog v-model="dialogModel" transition="slide-y-transition" max-width="768px" persistent>
    <v-alert tile border="top" colored-border type="info" class="pt-5 ma-0">
      <validation-observer ref="observer" v-slot="{ handleSubmit, invalid }">
        <form @submit.prevent="handleSubmit(_onSubmit)">
          <v-card :loading="loading" flat class="pa-0 mt-n1">
            <v-card-text class="pt-2 pb-0">
              <validation-provider name="House B/L Number" rules="required" v-slot="{ errors }">
                <label for="houseBL">Input House B/L Number</label>
                <v-text-field
                  id="houseBL"
                  class="mt-3"
                  v-model="form.house_bl_number"
                  :loading="loading"
                  :disabled="loading"
                  :error-messages="errors"
                  placeholder="Input Here..."
                  solo
                ></v-text-field>
              </validation-provider>
            </v-card-text>

            <v-card-actions class="px-5">
              <v-spacer></v-spacer>
              <v-btn :disabled="loading" text color="error" @click.prevent="_onCancel">Cancel</v-btn>
              <v-btn color="success" type="submit" :loading="loading" :disabled="invalid || loading">Continue</v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </validation-observer>
    </v-alert>
  </v-dialog>
</template>

<script>
import {
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from 'vee-validate';
setInteractionMode('eager');

const components = {
  ValidationObserver,
  ValidationProvider
}

export default {
  components,
  props: {
    loading: { type: Boolean, required: true, default: false },
    dialog: { type: Boolean, required: true, default: false },
  },
  data: function () {
    return {
      dialogModel: this.dialog,
      form: {
        house_bl_number: ''
      }
    }
  },
  watch: {
    dialog: function (newVal) {
      this.dialogModel = newVal
    }
  },
  computed: {
    observer () {
      return this.$refs.observer;
    }
  },
  methods: {
    _onSubmit() {
      this.$emit('onSubmit', {
        form: this.form,
        observer: this.observer
      })
    },
    _onCancel() {
      this.$emit('onCancel');
      this.reset()
    },
    reset() {
      this.form.house_bl_number = '';
      this.observer.reset();
    }
  },
}
</script>

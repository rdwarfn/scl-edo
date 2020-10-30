<template>
  <v-snackbar outlined :color="getColor" class="text-capitalize" top v-model="show" timeout="9000">
    <v-icon v-show="!hideIcon" :color="getColor">{{ getIcon }}</v-icon>
    {{ msg }}
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        :color="getColor"
        @click="show = !show"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import _ from 'lodash';
export default {
  props: {
    hideIcon: { type: Boolean, default: false },
    customIcon: { type: [String, Boolean], default: false },
    status: { type: String },
    msg: { type: String, required: true }
  },

  data () {
    return {
      show: false
    }
  },

  watch: {
    msg (n, o) {
      if (!_.isEqual(n, o)) {
        this.show = true
      }
    }
  },

  computed: {
    getColor () {
      switch (this.status) {
        case "success":
          return "green darken-2"

        case "error":
          return "red darken-2"

        default:
          return "primary darken-2"
      }
    },
    getIcon () {
      if (this.customIcon) {
        return this.customIcon
      };

      switch (this.status) {
        case "success":
          return "mdi-checkbox-marked-circle-outline"

        case "error":
          return "mdi-close-circle-outline"
      }
    }
  },

  close () {
    this.$emit('close', this.show)
  }
}
</script>

<style>

</style>
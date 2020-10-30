<template>
  <v-container class="pa-0">
    <v-breadcrumbs :items="getCrumbs" large class="px-0">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </v-container>
</template>

<script>
export default {
  computed: {
    getCrumbs () {
      return this.$store.state.breadcrumbs.data
    }
  }
}
</script>

<style>

</style>
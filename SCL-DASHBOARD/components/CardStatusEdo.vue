<template>
  <v-card color="transparent" class="pa-5 card-edo-status" min-height="104px">
    <v-row no-gutters>
      <v-col cols="12" md="auto">
        <v-icon :color="color" size="40">{{ icon }}</v-icon>
        <span :style="{color: color}" class="ml-4 text-subtitle-1 text-md-h6 nowra">{{ title }}</span>
      </v-col>

      <v-col cols="12" class="ml-7 pl-9 font-weight-bold">
        <v-skeleton-loader :loading="!count" type="text" min-width="30" min-height="27">
          {{ count }}
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    color: { type: String },
    icon: { type: String },
    title: { type: String },
    count: { type: [ String, Number ] }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

@media #{map-get($display-breakpoints, 'sm-and-up')} {
  .card-edo-status {
    min-width: 90px;
  }
}
</style>

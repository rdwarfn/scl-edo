<template>
  <v-row class="mt-3" align="center">
    <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.total" type="image" min-width="90" height="104">
        <card-status-edo
          color="#242424"
          title="Total e-DO"
          icon="mdi-file-document-outline"
          :count="count.total"
        />
      </v-skeleton-loader>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.unpaid" type="image" min-width="90" height="104">
        <card-status-edo
          color="#3273DC"
          title="Unpaid"
          icon="mdi-magnify"
          :count="count.unpaid"
        />
      </v-skeleton-loader>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.paid" type="image" min-width="90" height="104">
        <card-status-edo
          color="#00D1B2"
          title="Paid"
          icon="mdi-checkbox-marked-circle-outline"
          :count="count.paid"
        />
      </v-skeleton-loader>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.rejected" type="image" min-width="90" height="104">
        <card-status-edo
          color="red"
          title="Rejected e-DO"
          icon="mdi-close-circle-outline"
          :count="count.rejected"
        />
      </v-skeleton-loader>
    </v-col>
    <v-col v-if="$auth.hasScope('admin')" cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.released" type="image" min-width="90" height="104">
        <card-status-edo
          color="#BB6BD9"
          title="Released"
          icon="mdi-truck-outline"
          :count="count.released"
        />
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["count"]
}
</script>

<template>
  <v-row class="mt-3" align="center">
    <!-- <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.total" type="image" min-width="90" height="104">
        <card-status-edo
          color="#242424"
          title="Total e-DO"
          icon="mdi-file-document-outline"
          :count="count.total"
        />
      </v-skeleton-loader>
    </v-col> -->

    <!-- Unpaid -->
    <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.unpaid" type="image" min-width="90" height="104">
        <card-status-edo
          :color="colors.link"
          title="Unpaid"
          icon="mdi-magnify"
          :count="count.unpaid"
        />
      </v-skeleton-loader>
    </v-col>
    <!-- end Unpaid -->

    <!-- Paid -->
    <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.paid" type="image" min-width="90" height="104">
        <card-status-edo
          :color="colors.primary"
          title="Paid"
          icon="mdi-checkbox-marked-circle-outline"
          :count="count.paid"
        />
      </v-skeleton-loader>
    </v-col>
    <!-- end Paid -->

    <!-- Rejected -->
    <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.rejected" type="image" min-width="90" height="104">
        <card-status-edo
          :color="colors.danger"
          title="Rejected"
          icon="mdi-close-circle-outline"
          :count="count.rejected"
        />
      </v-skeleton-loader>
    </v-col>
    <!-- end Rejected -->

    <!-- Released -->
    <!-- v-if="$auth.hasScope('admin')" -->
    <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.released" type="image" min-width="90" height="104">
        <card-status-edo
          :color="colors.purple"
          title="Released"
          icon="mdi-truck-outline"
          :count="count.released"
        />
      </v-skeleton-loader>
    </v-col>
    <!-- end Released -->

    <!-- Edo Status -->
    <!-- status itu apa ?, sekarang diambil dari  -->
    <v-col cols="12" sm="6" md="3">
      <v-skeleton-loader :loading="!count.rejected" type="image" min-width="90" height="104">
        <card-status-edo
          :color="colors.warning"
          title="On Hold"
          icon="mdi-delta"
          :count="count.rejected"
        />
      </v-skeleton-loader>
    </v-col>
    <!-- end Edo Status -->
  </v-row>
</template>

<script>
import * as Colors from '@/utils/colors';
export default {
  props: ["count"],
  data() {
    return {
      colors: Colors
    }
  },
  // watch: {
  //   count(newVal) {
  //     console.log(newVal);
  //   }
  // }
}
</script>

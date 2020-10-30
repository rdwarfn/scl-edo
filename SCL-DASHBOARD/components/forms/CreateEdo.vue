<template>
  <v-container fluid class="px-md-5">
    <validation-observer ref="observer" v-slot="{ invalid, handleSubmit, reset }">
    <form @submit.prevent="handleSubmit(submit)" @reset.prevent="reset">
      <v-row>
        <!-- Shipper name -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Input shipper Name"
            rules="required"
          >
          <label class="labelText" for="shipperName">Shipper name</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="shipperName"
            placeholder="Input shipper name"
            v-model.trim="models.shipper_name"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Shipper name -->

        <!-- Consignee name -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Consignee Name"
            rules="required"
          >
          <label class="labelText" for="consigneeName">Consignee name</label>
            <!-- :items="selectData.consigneeName" -->
            <!-- @change="onChangeConsigneeName" -->
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="consigneeName"
            placeholder="Input consignee name"
            v-model.trim="models.consignee_name"
            :error-messages="errors"
            class="mt-3"
            item-text="consignee_name"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Consignee name -->
      </v-row>


      <v-row>
        <!-- Shipper e-mail -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Shipper E-mail"
            rules="email"
          >
          <label class="labelText" for="shipperEmail">Shipper e-mail <small>(optional)</small></label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="shipperEmail"
            type="email"
            placeholder="Input shipper e-mail"
            v-model.trim="models.shipper_email"
            :error-messages="errors"
            class="mt-3"
            solo clearable
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Shipper e-mail -->

        <!-- Consignee e-mail -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Consignee Email"
            rules="required|email"
          >
          <label class="labelText" for="consigneeEmail">Consignee e-mail</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="consigneeEmail"
            type="email"
            placeholder="Input consignee e-mail"
            v-model.trim="models.consignee_email"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Consignee e-mail -->
      </v-row>


      <v-row>
        <!-- Shipper address -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Shipper Address"
            rules="required"
          >
          <label class="labelText" for="shipperAddress">Shipper address</label>
          <v-textarea
            :loading="loading"
            :disabled="loading"
            id="shipperAddress"
            placeholder="Input shipper address"
            v-model.trim="models.shipper_address"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-textarea>
          </validation-provider>
        </v-col>
        <!-- end Shipper address -->

        <!-- Consignee address -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Consignee Address"
            rules="required"
          >
          <label class="labelText" for="consigneeAddress">Consignee address</label>
          <v-textarea
            :loading="loading"
            :disabled="loading"
            id="consigneeAddress"
            placeholder="Input consignee address"
            v-model.trim="models.consignee_address"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-textarea>
          </validation-provider>
        </v-col>
        <!-- end Consignee address -->
      </v-row>


      <v-row>
        <!-- Notify -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Notify"
            rules="required"
          >
          <label class="labelText" for="notify">Notify</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="notify"
            placeholder="notify to"
            v-model.trim="models.notify"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Notify -->

        <!-- House BL number -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="House BL Number"
            rules="required"
          >
          <label class="labelText" for="houseBlNumber">House BL number</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="houseBlNumber"
            placeholder="Input House BL no"
            v-model.trim="models.house_bl_number"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end House BL number -->
      </v-row>

      <v-row>
        <!-- Notify address -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Notify Address"
            rules="required"
          >
          <label class="labelText" for="notifyAddress">Notify address</label>
          <v-textarea
            :loading="loading"
            :disabled="loading"
            id="notifyAddress"
            placeholder="Input notify address"
            v-model.trim="models.notify_address"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-textarea>
          </validation-provider>
        </v-col>
        <!-- end Notify address -->
      </v-row>


      <v-row>
        <!-- MB/L number -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Input MB/L Number"
            rules="required"
          >
          <label class="labelText" for="mblNumber">MB/L number</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="mblNumber"
            placeholder="Input MB/L number"
            v-model.trim="models.mbl_number"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end MB/L number -->

        <!-- House BL date -->
        <v-col cols="12" sm="6">
          <label for="houseBlDate">House BL date</label>
          <v-menu
            v-model="menuHouseBLDate"
            :close-on-content-click="false"
            transition="slide-x-reverse-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <validation-provider
                v-slot="{ errors }"
                name="House BL Date"
                rules="required"
              >
              <v-text-field
                :loading="loading"
                :disabled="loading"
                id="houseBlDate"
                v-model="houseBlDateFormatted"
                hint="DD/MM/YYYY"
                persistent-hint
                append-icon="mdi-calendar"
                placeholder="Choose House BL date"
                class="mt-3"
                :error-messages="errors"
                readonly
                v-bind="attrs"
                v-on="on"
                solo
                required
              ></v-text-field>
              </validation-provider>
            </template>
            <v-date-picker
              v-model="models.house_bl_date"
              no-title
              @input="menuHouseBLDate = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <!-- end House BL date -->
      </v-row>


      <v-row>
        <!-- Arrival date -->
        <v-col cols="12" sm="6">
          <label for="arrivalDate">Arrival date <small>(ETA)</small></label>
          <v-menu
            v-model="menuArrivalDate"
            :close-on-content-click="false"
            transition="slide-x-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <validation-provider
                v-slot="{ errors }"
                name="Arrival Date"
                rules="required"
              >
              <v-text-field
                :loading="loading"
                :disabled="loading"
                id="arrivalDate"
                v-model="arrivalDateFormatted"
                hint="DD/MM/YYYY"
                persistent-hint
                append-icon="mdi-calendar"
                placeholder="Choose Arrival date"
                :error-messages="errors"
                class="mt-3"
                readonly
                v-bind="attrs"
                v-on="on"
                solo
                required
              ></v-text-field>
              </validation-provider>
            </template>
            <v-date-picker
              v-model="models.arrival_date"
              no-title
              @input="menuArrivalDate = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <!-- end Arrival date -->

        <!-- Place of receipt -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Place Of Receipt"
            rules="required"
          >
          <label class="labelText" for="placeOfReceipt">Place of receipt</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="placeOfReceipt"
            placeholder="Input place of receipt"
            v-model.trim="models.place_of_receipt"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Place of receipt -->
      </v-row>


      <v-row>
        <!-- Container seal number -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Container Seal Number"
            rules="required"
          >
          <label class="labelText" for="containerSealNumber">Container seal number</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="containerSealNumber"
            placeholder="Input container/seal number"
            v-model.trim="models.container_seal_number"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Container seal number -->

        <!-- Ocean vessel -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Ocean Vessel"
            rules="required"
          >
          <label class="labelText" for="oceanVessel">Ocean vessel</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="oceanVessel"
            placeholder="Input ocean vessel"
            v-model.trim="models.ocean_vessel"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Ocean vessel -->
      </v-row>


      <v-row>
        <!-- Port of loading -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Port of lading"
            rules="required"
          >
          <label for="portOfLoading">Port of lading</label>
          <v-autocomplete
            id="portOfLoading"
            placeholder="Select port of lading"
            v-model.trim="models.port_of_loading"
            :items="selectData.portOfLoading"
            item-text="name"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-autocomplete>
          </validation-provider>
        </v-col>
        <!-- end port of loading -->

        <!-- Voyage number -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Voyage Number"
            rules="required|numeric"
          >
          <label class="labelText" for="voyageNumber">Voyage number</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="voyageNumber"
            placeholder="Input voyage number"
            v-model.trim="models.voyage_number"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Voyage number -->
      </v-row>

      <v-row>
        <!-- Final destination -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Final Destination"
            rules="required"
          >
          <label class="labelText" for="finalDestination">Final destination</label>
          <!-- <v-text-field
            :loading="loading"
            :disabled="loading"
            id="finalDestination"
            placeholder=""
            v-model.trim="models.final_destination"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field> -->
          <v-autocomplete
            id="finalDestination"
            placeholder="Select final destination"
            v-model.trim="models.final_destination"
            :items="selectData.finalDestination"
            item-text="name"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-autocomplete>
          </validation-provider>
        </v-col>
        <!-- end Final destination -->

        <!-- Port of discharge -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Port of discharge"
            rules="required"
          >
          <label class="labelText" for="portOfDischarge">Port of discharge</label>
          <v-autocomplete
            id="portOfDischarge"
            placeholder="Select port of discharge"
            v-model.trim="models.port_of_discharges"
            :items="selectData.portOfDischarge"
            item-text="name"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-autocomplete>
          </validation-provider>
        </v-col>
        <!-- end Port of discharge -->
      </v-row>


      <v-row>
        <!-- Gross weight -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Gross weight"
            rules="required|numeric"
          >
          <label class="labelText" for="grossWeight">Gross weight</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="grossWeight"
            placeholder="Input gross weight"
            v-model.trim="models.gross_weight"
            :error-messages="errors"
            class="mt-3"
            suffix="kg"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Gross weight -->

        <!-- Package -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Package"
            rules="required"
          >
          <label class="labelText" for="package">Package</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="package"
            placeholder="Input package"
            v-model.trim="models.package"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Package -->
      </v-row>


      <v-row>
        <!-- Number of package -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Number of package"
            rules="required"
          >
          <label class="labelText" for="numberOfPackage">Number of package</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="numberOfPackage"
            placeholder="Input number of package"
            v-model.trim="models.number_of_package"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Number of package -->

        <!-- Measurement -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Measurement"
            rules="required|numeric"
          >
          <label class="labelText" for="grossWeight">Measurement</label>
          <v-text-field
            :loading="loading"
            :disabled="loading"
            id="grossWeight"
            placeholder="Input measurement"
            v-model.trim="models.measurment"
            :error-messages="errors"
            class="mt-3"
            suffix="cbm"
            solo clearable
            required
          ></v-text-field>
          </validation-provider>
        </v-col>
        <!-- end Measurement -->
      </v-row>


      <v-row>
        <!-- Description of goods -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Description of goods"
            rules="required"
          >
          <label class="labelText" for="descriptionOfGoods">Description of goods</label>
          <v-textarea
            :loading="loading"
            :disabled="loading"
            id="descriptionOfGoods"
            placeholder="Input description of goods"
            v-model.trim="models.description_of_goods"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-textarea>
          </validation-provider>
        </v-col>
        <!-- end Description of goods -->

        <!-- Marks and number -->
        <v-col cols="12" sm="6">
          <validation-provider
            v-slot="{ errors }"
            name="Marks and number"
            rules="required"
          >
          <label class="labelText" for="marksAndNumber">Marks and number</label>
          <v-textarea
            :loading="loading"
            :disabled="loading"
            id="marksAndNumber"
            placeholder="Input marks and number"
            v-model.trim="models.marks_and_number"
            :error-messages="errors"
            class="mt-3"
            solo clearable
            required
          ></v-textarea>
          </validation-provider>
        </v-col>
        <!-- end Marks and number -->
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row justify="space-between">
        <v-col cols="auto">
          <v-btn color="primary" :disabled="loading" @click.prevent="goBack">Go back</v-btn>
          <v-btn text outlined color="red" :disabled="loading" @click.prevent="clear">Clear</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" type="submit" :loading="loading" :disabled="loading || invalid">Submit</v-btn>
        </v-col>
      </v-row>
    </form>
    </validation-observer>
  </v-container>
</template>
<script>
import _ from 'lodash';
import { required, email, double, numeric } from 'vee-validate/dist/rules';
import { extend, ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate';
import { initialEdo } from '@/utils';

setInteractionMode ('eager');
extend ('required', {
  ...required,
  message: '{_field_} is required.',
});
extend ('numeric', {
  ...numeric,
  message: '{_field_} must be valid number'
})
extend ('double', {
  ...double,
  message: '{_field_} must be valid decimal'
})
extend ('email', {
  ...email,
  message: 'E-mail must be valid.'
});

export default {
  components: { ValidationProvider, ValidationObserver },

  props: {
    loading: { type: Boolean, required: true , default: false },
    selectData: {
      shipperName: { type: Array, required: true, default: [] },
      consigneeName: { type: Array, required: true, default: [] },
      portOfLoading: { type: Array, required: true, default: [] },
      portOfDischarge: { type: Array, required: true, default: [] },
      finalDestination: { type: Array, required: true, default: [] }
    }
  },

  data () {
    return {
      menuHouseBLDate: false,
      menuArrivalDate: false,
      models: {
        shipper_name: "",
        consignee_name: "",

        shipper_email: "",
        consignee_email: "",

        shipper_address: "",
        consignee_address: "",

        notify: "",
        house_bl_number: "",

        notify_address: "",

        mbl_number: "",
        house_bl_date: "",

        arrival_date: "",
        place_of_receipt: "",

        container_seal_number: "",
        ocean_vessel: "",

        port_of_loading: "",
        voyage_number: "",

        final_destination: "",
        port_of_discharges: "",

        gross_weight: "",
        package: "",

        number_of_package: "",
        measurment: "",

        description_of_goods: "",
        marks_and_number: "",
      },
    }
  },

  computed: {
    houseBlDateFormatted () {
      if (!this.models.house_bl_date) return "";
      return this.formatDate (this.models.house_bl_date);
    },
    arrivalDateFormatted () {
      if (!this.models.arrival_date) return "";
      return this.formatDate (this.models.arrival_date);
    }
  },

  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },

    submit() {
      // this.$refs.observer.validate();
      this.$emit('onSubmit', {
        data: this.models
      });

      this.$nextTick(() => {
        this.clear();
      });
    },

    clear (e) {
      this.models = {...initialEdo};
      this.$refs.observer.reset();
    },

    goBack (e) {
      this.$router.back();
    },

    // onChangeConsigneeName (params) {
    //   if (!params) {
    //     this.models.consignee_email = ""
    //     this.models.consignee_address = ""
    //     return
    //   }
    //   const consigneSelected = _.find(this.selectData.consigneeName, { consignee_name: params });
    //   if (!consigneSelected) { return }
    //   const { consignee_email, consignee_address } = consigneSelected
    //   this.models.consignee_email = consignee_email && consignee_email
    //   this.models.consignee_address = consignee_address && consignee_address
    // }
  }
};
</script>
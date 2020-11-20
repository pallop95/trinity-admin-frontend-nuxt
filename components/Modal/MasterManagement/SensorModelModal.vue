<template>
  <div>
    <!-- @hidden="resetModalAdd" -->
    <b-modal
      id="add-modal"
      ref="modal"
      title="Insert Sensor Model"
      @show="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit.stop.prevent="handleSubmitAdd">
        <b-form-row>
          <b-col>
            <!-- <b-form-input placeholder="Address" /> -->
            <b-form-group
              :state="addressState"
              label="Address"
              label-for="Address-input"
              invalid-feedback="Address is required"
            >
              <b-form-input
                id="address-input"
                v-model="editedSensorModel.address"
                :state="addressState"
                autocomplete="off"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              :state="modelState"
              label="Model"
              label-for="Model-input"
              invalid-feedback="Model is required"
            >
              <b-form-input
                id="model-input"
                v-model="editedSensorModel.model"
                :state="modelState"
                autocomplete="off"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-group
          id="fieldset-horizontal"
          label-cols-sm="3"
          label-cols-lg="2"
          label="Value"
          label-for="add-value"
          :state="valueState"
          invalid-feedback="Value is required"
        >
          <!-- <b-form-input
            id="value-input"
            v-model="valueTextForState"
            :state="valueState"
            autocomplete="off"
            required
            hidden
          ></b-form-input> -->
          <AddButton id="add-value" @clickedAdd="addItem" />
        </b-form-group>

        <!-- <div
          id="scrollspy-nested"
          style="position: relative;min-width: 300px; height: 350px; overflow-y: auto"
        >
          <ul class="wrap snav-tabs" v-if="tempValue.length > 0">
            <li v-for="(item, index) in tempValue" :key="item.id">
              <b-form-input v-model="item.id" disabled />
              <b-form-input v-model="item.text" />
              <CrossButton @clickedCross="deleteFromList(index)" />
            </li>
          </ul>
        </div> -->

        <div id="scrollspy-nested">
          <b-form-row v-for="(item, index) in tempValue" :key="item.id">
            <b-col>
              <b-form-input v-model="item.id" disabled />
            </b-col>
            <b-col>
              <b-form-input v-model="item.text" />
            </b-col>
            <b-col cols="1">
              <CrossButton @clickedCross="deleteFromList(index)" />
            </b-col>
          </b-form-row>
        </div>
        <!-- <b-form-group
          :state="sensorTypeIdState"
          label="Sensor Type ID"
          label-for="sensorTypeId-input"
          invalid-feedback="SensorTypeID is required"
        >
          <b-form-input
            id="sensorTypeId-input"
            v-model="editedSensorModel.sensorTypeId"
            :state="sensorTypeIdState"
            required
          ></b-form-input>
        </b-form-group> -->

        <!-- <b-form-group
          id="sensorTypeId-group-input"
          label="SensorTypeID:"
          label-for="sensorTypeId-input"
        >
          <b-form-select
            id="sensorTypeId-input"
            v-model="editedSensorModel.sensorTypeId"
            :options="sensorTypeDropdownList"
          ></b-form-select>
        </b-form-group> -->
      </form>
      <!-- <h1>{{ editedSensorModel }}</h1> -->
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { SensorModel } from "@/interfaces/sensorModel.interface";
import { Value } from "@/interfaces/value.interface";
import { Dropdown } from "~/interfaces/dropdown.interface";

export default Vue.extend({
  data() {
    return {
      uneditableSensorModel: {} as SensorModel,
      editedSensorModel: {
        id: "",
        address: "",
        model: "",
        value: {},
        created_at: new Date(),
        updated_at: new Date(),
      },
      /*versionState: null as boolean | null,
      sensorModelLinkState: null as boolean | null*/
      addressState: null as boolean | null,
      modelState: null as boolean | null,
      valueState: null as boolean | null,
      valueTextForState: "",
      sensorTypeIdState: null as boolean | null,

      // sensorTypeIds: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn']
      sensorTypeDropdownList: [] as Dropdown[],

      tempValue: [] as Value[],
    };
  },
  /*async mounted(): Promise<void> {
    // await this.getSensorTypeList();
  },*/
  methods: {
    /*async getSensorTypeList() {
      console.log("getSensorTypeList");
      const res = await (this as any).$axios.get("/device/sensorTypes");

      this.sensorTypeDropdownList.push({
        text: "Select One (Optional)",
        value: null,
      });
      for (const key in res.data) {
        // this.sensorModels.push({ ...res.data[key], id: key });
        this.sensorTypeDropdownList.push({
          text: "ID: " + key + ", TypeName: " + res.data[key].typeName,
          value: key,
        });
      }
      console.log(this.sensorTypeDropdownList);
    },*/
    deleteFromList(index: number) {
      this.tempValue.splice(index, 1);
    },
    checkFormValidity() {
      this.addressState =
        this.editedSensorModel.address.length == 0 ? false : true;

      this.modelState = this.editedSensorModel.model.length == 0 ? false : true;

      // this.valueState = this.editedSensorModel.value.length == 0 ? false : true;
      // this.valueState =  this.editedSensorModel.value && this.editedSensorModel.value !== 'null' && this.editedSensorModel.value !== 'undefined'  ? false : true;
      // this.checkValueState();

      const valid = (this.$refs.form as Vue & {
        checkValidity: () => boolean;
      }).checkValidity();

      return valid;
    },
    checkValueState() {
      // this.valueTextForState = ""
      const isLengthValue = this.tempValue.length == 0 ? false : true;
      if (isLengthValue) {
        this.valueTextForState = "goNext";
        this.valueState = true;
      } else {
        this.valueTextForState = "";
        this.valueState = false;
      }
      // console.log("checkValueState", this.valueState);
    },
    async resetModalAdd() {
      this.addressState = null;
      this.modelState = null;
      this.valueState = null;
      this.sensorTypeIdState = null;
      this.tempValue = [];

      this.uneditableSensorModel = await this.$store.getters[
        "sensorModels/getSensorModel"
      ];

      this.editedSensorModel = {
        id: "",
        address: "",
        model: "",
        value: {},
        created_at: new Date(),
        updated_at: new Date(),
      };

      this.editedSensorModel.id = this.uneditableSensorModel.id;
      this.editedSensorModel.address = this.uneditableSensorModel.address;
      this.editedSensorModel.model = this.uneditableSensorModel.model;
      if (this.uneditableSensorModel.value) {
        this.editedSensorModel.value = this.uneditableSensorModel.value;
        this.tempValue = this.setTempValue(this.editedSensorModel.value);
      }
      this.editedSensorModel.created_at = this.uneditableSensorModel.created_at;
      // console.log('this.uneditableSensorModel', this.uneditableSensorModel)
    },
    setTempValue(value: any) {
      let tempValue = [];
      if (Object.keys(value).length > 0) {
        for (let key in value) {
          let json = {} as any;
          json["id"] = key;
          json["text"] = value[key];
          tempValue.push(json);
        }
      }
      return tempValue;
    },
    handleOkAdd(bvModalEvt: any) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.handleSubmitAdd();
    },
    async handleSubmitAdd() {
      if (!this.checkFormValidity()) {
        return;
      }
      this.editedSensorModel.value = this.setSensorModelValue(this.tempValue);

      await this.$emit("submit", this.editedSensorModel);

      this.$nextTick(() => {
        (this as any).$bvModal.hide("add-modal");
      });
    },
    setSensorModelValue(tempValue: Value[]): any {
      let result = {} as any;
      for (let index in tempValue) {
        result[tempValue[index].id] = tempValue[index].text;
      }
      return result;
    },
    addItem() {
      let FilteredListLength = 1;
      let value = 0;

      while (FilteredListLength > 0) {
        value++;
        FilteredListLength = this.tempValue.filter(
          (item) => item.id === "value" + value
        ).length;
      }

      this.tempValue.push({ id: "value" + value, text: "" });
      /*this.checkValueState();*/
    },
  },
});
</script>

<style>
.sensorModel-row {
  margin-top: 30px;
}

.sensorModel-table {
  margin-top: 30px;
}

div#scrollspy-nested {
  position: relative;
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

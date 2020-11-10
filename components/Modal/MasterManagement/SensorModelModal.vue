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
        <!-- address/model/value/sensor-type-id/created_at/edit/delete -->
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
        
        <b-form-group
          :state="valueState"
          label="Value"
          label-for="Value-input"
          invalid-feedback="Value is required"
        >
          <b-form-input
            id="value-input"
            v-model="editedSensorModel.value"
            :state="valueState"
            autocomplete="off"
            required
          ></b-form-input>
        </b-form-group>

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

        <b-form-group id="sensorTypeId-group-input" label="SensorTypeID:" label-for="sensorTypeId-input">
          <b-form-select
            id="sensorTypeId-input"
            v-model="editedSensorModel.sensorTypeId"
            :options="sensorTypeDropdownList"
          ></b-form-select>
          <!-- required -->
        </b-form-group>
        
      </form>
      <!-- <h1>{{ editedSensorModel }}</h1> -->
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { SensorModel } from '@/interfaces/sensorModel.interface'
import { Dropdown } from "~/interfaces/dropdown.interface"

export default Vue.extend({
  data() {
    return {
      uneditableSensorModel: {} as SensorModel,
      editedSensorModel: {
        id: '',
        address: '',
        model: '',
        value: '',
        sensorTypeId: '',
        created_at: new Date()
      },
        // address/model/value/sensor-type-id
      /*versionState: null as boolean | null,
      sensorModelLinkState: null as boolean | null*/
      addressState: null as boolean | null,
      modelState: null as boolean | null,
      valueState: null as boolean | null,
      sensorTypeIdState: null as boolean | null,

      // sensorTypeIds: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn']
      sensorTypeDropdownList: [] as Dropdown[]
    }
  },
  async mounted(): Promise<void> {
    await this.getSensorTypeList()
  },
  methods: {
    async getSensorTypeList() {
      console.log('getSensorTypeList')
      const res = await (this as any).$axios.get("/sensorTypes.json")

      this.sensorTypeDropdownList.push({ text: 'Select One (Optional)', value: null })
      for (const key in res.data) {
          // this.sensorModels.push({ ...res.data[key], id: key });
          this.sensorTypeDropdownList.push({
            text: 'ID: ' + key + ', TypeName: ' +res.data[key].typeName,
            value: key
          })
      }
      console.log(this.sensorTypeDropdownList)
    },
    checkFormValidity() {
      const valid = (this.$refs.form as Vue & { checkValidity: () => boolean }).checkValidity()

      this.addressState = (this.editedSensorModel.address.length == 0) ? false: true

      this.modelState = (this.editedSensorModel.model.length == 0) ? false: true

      this.valueState = (this.editedSensorModel.value.length == 0) ? false: true

      // this.sensorTypeIdState = (this.editedSensorModel.sensorTypeId.length == 0) ? false: true

      return valid
    },
    async resetModalAdd() {
        console.log('resetModalAdd')
        this.addressState = null
        this.modelState = null
        this.valueState = null
        this.sensorTypeIdState = null

        this.uneditableSensorModel = await this.$store.getters['sensorModels/getSensorModel']

        this.editedSensorModel = {
          id: '',
          address: '',
          model: '',
          value: '',
          sensorTypeId: '',
          created_at: new Date()
        }

        this.editedSensorModel.id = this.uneditableSensorModel.id
        this.editedSensorModel.address = this.uneditableSensorModel.address
        this.editedSensorModel.model = this.uneditableSensorModel.model
        this.editedSensorModel.value = this.uneditableSensorModel.value
        this.editedSensorModel.sensorTypeId = this.uneditableSensorModel.sensorTypeId
        this.editedSensorModel.created_at = this.uneditableSensorModel.created_at
    },
    handleOkAdd(bvModalEvt: any) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()

      this.handleSubmitAdd()
    },
    async handleSubmitAdd() {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$emit('submit', this.editedSensorModel)

      this.$nextTick(() => {
        (this as any).$bvModal.hide('add-modal')
      })
      console.log('hide modal...')
    }
  }
})
</script>

<style>
.sensorModel-row {
  margin-top: 30px;
}

.sensorModel-table {
  margin-top: 30px;
}
</style>

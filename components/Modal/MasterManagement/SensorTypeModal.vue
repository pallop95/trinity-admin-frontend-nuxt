<template>
  <div>
    <b-modal
      id="add-modal"
      ref="modal"
      title="Insert SensorType"
      @show="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit.stop.prevent="handleSubmitAdd">
        <b-form-group
          :state="addressState"
          label="Address"
          label-for="Address-input"
          invalid-feedback="Address is required"
        >
          <b-form-input
            id="address-input"
            v-model="editedSensorType.address"
            :state="addressState"
            autocomplete="off"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :state="typeState"
          label="Type"
          label-for="type-input"
          invalid-feedback="Type is required"
        >
          <b-form-input
            id="typeName-input"
            v-model="editedSensorType.type"
            :state="typeState"
            autocomplete="off"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="sensorModels-group-input"
          label="SensorModels"
          label-for="sensorModels-input"
        >
          <b-form-row id="sensorModels-input">
            <b-col md="auto">
                <b-form-select
                  v-model="selected"
                  :options="sensorModeloptionsFiltered"
                ></b-form-select>
                  <!-- id="sensorModels-input" -->
            </b-col>
            <b-col cols="2" md="auto">
              <AddButton v-if="selected != null" id="add-value" @clickedAdd="addSensorModel" />
              <!-- @clickedAdd="addItem"  -->
            </b-col>
          </b-form-row>
        </b-form-group>

        <!-- <b-form-group
          id="sensorModels-group-input"
          label="SensorModels:"
          label-for="sensorModels-input"
        >
          <b-form-select
            id="sensorModels-input"
            v-model="selected"
            :options="sensorModeloptions"
          ></b-form-select>
        </b-form-group> -->
        <!-- <b-form-select v-model="selected" :options="sensorModeloptions" multiple :select-size="4"></b-form-select> -->

        <b-list-group id="scrollspy-nested" v-if="selectedSensorModels.length > 0">
          <b-list-group-item v-for="(selectedSensorModel, index) in selectedSensorModels" :key="selectedSensorModel.id">
            ID: {{ selectedSensorModel.id }}, 
            Address: {{ selectedSensorModel.address }}, 
            Model: {{ selectedSensorModel.model }}
            <CrossButton @clickedCross="deleteSensorModel(index)" />
          </b-list-group-item>
        </b-list-group>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { SensorType } from '@/interfaces/sensorType.interface'
import { SensorModel } from "@/interfaces/sensorModel.interface"
import { Dropdown } from "~/interfaces/dropdown.interface"

export default Vue.extend({
  data() {
    return {
      uneditableSensorType: {} as SensorType,
      editedSensorType: {
          id: '',
          address: '',
          type: '',
          created_at: new Date(),
          updated_at: new Date()
      } as SensorType,
      addressState: null as boolean | null,
      typeState: null as boolean | null,

      sensorModels: [] as SensorModel[],
      selectedSensorModels: [] as SensorModel[],
      selected: null as any,

      sensorModeloptions: [] as Dropdown[],
      sensorModeloptionsFiltered: [] as Dropdown[],
    }
  },
  async mounted(): Promise<void> {
    await this.$store.dispatch('sensorModels/setSensorModelsAction');

    await this.getAndSetDropdownListSensorModels()
    // console.log('sensorModels', this.sensorModels)
  },
  methods: {
    async getAndSetDropdownListSensorModels(): Promise<void> {
      this.sensorModels = await this.$store.getters['sensorModels/getSensorModels']

      this.sensorModeloptions = []
      this.sensorModeloptions.push({
        text: "Select One (Optional)",
        value: null,
      });
      for (const key in this.sensorModels) {
        // this.sensorModels.push({ ...res.data[key], id: key });
        this.sensorModeloptions.push({
          text: "ID: " + this.sensorModels[key].id + ", Address: " + this.sensorModels[key].address + ", Model: " + this.sensorModels[key].model,
          value: this.sensorModels[key].id
        });
      }
      // console.log('sensorModeloptions', this.sensorModeloptions)
    },
    checkFormValidity() {
      const valid = (this.$refs.form as Vue & { checkValidity: () => boolean }).checkValidity()
      this.addressState = (this.editedSensorType.address.length == 0) ? false: true

      this.typeState = (this.editedSensorType.type.length == 0) ? false: true
      return valid
    },
    async resetModalAdd() {
      this.addressState = null
      this.typeState = null
      this.selectedSensorModels = []
      this.uneditableSensorType = await this.$store.getters['sensorTypes/getSensorType']
      console.log('uneditableSensorType', this.uneditableSensorType)
      this.editedSensorType.id = this.uneditableSensorType.id
      this.editedSensorType.address = this.uneditableSensorType.address
      this.editedSensorType.type = this.uneditableSensorType.type
      this.editedSensorType.sensor_models = this.uneditableSensorType.sensor_models
      this.editedSensorType.created_at = this.uneditableSensorType.created_at
      this.editedSensorType.updated_at = this.uneditableSensorType.updated_at

      if( this.editedSensorType.sensor_models ) {
        // let selectedSensorModels = this.editedSensorType.sensor_models
        for( let index in this.editedSensorType.sensor_models ) {
          let sensorModel = {} as SensorModel;
          sensorModel.id = this.editedSensorType.sensor_models[index].id
          sensorModel.address = this.editedSensorType.sensor_models[index].address
          sensorModel.model = this.editedSensorType.sensor_models[index].model
          sensorModel.value = this.editedSensorType.sensor_models[index].value
          sensorModel.created_at = this.editedSensorType.sensor_models[index].created_at
          sensorModel.updated_at = this.editedSensorType.sensor_models[index].updated_at

          this.selectedSensorModels.push(sensorModel);
        }
      }

      this.selected = null

      this.resetOptions();
    },
    resetOptions() {
      // console.log('resetOptions')
      if( this.selectedSensorModels ) {
        const ids = this.selectedSensorModels.map(sensor_model => { return sensor_model.id });
        this.sensorModeloptionsFiltered = this.sensorModeloptions.filter(sensorModeloption => ids.indexOf(sensorModeloption.value) < 0 )
      } else {
        this.sensorModeloptionsFiltered = this.sensorModeloptions
      }
      // console.log('end resetOptions')
    },
    handleOkAdd(bvModalEvt: any) {
      bvModalEvt.preventDefault()

      this.handleSubmitAdd()
    },
    async handleSubmitAdd() {
      if (!this.checkFormValidity()) {
        return
      }

      this.editedSensorType.sensor_models = this.selectedSensorModels

      await this.$emit('submit', this.editedSensorType)

      this.$nextTick(() => {
        (this as any).$bvModal.hide('add-modal')
      })
    },
    addSensorModel() {
      let selectedSensorModel = this.sensorModels.filter(sensorModel => sensorModel.id == this.selected)[0]
      this.selectedSensorModels.push(selectedSensorModel)

      let index = this.sensorModeloptionsFiltered.findIndex(dropdown => dropdown.value == this.selected)
      this.sensorModeloptionsFiltered.splice(index, 1)

      this.selected = null
    },
    deleteSensorModel(index: number) {
      this.selectedSensorModels.splice(index, 1)
      this.resetOptions();
    }
  }
})
</script>

<style>
.sensorType-row {
  margin-top: 30px;
}

.sensorType-table {
  margin-top: 30px;
}

div#scrollspy-nested {
  position: relative;
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

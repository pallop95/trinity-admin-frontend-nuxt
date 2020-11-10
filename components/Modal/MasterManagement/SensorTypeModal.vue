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
          :state="typeNameState"
          label="Type Name"
          label-for="typeName-input"
          invalid-feedback="TypeName is required"
        >
          <b-form-input
            id="typeName-input"
            v-model="editedSensorType.typeName"
            :state="typeNameState"
            autocomplete="off"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { SensorType } from '@/interfaces/sensorType.interface'

export default Vue.extend({
  data() {
    return {
      uneditableSensorType: {} as SensorType,
      editedSensorType: {
          id: '',
          address: '',
          typeName: '',
          created_at: new Date()
      },
      addressState: null as boolean | null,
      typeNameState: null as boolean | null
    }
  },
  methods: {
    checkFormValidity() {
      const valid = (this.$refs.form as Vue & { checkValidity: () => boolean }).checkValidity()
      this.addressState = (this.editedSensorType.address.length == 0) ? false: true

      this.typeNameState = (this.editedSensorType.typeName.length == 0) ? false: true
      return valid
    },
    async resetModalAdd() {
        console.log('resetModalAdd')
        this.addressState = null
        this.typeNameState = null
        this.uneditableSensorType = await this.$store.getters['sensorTypes/getSensorType']
        this.editedSensorType.id = this.uneditableSensorType.id
        this.editedSensorType.address = this.uneditableSensorType.address
        this.editedSensorType.typeName = this.uneditableSensorType.typeName
        this.editedSensorType.created_at = this.uneditableSensorType.created_at
    },
    handleOkAdd(bvModalEvt: any) {
      bvModalEvt.preventDefault()

      this.handleSubmitAdd()
    },
    async handleSubmitAdd() {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$emit('submit', this.editedSensorType)

      this.$nextTick(() => {
        (this as any).$bvModal.hide('add-modal')
      })
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
</style>

<template>
  <div>

    <b-modal
      id="add-modal"
      ref="modal"
      title="Insert Firmware"
      @show="resetModalAdd"
      @hidden="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit.stop.prevent="handleSubmitAdd">
        <b-form-group
          :state="versionState"
          label="Version"
          label-for="Version-input"
          invalid-feedback="Version is required"
        >
          <b-form-input
            id="version-input"
            v-model="firmware.version"
            :state="versionState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :state="firmwareLinkState"
          label="Firmware Link"
          label-for="firmwareLink-input"
          invalid-feedback="FirmwareLink is required"
        >
          <b-form-input
            id="firmwareLink-input"
            v-model="firmware.firmwareLink"
            :state="firmwareLinkState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Firmware } from '@/interfaces/firmware.interface'

export default Vue.extend({
  props: {
    firmware: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
        editedFirmware: this.firmware ?
        { 
            ...this.firmware 
        }:
        {
            version: '',
            firmwareLink: ''
        },
      /*editModal: {
        id: 'edit-modal',
        firmware: {} as Firmware,
      },
      deleteModal: {
        id: 'delete-modal',
        content: '',
        firmware: {} as Firmware,
      },
      firmware: {} as Firmware,*/
      versionState: null as boolean | null,
      firmwareLinkState: null as boolean | null,
    //   firmwares: [] as Firmware[]
    }
  },
  methods: {
    checkFormValidity() {
      const valid = (this.$refs.form as Vue & { checkValidity: () => boolean }).checkValidity()
      this.versionState = (this.editedFirmware.version.length == 0) ? false: true

      this.firmwareLinkState = (this.editedFirmware.firmwareLink.length == 0) ? false: true
      return valid
    },
    resetModalAdd() {
      this.editedFirmware.version = ''
      this.versionState = null
      this.editedFirmware.firmwareLink = ''
      this.firmwareLinkState = null
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

      // Push the name to submitted names
      // this.submittedNames.push(this.name)
      this.$emit('submit', this.editedFirmware)
      
      // Hide the modal manually
      this.$nextTick(() => {
        (this as any).$bvModal.hide('modal-prevent-closing')
      })
    }
  }
})
</script>

<style>
.firmware-row {
  margin-top: 30px;
}

.firmware-table {
  margin-top: 30px;
}
</style>

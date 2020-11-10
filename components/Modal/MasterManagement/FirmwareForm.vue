<template>
  <div>
<!-- @hidden="resetModalAdd" -->
    <b-modal
      id="add-modal"
      ref="modal"
      title="Insert Firmware"
      @show="resetModalAdd"
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
            v-model="editedFirmware.version"
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
            v-model="editedFirmware.firmwareLink"
            :state="firmwareLinkState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <!-- <h1>{{ editedFirmware }}</h1> -->
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Firmware } from '@/interfaces/firmware.interface'

export default Vue.extend({
//   props: {
//     firmware: {
//       type: Object,
//       required: true
//     }
//   },
  data() {
    return {
        uneditableFirmware: {} as Firmware,
        editedFirmware: {
            id: '',
            version: '',
            firmwareLink: '',
            created_at: new Date()
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
    async resetModalAdd() {
        console.log('resetModalAdd')
        this.versionState = null
        this.firmwareLinkState = null
        this.uneditableFirmware = await this.$store.getters['firmwares/getFirmware']
        // console.log(this.uneditableFirmware)
        this.editedFirmware.id = this.uneditableFirmware.id
        this.editedFirmware.version = this.uneditableFirmware.version
        this.editedFirmware.firmwareLink = this.uneditableFirmware.firmwareLink
        this.editedFirmware.created_at = this.uneditableFirmware.created_at
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
      await this.$emit('submit', this.editedFirmware)

      // Hide the modal manually
      this.$nextTick(() => {
        (this as any).$bvModal.hide('add-modal')
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

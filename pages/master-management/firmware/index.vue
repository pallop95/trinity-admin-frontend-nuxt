<template>
  <div>
    <!-- <div class="mt-3">
      Submitted Names:
      <div v-if="submittedNames.length === 0">--</div>
      <ul v-else class="mb-0 pl-3">
        <li
          v-for="name in submittedNames"
          v-bind:key="name"
        >
          {{ name }}
        </li>
      </ul>
    </div> -->

    <b-container class="firmware-row">
      <b-row>
        <b-col md="2" offset-md="10">
          <b-button 
            title="Save file"
            v-b-modal.add-modal
          >
            <b-icon
              icon="cloud-upload"
              aria-hidden="true"
            />
          </b-button>
        </b-col>
      </b-row>
      <b-row align-v="center" class="firmware-table">
        <b-col md="12">
          <div class="content">
            <b-table :items="firmwares" :fields="fields">

              <template #cell(created_at)="data">
                <b class="text-success"> {{ formatDate(data.value) }} </b>
              </template>

              <template v-slot:cell(edit)="row">
                <b-button
                  size="sm"
                  @click="handleClickEdit(row.item, $event.target)"
                  class="mr-1"
                  variant="info"
                >
                  Edit
                </b-button>
              </template>

              <template v-slot:cell(delete)="row">
                <b-button
                  size="sm"
                  @click="handleClickDelete(row.item, $event.target)"
                  class="mr-1"
                  variant="danger"
                >
                  Delete
                </b-button>
              </template>
            </b-table>
          </div>
        </b-col>
      </b-row>
    </b-container>

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

    <b-modal
      :id="editModal.id"
      ref="editModal"
      title="Edit Firmware"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit.stop.prevent="handleSubmitEdit">
        <b-form-group
          :state="versionState"
          label="Version"
          label-for="Version-input"
          invalid-feedback="Version is required"
        >
          <b-form-input
            id="version-update-input"
            v-model="editModal.firmware.version"
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
            id="firmwareLink-update-input"
            v-model="editModal.firmware.firmwareLink"
            :state="firmwareLinkState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

    <b-modal
      :id="deleteModal.id"
      title="Delete Firmware?"
      centered
      hide-header-close
      @ok="confirmDelete"
    >
    <!-- @hide="resetInfoModal" -->
      <pre style="margin: 0px">{{ deleteModal.content }}</pre>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Firmware } from '@/interfaces/firmware.interface'

export default Vue.extend({
  data() {
    return {
      editModal: {
        id: 'edit-modal',
        firmware: {} as Firmware,
      },
      deleteModal: {
        id: 'delete-modal',
        content: '',
        firmware: {} as Firmware,
      },
      fields: [
        {
          key: "id",
          label: "FirmwareID",
          sortable: true,
        },
        {
          key: "version",
          label: "Version",
          sortable: true,
        },
        {
          key: "firmwareLink",
          label: "Firmware Link",
          sortable: true,
        },
        {
          key: "created_at",
          label: "Created At",
          sortable: true,
        },
        {
          key: "edit",
          label: "Edit"
        },
        {
          key: "delete",
          label: "Delete"
        }
      ],
      firmware: {} as Firmware,
      versionState: null as boolean | null,
      firmwareLinkState: null as boolean | null,
      firmwares: [] as Firmware[]
    }
  },
  async mounted() {
    await this.getFirmwares()
  },
  methods: {
    formatDate(dateInput: string) {
      let date = new Date(dateInput)
      return date.toISOString().substring(0, 10)
    },
    checkFormValidity() {
      const valid = (this.$refs.form as Vue & { checkValidity: () => boolean }).checkValidity()
      this.versionState = (this.firmware.version.length == 0) ? false: true

      this.firmwareLinkState = (this.firmware.firmwareLink.length == 0) ? false: true
      return valid
    },
    resetModalAdd() {
      this.firmware.version = ''
      this.versionState = null
      this.firmware.firmwareLink = ''
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

      await this.postFirmware()

      // Hide the modal manually
      this.$nextTick(() => {
        (this as any).$bvModal.hide('modal-prevent-closing')
      })
    },

    async postFirmware (): Promise<void> {
      let createFirmware = {
          ...this.firmware,
          created_at: new Date()
      }

      const res = await (this as any).$axios.post(
        "/firmwares.json", createFirmware
      )
      console.log('res', res)
      if (res.status === 200) {
        createFirmware = {
          ...createFirmware,
          id: res.data.name
        }
        this.firmwares.push(createFirmware)
      }
    },
    async getFirmwares (): Promise<void> {
      const res = await (this as any).$axios.get("/firmwares.json")

      const postsArray = []

      for (const key in res.data) {
          this.firmwares.push({ ...res.data[key], id: key });
      }
    },
    async handleClickEdit (firmware: Firmware, button: any) {
      console.log('handleClickEdit')
      console.log(firmware.version)
      console.log(firmware.firmwareLink)
      this.firmware.version = firmware.version
      this.firmware.firmwareLink = firmware.firmwareLink
      this.editModal.firmware = firmware
      this.$root.$emit("bv::show::modal", this.editModal.id, button)
    },
    handleClickDelete (firmware: any, button: any) {
      this.deleteModal.content =
        "FirmwareID: " + firmware.id + "\n" +
        "Version  : " + firmware.version;
      this.deleteModal.firmware = firmware;
      this.$root.$emit("bv::show::modal", this.deleteModal.id, button)
    },
    async confirmDelete() {
      console.log('confirmDelete');
      let employee: Firmware = this.deleteModal.firmware;

      const res = await (this as any).$axios({
        method: "delete",
        url: "/firmwares/" + employee.id +".json"
        // headers: {
        //   "Content-Type": "text/plain",
        //   Authorization: this.$store.getters["auths/bearerToken"],
        // }
      })

      this.firmwares = this.firmwares.filter((firmmware: Firmware) => firmmware.id != employee.id)
    },
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

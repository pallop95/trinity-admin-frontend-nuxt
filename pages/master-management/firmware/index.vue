<template>
  <div>
    <b-container class="firmware-row">
      <b-row>
        <b-col md="2" offset-md="10">
          <AddButton @clickedAdd="handleClickAdd" />
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
                <EditButton @clickedEdit="handleClickEdit(row.item)" />
              </template>

              <template v-slot:cell(delete)="row">
                <DeleteButton @clickedDelete="handleClickDelete(row.item)" />
              </template>
            </b-table>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <FirmwareForm @submit="onSubmitted" />

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
  /*asyncData() {
    return {
      firmware: {
        version: '11111',
        firmwareLink: 'firmwareLink1111',
      }
    }
  },*/
  data() {
    return {
      // isModalVisible: false,
      addModalId: 'add-modal',
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
      blankFirmware: {
        id: '',
        version: '',
        firmwareLink: '',
        created_at: new Date(),
      } as Firmware,
      versionState: null as boolean | null,
      firmwareLinkState: null as boolean | null,
      firmwares: [] as any[]
    }
  },
  async mounted(): Promise<void> {
    await this.getFirmwares()
  },
  methods: {
    async onSubmitted(editedFirmware: Firmware): Promise<void> {
      console.log(editedFirmware)
      this.firmware = editedFirmware

      if(this.firmware.id === '') {
        await this.postFirmware()
      } else {
        await this.updateFirmware(this.firmware)
      }
    },
    // showModal() {
    //   this.isModalVisible = true;
    // },
    // closeModal() {
    //   this.isModalVisible = false;
    // },
    async postFirmware (): Promise<void> {
      let createFirmware = {
          ...this.firmware,
          created_at: new Date()
      }

      const res = await (this as any).$axios.post(
        "/firmwares.json", createFirmware
      )
      console.log('postFirmware', res)
      if (res.status === 200) {
        createFirmware = {
          ...createFirmware,
          id: res.data.name
        }
        this.firmwares.push(createFirmware)
      }
    },
    async updateFirmware (firmware: Firmware): Promise<void> {
      let firmwares = this.firmwares

      firmware.created_at = new Date()

      const res = await (this as any).$axios({
        method: "put",
        url: "/firmwares/" + firmware.id +".json",
        data: firmware
      })

      if (res.status == 200) {
        let index = firmwares.findIndex((item: Firmware) => item.id === firmware.id)
        firmwares[index].version = firmware.version
        firmwares[index].firmwareLink = firmware.firmwareLink
        firmwares[index].created_at = firmware.created_at
      }

      this.firmwares = firmwares
    },

    async getFirmwares (): Promise<void> {
      const res = await (this as any).$axios.get("/firmwares.json")

      for (const key in res.data) {
          this.firmwares.push({ ...res.data[key], id: key });
      }
    },
    async handleClickAdd (): Promise<void> {
      console.log('handleClickAdd')
      this.firmware = this.blankFirmware
      // this.firmware = {};

      // await (this as any).$store.dispatch('firmwares/setFirmwareAction', this.firmware)
      await (this as any).$store.dispatch('firmwares/setFirmwareAction', this.firmware)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },
    async handleClickEdit (firmware: Firmware): Promise<void> {
      this.firmware = firmware
      await (this as any).$store.dispatch('firmwares/setFirmwareAction', this.firmware)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },

    handleClickDelete (firmware: any) {
      this.deleteModal.content =
        "FirmwareID: " + firmware.id + "\n" +
        "Version  : " + firmware.version
      this.deleteModal.firmware = firmware
      this.$root.$emit("bv::show::modal", this.deleteModal.id)
    },
    async confirmDelete(): Promise<void> {
      console.log('confirmDelete');
      let firmware: Firmware = this.deleteModal.firmware;

      const res = await (this as any).$axios({
        method: "delete",
        url: "/firmwares/" + firmware.id +".json"
      })

      this.firmwares = this.firmwares.filter((item: Firmware) => item.id != firmware.id)
    },

    formatDate(dateInput: string) {
      let date = new Date(dateInput)
      return date.toISOString().substring(0, 10)
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

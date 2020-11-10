<template>
<!-- address/type_name/sensor_model/created_at/edit/delete -->
  <div>
    <b-container class="sensorType-row">
      <b-row>
        <b-col md="2" offset-md="10">
          <AddButton @clickedAdd="handleClickAdd" />
        </b-col>
      </b-row>
 
      <b-row align-v="center" class="sensorType-table">
        <b-col md="12">
          <div class="content">
            <b-table :items="sensorTypes" :fields="fields">

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

    <SensorTypeModal @submit="onSubmitted" />

    <b-modal
      :id="deleteModal.id"
      title="Delete SensorType?"
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
import { SensorType } from '@/interfaces/sensorType.interface'

export default Vue.extend({
  data() {
    return {
      // isModalVisible: false,
      addModalId: 'add-modal',
      deleteModal: {
        id: 'delete-modal',
        content: '',
        sensorType: {} as SensorType,
      },
      fields: [
        {
          key: "id",
          label: "SensorTypeID",
          sortable: true,
        },
        {
          key: "address",
          label: "Address",
          sortable: true,
        },
        {
          key: "typeName",
          label: "Type Name",
          sortable: true,
        },
        /*{
          key: "sensorModelId",
          label: "Sensor Model",
          sortable: true,
        },*/
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
      sensorType: {} as SensorType,
      blankSensorType: {
        id: '',
        address: '',
        typeName: '',
        // sensorModel: null,
        created_at: new Date(),
      } as SensorType,

      /*versionState: null as boolean | null,
      firmwareLinkState: null as boolean | null,*/
      addressState: null as boolean | null,
      typeNameState: null as boolean | null,

      sensorTypes: [] as any[]
    }
  },
  async mounted(): Promise<void> {
    await this.getSensorTypes()
  },
  methods: {
    async onSubmitted(editedSensorType: SensorType): Promise<void> {
      console.log(editedSensorType)
      this.sensorType = editedSensorType
      
      if(this.sensorType.id === '') {
        await this.postSensorType()
      } else {
        await this.updateSensorType(this.sensorType)
      }
    },
    // showModal() {
    //   this.isModalVisible = true;
    // },
    // closeModal() {
    //   this.isModalVisible = false;
    // },
    async postSensorType (): Promise<void> {
      let createSensorType = {
          ...this.sensorType,
          created_at: new Date()
      }

      const res = await (this as any).$axios.post(
        "/sensorTypes.json", createSensorType
      )
      console.log('postSensorType', res)
      if (res.status === 200) {
        createSensorType = {
          ...createSensorType,
          id: res.data.name
        }
        console.log(createSensorType)
        this.sensorTypes.push(createSensorType)
      }
    },
    async updateSensorType (sensorType: SensorType): Promise<void> {
      let sensorTypes = this.sensorTypes

      sensorType.created_at = new Date()

      const res = await (this as any).$axios({
        method: "put",
        url: "/sensorTypes/" + sensorType.id +".json",
        data: sensorType
      })

      if (res.status == 200) {
        let index = sensorTypes.findIndex((item: SensorType) => item.id === sensorType.id)

        sensorTypes.splice(index, 1, sensorType)
      }

      this.sensorTypes = sensorTypes
    },

    async getSensorTypes (): Promise<void> {
      const res = await (this as any).$axios.get("/sensorTypes.json")

      for (const key in res.data) {
          this.sensorTypes.push({ ...res.data[key], id: key });
      }
    },
    async handleClickAdd (): Promise<void> {
      console.log('handleClickAdd')
      this.sensorType = this.blankSensorType

      await (this as any).$store.dispatch('sensorTypes/setSensorTypeAction', this.sensorType)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },
    async handleClickEdit (sensorType: SensorType, button: any): Promise<void> {
      this.sensorType = sensorType
      await (this as any).$store.dispatch('sensorTypes/setSensorTypeAction', this.sensorType)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },

    handleClickDelete (sensorType: SensorType) {
      this.deleteModal.content =
        "SensorTypeID: " + sensorType.id + "\n" +
        "Address     : " + sensorType.address + "\n" +
        "Type Name   : " + sensorType.typeName + "\n"
        // "Address     : " + sensorType.sensorModel + "\n" +
      this.deleteModal.sensorType = sensorType
      this.$root.$emit("bv::show::modal", this.deleteModal.id)
    },
    async confirmDelete(): Promise<void> {
      console.log('confirmDelete');
      let sensorType: SensorType = this.deleteModal.sensorType;

      const res = await (this as any).$axios({
        method: "delete",
        url: "/sensorTypes/" + sensorType.id +".json"
      })

      this.sensorTypes = this.sensorTypes.filter((item: SensorType) => item.id != sensorType.id)
    },

    formatDate(dateInput: string) {
      let date = new Date(dateInput)
      return date.toISOString().substring(0, 10)
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

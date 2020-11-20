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
            <b-table responsive :items="sensorTypes" :fields="fields">

              <template #cell(created_at)="data">
                <b class="text-success"> {{ formatDate(data.value) }} </b>
              </template>

              <template #cell(updated_at)="data">
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
          key: "type",
          label: "Type",
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
          key: "updated_at",
          label: "Updated At",
          sortable: true,
        },
        {
          key: "edit",
          label: ""
        },
        {
          key: "delete",
          label: ""
        }
      ],
      sensorType: {} as SensorType,
      sensorTypeForDispatch: {} as SensorType,
      blankSensorType: {
        id: '',
        address: '',
        type: '',
        // sensorModel: null,
        created_at: new Date(),
        updated_at: new Date()
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
      // this.sensorType = editedSensorType
      
      this.sensorType.id = editedSensorType.id
      this.sensorType.address = editedSensorType.address
      this.sensorType.type = editedSensorType.type
      this.sensorType.sensor_models = editedSensorType.sensor_models
      this.sensorType.created_at = editedSensorType.created_at
      this.sensorType.updated_at = editedSensorType.updated_at
      
      if(this.sensorType.id === '') {
        await this.postSensorType()
      } else {
        await this.updateSensorType()
      }
    },
    // showModal() {
    //   this.isModalVisible = true;
    // },
    // closeModal() {
    //   this.isModalVisible = false;
    // },
    async postSensorType (): Promise<void> {
      let sensorType = this.sensorType;
      let createSensorType = {
          ...sensorType,
          created_at: new Date(),
          updated_at: new Date()
      }

      console.log('createSensorType', createSensorType)
      const res = await (this as any).$axios({
        method: "post",
        url: "/device/sensorTypes",
        headers: {
          'Authorization': this.$store.getters['auths/bearerToken']
        },
        data: createSensorType
      })

      // if (res.status === 200) {
      //   createSensorType = {
      //     ...createSensorType,
      //     id: res.data.name
      //   }
      //   console.log(createSensorType)
      //   this.sensorTypes.push(createSensorType)
      // }
      if (res.status === 200) {
        createSensorType = {
          ...createSensorType,
          id: res.data.data.id,
          created_at: res.data.data.created_at,
          updated_at: res.data.data.updated_at,
        }
        this.sensorTypes.push(createSensorType)
      }
    },
    async updateSensorType (): Promise<void> {
      let sensorTypes = this.sensorTypes
      
      let sensorType = this.sensorType;

      sensorType.updated_at = new Date()

      const res = await (this as any).$axios({
        method: "put",
        url: "/device/sensorTypes",
        headers: {
          'Authorization': this.$store.getters['auths/bearerToken']
        },
        data: sensorType
      })

      // if (res.status == 200) {
      //   let index = sensorTypes.findIndex((item: SensorType) => item.id === sensorType.id)

      //   sensorTypes.splice(index, 1, sensorType)
      // }

      // this.sensorTypes = sensorTypes
      if (res.status == 200) {
        let index = sensorTypes.findIndex((item: SensorType) => item.id === sensorType.id)
        sensorTypes.splice(index, 1, sensorType)

        this.sensorTypes = sensorTypes
      }
    },

    async getSensorTypes (): Promise<void> {
      const res = await (this as any).$axios.get("/device/sensorTypes")

      let sensorTypes: SensorType[] = []
      for (const index in res.data.data) {
        sensorTypes.push({ ...res.data.data[index] });
      }
      this.sensorTypes = sensorTypes
    },
    async handleClickAdd (): Promise<void> {
      console.log('handleClickAdd........')
      console.log('blankSensorType', this.blankSensorType)
      let sensorType = this.blankSensorType
      console.log('sensorType', sensorType)

      this.sensorTypeForDispatch.id = sensorType.id
      this.sensorTypeForDispatch.address = sensorType.address
      this.sensorTypeForDispatch.type = sensorType.type
      this.sensorTypeForDispatch.sensor_models = sensorType.sensor_models
      this.sensorTypeForDispatch.created_at = sensorType.created_at
      this.sensorTypeForDispatch.updated_at = sensorType.updated_at

      await (this as any).$store.dispatch('sensorTypes/setSensorTypeAction', this.sensorTypeForDispatch)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },
    async handleClickEdit (sensorType: SensorType, button: any): Promise<void> {
      this.sensorType = sensorType

      this.sensorTypeForDispatch.id = sensorType.id
      this.sensorTypeForDispatch.address = sensorType.address
      this.sensorTypeForDispatch.type = sensorType.type
      this.sensorTypeForDispatch.sensor_models = sensorType.sensor_models
      this.sensorTypeForDispatch.created_at = sensorType.created_at
      this.sensorTypeForDispatch.updated_at = sensorType.updated_at

      await (this as any).$store.dispatch('sensorTypes/setSensorTypeAction', this.sensorTypeForDispatch)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },

    handleClickDelete (sensorType: SensorType) {
      this.deleteModal.content =
        "SensorTypeID: " + sensorType.id + "\n" +
        "Address     : " + sensorType.address + "\n" +
        "Type   : " + sensorType.type + "\n"
        // "Address     : " + sensorType.sensorModel + "\n" +
      this.deleteModal.sensorType = sensorType
      this.$root.$emit("bv::show::modal", this.deleteModal.id)
    },
    async confirmDelete(): Promise<void> {
      console.log('confirmDelete');
      let sensorType: SensorType = this.deleteModal.sensorType;

      const res = await (this as any).$axios({
        method: "delete",
        url: "/device/sensorTypes",
        headers: {
          'Authorization': this.$store.getters['auths/bearerToken']
        },
        data: sensorType
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

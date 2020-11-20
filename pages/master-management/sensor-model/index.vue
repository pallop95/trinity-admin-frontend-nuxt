<template>
  <div>
    <b-container class="sensorModel-row">
      <b-row>
        <b-col md="2" offset-md="10">
          <AddButton @clickedAdd="handleClickAdd" />
        </b-col>
      </b-row>

      <b-row align-v="center" class="sensorModel-table">
        <b-col md="12">
          <div class="content">
            <b-table responsive :items="sensorModels" :fields="fields">
              
              <template #cell(created_at)="data">
                <b class="text-success"> {{ formatDate(data.value) }} </b>
              </template>

              <template v-slot:cell(edit)="row">
                <EditButton @clickedEdit="handleClickEdit(row.item)" />
              </template>

              <template v-slot:cell(delete)="row">
                <!-- <b-button
                  size="sm"
                  @click="handleClickDelete(row.item, $event.target)"
                  class="mr-1"
                  variant="danger"
                >
                  Delete
                </b-button> -->
                <DeleteButton @clickedDelete="handleClickDelete(row.item)" />
              </template>
            </b-table>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <SensorModelModal @submit="onSubmitted" />

    <b-modal
      :id="deleteModal.id"
      title="Delete SensorModel?"
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
import { SensorModel } from '@/interfaces/sensorModel.interface'
import { Dropdown } from '@/interfaces/dropdown.interface'
// import { SensorType } from "~/interfaces/sensorType.interface"

export default Vue.extend({
  data() {
    return {
      // isModalVisible: false,
      addModalId: 'add-modal',
      deleteModal: {
        id: 'delete-modal',
        content: '',
        sensorModel: {} as SensorModel,
      },
      fields: [
        {
          key: "id",
          label: "SensorModelID",
          sortable: true,
        },
        {
          key: "address",
          label: "Address",
          sortable: true,
        },
        {
          key: "model",
          label: "Model",
          sortable: true,
        },
        // {
        //   key: "value",
        //   label: "Value",
        //   sortable: true,
        // },
        {
          key: "created_at",
          label: "Created At",
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
      sensorModel: {} as SensorModel,
      blankSensorModel: {
        id: '',
        address: '',
        model: '',
        value: {},
        created_at: new Date(),
      } as SensorModel,
      sensorModels: [] as any[],
      // sensorTypeDropdownList: [] as Dropdown[],
      // sensorTypeList: [] as SensorType[]
    }
  },
  async mounted(): Promise<void> {
    this.sensorModels = await this.getSensorModels()
    
    // this.sensorTypeList = await this.getSensorTypeList()
  },
  methods: {
    // async getSensorTypeList(): Promise<SensorType[]> {
    //   await (this as any).$store.dispatch('sensorTypes/setSensorTypeListAction')

    //   return await this.$store.getters['sensorTypes/getSensorTypeList']
    // },
    async onSubmitted (editedSensorModel: SensorModel): Promise<void> {
      // console.log('editedSensorModel', editedSensorModel)
      if(editedSensorModel.id == '') {
        await this.postSensorModel(editedSensorModel)
      } else {
        await this.updateSensorModel(editedSensorModel)
      }
    },
    async postSensorModel (editedSensorModel: SensorModel): Promise<void> {
      let createSensorModel = {
          ...editedSensorModel,
          created_at: new Date(),
          updated_at: new Date()
      }
    
      const res = await (this as any).$axios({
        method: "post",
        url: "/device/sensorModels",
        headers: {
          'Authorization': this.$store.getters['auths/bearerToken']
        },
        data: createSensorModel
        /*data: {
          firstName: "Fred",
          lastName: "Flintstone",
        },*/
      });
      // console.log('postSensorModel', res)
      if (res.status === 200) {
        createSensorModel = {
          ...createSensorModel,
          id: res.data.data.id,
          created_at: res.data.data.created_at,
          updated_at: res.data.data.updated_at,
        }
        this.sensorModels.push(createSensorModel)
      }
    },
    async updateSensorModel (editedSensorModel: SensorModel): Promise<void> {
      let sensorModels = this.sensorModels

      editedSensorModel.updated_at = new Date()

      const res = await (this as any).$axios({
        method: "put",
        url: "/device/sensorModels",
        headers: {
          'Authorization': this.$store.getters['auths/bearerToken']
        },
        data: editedSensorModel
      })
      // console.log('res put', res)
      if (res.status == 200) {
        let index = sensorModels.findIndex((item: SensorModel) => item.id === editedSensorModel.id)
        sensorModels.splice(index, 1, editedSensorModel)

        this.sensorModels = sensorModels
      }
    },
    async getSensorModels (): Promise<SensorModel[]> {
      const res = await (this as any).$axios.get("/device/sensorModels")
      let sensorModels: SensorModel[] = []
      for (const index in res.data.data) {
        sensorModels.push({ ...res.data.data[index] });
      }
      // console.log('sensorModels', sensorModels)
      return sensorModels
    },
    async handleClickAdd (): Promise<void> {
      // console.log('handleClickAdd')
      this.sensorModel = this.blankSensorModel
      
      await (this as any).$store.dispatch('sensorModels/setSensorModelAction', this.sensorModel)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },
    async handleClickEdit (sensorModel: SensorModel, button: any): Promise<void> {
      // console.log('handleClickEdit')
      this.sensorModel = sensorModel
      await (this as any).$store.dispatch('sensorModels/setSensorModelAction', this.sensorModel)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },

    handleClickDelete (sensorModel: any) {
      this.deleteModal.content =
        "SensorModelID: " + sensorModel.id + "\n" +
        "Model  : " + sensorModel.model;
      this.deleteModal.sensorModel = sensorModel
      this.$root.$emit("bv::show::modal", this.deleteModal.id)
    },
    async confirmDelete(): Promise<void> {
      // console.log('confirmDelete');
      let sensorModel: SensorModel = this.deleteModal.sensorModel;

      const res = await (this as any).$axios({
        method: "delete",
        url: "/device/sensorModels",
        headers: {
          'Authorization': this.$store.getters['auths/bearerToken']
        },
        data: sensorModel
      })
      // console.log('res deleted', res)
      this.sensorModels = this.sensorModels.filter((item: SensorModel) => item.id != sensorModel.id)
    },

    formatDate (dateInput: string) {
      let date = new Date(dateInput)
      return date.toISOString().substring(0, 10)
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

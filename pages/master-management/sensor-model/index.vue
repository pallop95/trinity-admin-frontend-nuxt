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
            <b-table :items="sensorModels" :fields="fields">

              <template #cell(sensorTypeId)="data">
                <b class="text-success"> {{ getTypenameBySensorTypeId(data.value) }} ({{ data.value }}) </b>
              </template>
              
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
import { SensorType } from "~/interfaces/sensorType.interface"

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
        {
          key: "value",
          label: "Value",
          sortable: true,
        },
        {
          key: "sensorTypeId",
          label: "TypeName (SensorTypeID)",
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
      sensorModel: {} as SensorModel,
      blankSensorModel: {
        id: '',
        address: '',
        model: '',
        value: '',
        sensorTypeId: '',
        created_at: new Date(),
      } as SensorModel,
      sensorModels: [] as any[],
      sensorTypeDropdownList: [] as Dropdown[],
      sensorTypeList: [] as SensorType[]
    }
  },
  async mounted(): Promise<void> {
    this.sensorModels = await this.getSensorModels()
    
    this.sensorTypeList = await this.getSensorTypeList()
  },
  methods: {
    async getSensorTypeList(): Promise<SensorType[]> {
      await (this as any).$store.dispatch('sensorTypes/setSensorTypeListAction')

      return await this.$store.getters['sensorTypes/getSensorTypeList']
    },
    async onSubmitted (editedSensorModel: SensorModel): Promise<void> {

      if(editedSensorModel.id == '') {
        await this.postSensorModel(editedSensorModel)
      } else {
        await this.updateSensorModel(editedSensorModel)
      }
    },
    async postSensorModel (editedSensorModel: SensorModel): Promise<void> {
      let createSensorModel = {
          ...editedSensorModel,
          created_at: new Date()
      }

      const res = await (this as any).$axios.post(
        "/sensorModels.json", createSensorModel
      )
      console.log('postSensorModel', res)
      if (res.status === 200) {
        createSensorModel = {
          ...createSensorModel,
          id: res.data.name
        }
        this.sensorModels.push(createSensorModel)
      }
    },
    async updateSensorModel (editedSensorModel: SensorModel): Promise<void> {
      let sensorModels = this.sensorModels

      editedSensorModel.created_at = new Date()

      const res = await (this as any).$axios({
        method: "put",
        url: "/sensorModels/" + editedSensorModel.id +".json",
        data: editedSensorModel
      })

      if (res.status == 200) {
        let index = sensorModels.findIndex((item: SensorModel) => item.id === editedSensorModel.id)
        sensorModels.splice(index, 1, editedSensorModel)
      }

      this.sensorModels = sensorModels
    },
    async getSensorModels (): Promise<SensorModel[]> {
      const res = await (this as any).$axios.get("/sensorModels.json")

      let sensorModels: SensorModel[] = []
      for (const key in res.data) {
        sensorModels.push({ ...res.data[key], id: key });
      }
      return sensorModels
    },
    async handleClickAdd (): Promise<void> {
      console.log('handleClickAdd')
      this.sensorModel = this.blankSensorModel
      
      await (this as any).$store.dispatch('sensorModels/setSensorModelAction', this.sensorModel)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },
    async handleClickEdit (sensorModel: SensorModel, button: any): Promise<void> {
      console.log('handleClickEdit')
      this.sensorModel = sensorModel
      await (this as any).$store.dispatch('sensorModels/setSensorModelAction', this.sensorModel)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },

    handleClickDelete (sensorModel: any, button: any) {
      this.deleteModal.content =
        "SensorModelID: " + sensorModel.id + "\n" +
        "Version  : " + sensorModel.version;
      this.deleteModal.sensorModel = sensorModel;
      this.$root.$emit("bv::show::modal", this.deleteModal.id, button)
    },
    async confirmDelete(): Promise<void> {
      console.log('confirmDelete');
      let sensorModel: SensorModel = this.deleteModal.sensorModel;

      const res = await (this as any).$axios({
        method: "delete",
        url: "/sensorModels/" + sensorModel.id +".json"
      })

      this.sensorModels = this.sensorModels.filter((item: SensorModel) => item.id != sensorModel.id)
    },

    formatDate (dateInput: string) {
      let date = new Date(dateInput)
      return date.toISOString().substring(0, 10)
    },
    getTypenameBySensorTypeId (sensorTypeId: string): String {
      let sensorType: SensorType = this.sensorTypeList.filter((item: SensorType) => item.id == sensorTypeId)[0]
      if( sensorType )
        return sensorType.typeName
      return ''
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

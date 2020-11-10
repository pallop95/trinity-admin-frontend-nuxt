<template>
<!-- id/business_unit/created_at/updated_at/edit/delete -->
  <div>
    <b-container class="businessUnit-row">
      <b-row>
        <b-col md="2" offset-md="10">
          <AddButton @clickedAdd="handleClickAdd" />
        </b-col>
      </b-row>
 
      <b-row align-v="center" class="businessUnit-table">
        <b-col md="12">
          <div class="content">
            <b-table :items="businessUnits" :fields="fields">

              <template #cell(created_at)="data">
                <b class="text-success"> {{ formatDate(data.value) }} </b>
              </template>

              <template #cell(updated_at)="data">
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

    <BusinessUnitModal @submit="onSubmitted" />

    <b-modal
      :id="deleteModal.id"
      title="Delete BusinessUnit?"
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
import { BusinessUnit } from '@/interfaces/businessUnit.interface'

export default Vue.extend({
  data() {
    return {
      // isModalVisible: false,
      addModalId: 'add-modal',
      deleteModal: {
        id: 'delete-modal',
        content: '',
        businessUnit: {} as BusinessUnit,
      },
      fields: [
        {
          key: "id",
          label: "BusinessUnitID",
          sortable: true,
        },
        {
          key: "business_unit",
          label: "Business Unit",
          sortable: true,
        },
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
          label: "Edit"
        },
        {
          key: "delete",
          label: "Delete"
        }
      ],
      businessUnit: {} as BusinessUnit,
      blankBusinessUnit: {
        id: '',
        business_unit: '',
        created_at: new Date(),
        updated_at: new Date()
      } as BusinessUnit,

      businessUnits: [] as any[]
    }
  },
  async mounted(): Promise<void> {
    await this.getBusinessUnits()
  },
  methods: {
    async onSubmitted(editedBusinessUnit: BusinessUnit): Promise<void> {
      console.log(editedBusinessUnit)
      this.businessUnit = editedBusinessUnit
      
      if(this.businessUnit.id === '') {
        await this.postBusinessUnit()
      } else {
        await this.updateBusinessUnit(this.businessUnit)
      }
    },
    // showModal() {
    //   this.isModalVisible = true;
    // },
    // closeModal() {
    //   this.isModalVisible = false;
    // },
    async postBusinessUnit (): Promise<void> {
      let createBusinessUnit = {
          ...this.businessUnit,
          created_at: new Date(),
          updated_at: new Date()
      }

      const res = await (this as any).$axios.post(
        "/businessUnits.json", createBusinessUnit
      )
      console.log('postBusinessUnit', res)
      if (res.status === 200) {
        createBusinessUnit = {
          ...createBusinessUnit,
          id: res.data.name
        }
        console.log(createBusinessUnit)
        this.businessUnits.push(createBusinessUnit)
      }
    },
    async updateBusinessUnit (businessUnit: BusinessUnit): Promise<void> {
      let businessUnits = this.businessUnits

      businessUnit.updated_at = new Date()

      const res = await (this as any).$axios({
        method: "put",
        url: "/businessUnits/" + businessUnit.id +".json",
        data: businessUnit
      })

      if (res.status == 200) {
        let index = businessUnits.findIndex((item: BusinessUnit) => item.id === businessUnit.id)

        businessUnits.splice(index, 1, businessUnit)
      }

      this.businessUnits = businessUnits
    },

    async getBusinessUnits (): Promise<void> {
      const res = await (this as any).$axios.get("/businessUnits.json")

      for (const key in res.data) {
          this.businessUnits.push({ ...res.data[key], id: key });
      }
    },
    async handleClickAdd (): Promise<void> {
      console.log('handleClickAdd')
      this.businessUnit = this.blankBusinessUnit

      await (this as any).$store.dispatch('businessUnits/setBusinessUnitAction', this.businessUnit)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },
    async handleClickEdit (businessUnit: BusinessUnit, button: any): Promise<void> {
      this.businessUnit = businessUnit
      await (this as any).$store.dispatch('businessUnits/setBusinessUnitAction', this.businessUnit)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },

    handleClickDelete (businessUnit: BusinessUnit, button: any) {
      this.deleteModal.content =
        "BusinessUnitID: " + businessUnit.id + "\n" +
        "Business Unit : " + businessUnit.business_unit + "\n"
        // "Address     : " + businessUnit.sensorModel + "\n" +
      this.deleteModal.businessUnit = businessUnit
      this.$root.$emit("bv::show::modal", this.deleteModal.id, button)
    },
    async confirmDelete(): Promise<void> {
      console.log('confirmDelete');
      let businessUnit: BusinessUnit = this.deleteModal.businessUnit;

      const res = await (this as any).$axios({
        method: "delete",
        url: "/businessUnits/" + businessUnit.id +".json"
      })

      this.businessUnits = this.businessUnits.filter((item: BusinessUnit) => item.id != businessUnit.id)
    },

    formatDate(dateInput: string) {
      let date = new Date(dateInput)
      return date.toISOString().substring(0, 10)
    }
  }
})
</script>

<style>
.businessUnit-row {
  margin-top: 30px;
}

.businessUnit-table {
  margin-top: 30px;
}
</style>

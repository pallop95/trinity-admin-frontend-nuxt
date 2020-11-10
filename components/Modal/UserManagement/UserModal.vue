<template>
  <div>
<!-- @hidden="resetModalAdd" -->
    <b-modal
      id="add-modal"
      ref="modal"
      title="Insert Sensor Model"
      @show="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit.stop.prevent="handleSubmitAdd">
        <!-- address/model/value/sensor-type-id/created_at/edit/delete -->
        <b-form-group
          :state="usernameState"
          label="Username"
          label-for="Username-input"
          invalid-feedback="Username is required"
        >
          <b-form-input
            id="username-input"
            v-model="editedUser.username"
            :state="usernameState"
            autocomplete="off"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :state="staffIdState"
          label="StaffID"
          label-for="StaffId-input"
          invalid-feedback="StaffID is required"
        >
          <b-form-input
            id="staffId-input"
            v-model="editedUser.staff_id"
            :state="staffIdState"
            autocomplete="off"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="businessUnit-group-input" label="Business Unit:" label-for="businessUnitId-input">
          <b-form-select
            id="businessUnit-input"
            v-model="editedUser.business_unit_id"
            :options="businessUnitDropdownList"
          ></b-form-select>
        </b-form-group>

        <b-form-group id="role-group-input" label="Role:" label-for="roleId-input">
          <b-form-select
            id="role-input"
            v-model="editedUser.role_id"
            :options="roleDropdownList"
          ></b-form-select>
        </b-form-group>
        
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { User } from '@/interfaces/user.interface'
import { Dropdown } from "~/interfaces/dropdown.interface"

export default Vue.extend({
  data() {
    return {
      uneditableUser: {} as User,

      editedUser: {
        id: '',
        username: '',
        staff_id: '',
        business_unit_id: '',
        role_id: '',
        created_at: new Date(),
        updated_at: new Date()
      } as User,

      usernameState: null as boolean | null,
      staffIdState: null as boolean | null,
      businessUnitIdState: null as boolean | null,
      roleIdState: null as boolean | null,

      roleDropdownList: [] as Dropdown[],
      businessUnitDropdownList: [] as Dropdown[]
    }
  },
  async mounted(): Promise<void> {
    await this.getBusinessUnitList()

    await this.getRoleList()
  },
  methods: {
    async getBusinessUnitList() {
      const res = await (this as any).$axios.get("/businessUnits.json")

      this.businessUnitDropdownList.push({ text: 'Select One (Optional)', value: null })
      for (const key in res.data) {
          this.businessUnitDropdownList.push({
            text: 'ID: ' + key + ', Business_unit: ' +res.data[key].business_unit,
            value: key
          })
      }
    },
    async getRoleList() {
      console.log('getRoleList')
      const res = await (this as any).$axios.get("/roles.json")

      this.roleDropdownList.push({ text: 'Select One (Optional)', value: null })
      for (const key in res.data) {
          this.roleDropdownList.push({
            text: 'ID: ' + key + ', Role: ' +res.data[key].role,
            value: key
          })
      }
    },
    checkFormValidity() {
      const valid = (this.$refs.form as Vue & { checkValidity: () => boolean }).checkValidity()

      this.usernameState = (this.editedUser.username.length == 0) ? false: true

      this.staffIdState = (this.editedUser.staff_id.length == 0) ? false: true

      // this.sensorTypeIdState = (this.editedUser.sensorTypeId.length == 0) ? false: true

      return valid
    },
    async resetModalAdd() {
        console.log('resetModalAdd')
        this.usernameState = null
        this.staffIdState = null
        this.roleIdState = null
        this.businessUnitIdState = null

        this.uneditableUser = await this.$store.getters['users/getUser']

        this.editedUser = {
          id: '',
          username: '',
          staff_id: '',
          business_unit_id: '',
          role_id: '',
          created_at: new Date(),
          updated_at: new Date()
        }

        this.editedUser.id = this.uneditableUser.id
        this.editedUser.username = this.uneditableUser.username
        this.editedUser.staff_id = this.uneditableUser.staff_id
        this.editedUser.business_unit_id = this.uneditableUser.business_unit_id
        this.editedUser.role_id = this.uneditableUser.role_id
        this.editedUser.created_at = this.uneditableUser.created_at
        this.editedUser.updated_at = this.uneditableUser.updated_at
    },
    handleOkAdd(bvModalEvt: any) {
      bvModalEvt.preventDefault()

      this.handleSubmitAdd()
    },
    async handleSubmitAdd() {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$emit('submit', this.editedUser)

      this.$nextTick(() => {
        (this as any).$bvModal.hide('add-modal')
      })
    }
  }
})
</script>

<style>
.user-row {
  margin-top: 30px;
}

.user-table {
  margin-top: 30px;
}
</style>

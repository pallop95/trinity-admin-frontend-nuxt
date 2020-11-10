<template>
  <div>
    <b-container class="user-row">
      <b-row>
        <b-col md="2" offset-md="10">
          <AddButton @clickedAdd="handleClickAdd" />
        </b-col>
      </b-row>

      <b-row align-v="center" class="user-table">
        <b-col md="12">
          <div class="content">
            <b-table :items="users" :fields="fields">

              <template #cell(business_unit_id)="data">
                <b> {{ getBusinessUnit(data.value) }} </b>
              </template>

              <template #cell(role_id)="data">
                <b> {{ getRole(data.value) }} </b>
              </template>

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

    <UserModal @submit="onSubmitted" />

    <b-modal
      :id="deleteModal.id"
      title="Delete User?"
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
import { User } from '@/interfaces/user.interface'
import { Dropdown } from '@/interfaces/dropdown.interface'
import { Role } from "~/interfaces/role.interface"
import { BusinessUnit } from "~/interfaces/businessUnit.interface"

export default Vue.extend({
  data() {
    return {
      // isModalVisible: false,
      addModalId: 'add-modal',
      deleteModal: {
        id: 'delete-modal',
        content: '',
        user: {} as User
      },
      fields: [
        {
          key: "id",
          label: "UserID",
          sortable: true
        },
        {
          key: "username",
          label: "Username",
          sortable: true
        },
        {
          key: "staff_id",
          label: "StaffID",
          sortable: true
        },
        {
          key: "business_unit_id",
          label: "BusinessUnitID",
          sortable: true
        },
        {
          key: "role_id",
          label: "RoleID",
          sortable: true
        },
        {
          key: "created_at",
          label: "Created At",
          sortable: true
        },
        {
          key: "updated_at",
          label: "Updated At",
          sortable: true
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
      user: {} as User,
      blankUser: {
        id: '',
        username: '',
        staff_id: '',
        business_unit_id: '',
        role_id: '',
        created_at: new Date(),
        updated_at: new Date()
      } as User,
      users: [] as any[],
      roleList: [] as Role[],
      businessUnitList: [] as BusinessUnit[]
    }
  },
  async mounted(): Promise<void> {
    await this.getUsers()

    this.roleList = await this.getRoleList();
    this.businessUnitList = await this.getBusinessUnitList();
  },
  methods: {
    async getRoleList() {
      await (this as any).$store.dispatch('roles/setRoleListAction')

      return await this.$store.getters['roles/getRoleList']
    },
    async getBusinessUnitList () {
      await (this as any).$store.dispatch('businessUnits/setBusinessUnitListAction')

      return await this.$store.getters['businessUnits/getBusinessUnitList']
    },
    async onSubmitted (editedUser: User): Promise<void> {
      if(editedUser.id == '') {
        await this.postUser(editedUser)
      } else {
        await this.updateUser(editedUser)
      }
    },
    async postUser (editedUser: User): Promise<void> {
      let createUser = {
          ...editedUser,
          created_at: new Date()
      }

      const res = await (this as any).$axios.post(
        "/users.json", createUser
      )
      if (res.status === 200) {
        createUser = {
          ...createUser,
          id: res.data.name
        }
        this.users.push(createUser)
      }
    },
    async updateUser (editedUser: User): Promise<void> {
      let users = this.users

      editedUser.created_at = new Date()

      const res = await (this as any).$axios({
        method: "put",
        url: "/users/" + editedUser.id +".json",
        data: editedUser
      })

      if (res.status == 200) {
        let index = users.findIndex((item: User) => item.id === editedUser.id)
        users.splice(index, 1, editedUser)
      }

      this.users = users
    },
    async getUsers (): Promise<void> {
      const res = await (this as any).$axios.get("/users.json")

      for (const key in res.data) {
          this.users.push({ ...res.data[key], id: key });
      }
    },
    async handleClickAdd (): Promise<void> {
      console.log('handleClickAdd')
      this.user = this.blankUser
      
      await (this as any).$store.dispatch('users/setUserAction', this.user)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },
    async handleClickEdit (user: User, button: any): Promise<void> {
      console.log('handleClickEdit')
      this.user = user
      await (this as any).$store.dispatch('users/setUserAction', this.user)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },

    handleClickDelete (user: User, button: any) {
      this.deleteModal.content =
        "UserID   : " + user.id + "\n" +
        "Username : " + user.username
      this.deleteModal.user = user;
      this.$root.$emit("bv::show::modal", this.deleteModal.id, button)
    },
    async confirmDelete (): Promise<void> {
      let user: User = this.deleteModal.user

      const res = await (this as any).$axios({
        method: "delete",
        url: "/users/" + user.id +".json"
      })

      this.users = this.users.filter((item: User) => item.id != user.id)
    },
    getRole (roleId: string) {
      // let role: Role = this.roleList.filter((item: Role) => item.id == roleId)[0]
      // if( role )
      //   return role.role
      // return ''
      let index = this.roleList.findIndex((item: Role) => item.id == roleId)
      if (index >= 0) {
        return this.roleList[index].role
      }
      return ''
    },
    getBusinessUnit (businessUnitId: string) {
      // let businessUnit: BusinessUnit = this.businessUnitList.filter((item: BusinessUnit) => item.id == businessUnitId)[0]
      // if( businessUnit )
      //   return businessUnit.business_unit
      // return ''
      let index = this.businessUnitList.findIndex((item: BusinessUnit) => item.id == businessUnitId)
      if (index >= 0) {
        return this.businessUnitList[index].business_unit
      }
      return ''
    },
    formatDate (dateInput: string) {
      let date = new Date(dateInput)
      return date.toISOString().substring(0, 10)
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

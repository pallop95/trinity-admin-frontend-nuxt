<template>
<!-- id/business_unit/created_at/updated_at/edit/delete -->
  <div>
    <b-container class="role-row">
      <b-row>
        <b-col md="2" offset-md="10">
          <AddButton @clickedAdd="handleClickAdd" />
        </b-col>
      </b-row>
 
      <b-row align-v="center" class="role-table">
        <b-col md="12">
          <div class="content">
            <b-table responsive :items="roles" :fields="fields">

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

    <RoleModal @submit="onSubmitted" />

    <b-modal
      :id="deleteModal.id"
      title="Delete Role?"
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
import { Role } from '@/interfaces/role.interface'

export default Vue.extend({
  data() {
    return {
      // isModalVisible: false,
      addModalId: 'add-modal',
      deleteModal: {
        id: 'delete-modal',
        content: '',
        role: {} as Role,
      },
      fields: [
        {
          key: "id",
          label: "RoleID",
          sortable: true,
        },
        {
          key: "role",
          label: "Role",
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
      role: {} as Role,
      blankRole: {
        id: '',
        role: '',
        created_at: new Date(),
        updated_at: new Date()
      } as Role,

      roles: [] as any[]
    }
  },
  async mounted(): Promise<void> {
    await this.getRoles()
  },
  methods: {
    async onSubmitted(editedRole: Role): Promise<void> {
      console.log(editedRole)
      // this.role = editedRole

      this.role.id = editedRole.id
      this.role.role = editedRole.role
      this.role.created_at = editedRole.created_at
      this.role.updated_at = editedRole.updated_at
      
      if(this.role.id === '') {
        await this.postRole()
      } else {
        await this.updateRole()
      }
    },
    // showModal() {
    //   this.isModalVisible = true;
    // },
    // closeModal() {
    //   this.isModalVisible = false;
    // },
    async postRole (): Promise<void> {
      let role = this.role
      let createRole = {
          ...role,
          created_at: new Date(),
          updated_at: new Date()
      }

      const res = await (this as any).$axios.post(
        "/roles.json", createRole
      )
      console.log('postRole', res)
      if (res.status === 200) {
        createRole = {
          ...createRole,
          id: res.data.name
        }
        console.log(createRole)
        this.roles.push(createRole)
      }
    },
    async updateRole (): Promise<void> {
      let role = this.role
      let roles = this.roles

      role.updated_at = new Date()

      const res = await (this as any).$axios({
        method: "put",
        url: "/roles/" + role.id +".json",
        data: role
      })

      if (res.status == 200) {
        let index = roles.findIndex((item: Role) => item.id === role.id)

        roles.splice(index, 1, role)
      }

      this.roles = roles
    },

    async getRoles (): Promise<void> {
      const res = await (this as any).$axios.get("/roles.json")

      for (const key in res.data) {
          this.roles.push({ ...res.data[key], id: key });
      }
    },
    async handleClickAdd (): Promise<void> {
      console.log('handleClickAdd')
      this.role = this.blankRole

      await (this as any).$store.dispatch('roles/setRoleAction', this.role)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },
    async handleClickEdit (role: Role, button: any): Promise<void> {
      this.role = role
      await (this as any).$store.dispatch('roles/setRoleAction', this.role)

      this.$root.$emit("bv::show::modal", this.addModalId)
    },

    handleClickDelete (role: Role) {
      this.deleteModal.content =
        "RoleID: " + role.id + "\n" +
        "Business Unit : " + role.role + "\n"
        // "Address     : " + role.sensorModel + "\n" +
      this.deleteModal.role = role
      this.$root.$emit("bv::show::modal", this.deleteModal.id)
    },
    async confirmDelete(): Promise<void> {
      console.log('confirmDelete');
      let role: Role = this.deleteModal.role;

      const res = await (this as any).$axios({
        method: "delete",
        url: "/roles/" + role.id +".json"
      })

      this.roles = this.roles.filter((item: Role) => item.id != role.id)
    },

    formatDate(dateInput: string) {
      let date = new Date(dateInput)
      return date.toISOString().substring(0, 10)
    }
  }
})
</script>

<style>
.role-row {
  margin-top: 30px;
}

.role-table {
  margin-top: 30px;
}
</style>

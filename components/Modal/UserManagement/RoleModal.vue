<template>
  <div>
    <b-modal
      id="add-modal"
      ref="modal"
      title="Insert Role"
      @show="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit.stop.prevent="handleSubmitAdd">

        <b-form-group
          :state="roleState"
          label="Role"
          label-for="role-input"
          invalid-feedback="Role is required"
        >
          <b-form-input
            id="role-input"
            v-model="editedRole.role"
            :state="roleState"
            autocomplete="off"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Role } from '@/interfaces/role.interface'

export default Vue.extend({
  data() {
    return {
      uneditableRole: {} as Role,
      editedRole: {
          id: '',
          role: '',
          created_at: new Date(),
          updated_at: new Date()
      } as Role,
      roleState: null as boolean | null
    }
  },
  methods: {
    checkFormValidity() {
      const valid = (this.$refs.form as Vue & { checkValidity: () => boolean }).checkValidity()
      this.roleState = (this.editedRole.role.length == 0) ? false: true
      return valid
    },
    async resetModalAdd() {
        console.log('resetModalAdd')
        this.roleState = null
        this.uneditableRole = await this.$store.getters['roles/getRole']
        this.editedRole.id = this.uneditableRole.id
        this.editedRole.role = this.uneditableRole.role
        this.editedRole.created_at = this.uneditableRole.created_at
        this.editedRole.updated_at = this.uneditableRole.updated_at
    },
    handleOkAdd(bvModalEvt: any) {
      bvModalEvt.preventDefault()

      this.handleSubmitAdd()
    },
    async handleSubmitAdd() {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$emit('submit', this.editedRole)

      this.$nextTick(() => {
        (this as any).$bvModal.hide('add-modal')
      })
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

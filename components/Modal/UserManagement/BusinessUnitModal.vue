<template>
  <div>
    <b-modal
      id="add-modal"
      ref="modal"
      title="Insert Business Unit"
      @show="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit.stop.prevent="handleSubmitAdd">

        <b-form-group
          :state="businessUnitState"
          label="Business Unit"
          label-for="businessUnit-input"
          invalid-feedback="Business Unit is required"
        >
          <b-form-input
            id="businessUnit-input"
            v-model="editedBusinessUnit.business_unit"
            :state="businessUnitState"
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
import { BusinessUnit } from '@/interfaces/businessUnit.interface'

export default Vue.extend({
  data() {
    return {
      uneditableBusinessUnit: {} as BusinessUnit,
      editedBusinessUnit: {
          id: '',
          business_unit: '',
          created_at: new Date(),
          updated_at: new Date()
      } as BusinessUnit,
      businessUnitState: null as boolean | null
    }
  },
  methods: {
    checkFormValidity() {
      const valid = (this.$refs.form as Vue & { checkValidity: () => boolean }).checkValidity()
      this.businessUnitState = (this.editedBusinessUnit.business_unit.length == 0) ? false: true
      return valid
    },
    async resetModalAdd() {
        console.log('resetModalAdd')
        this.businessUnitState = null
        this.uneditableBusinessUnit = await this.$store.getters['businessUnits/getBusinessUnit']
        this.editedBusinessUnit.id = this.uneditableBusinessUnit.id
        this.editedBusinessUnit.business_unit = this.uneditableBusinessUnit.business_unit
        this.editedBusinessUnit.created_at = this.uneditableBusinessUnit.created_at
        this.editedBusinessUnit.updated_at = this.uneditableBusinessUnit.updated_at
    },
    handleOkAdd(bvModalEvt: any) {
      bvModalEvt.preventDefault()

      this.handleSubmitAdd()
    },
    async handleSubmitAdd() {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$emit('submit', this.editedBusinessUnit)

      this.$nextTick(() => {
        (this as any).$bvModal.hide('add-modal')
      })
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

<template>
  <div>
      <b-button title="Save file" @click="handleClickAdd">
        <!-- v-b-modal.add-modal -->
        <b-icon icon="cloud-upload" aria-hidden="true" />
      </b-button>
  </div>
</template>

<script>
export default {
    methods: {
        handleClickAdd () {
            this.$emit('clickedAdd')
        }
    }
}
</script>
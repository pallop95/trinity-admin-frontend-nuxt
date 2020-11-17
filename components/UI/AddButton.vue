<template>
  <div>
      <b-button
        title="Add row"
        variant="success"
        @click="handleClickAdd"
      >
        <b-icon
          icon="plus-circle"
          aria-hidden="true"
        />
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

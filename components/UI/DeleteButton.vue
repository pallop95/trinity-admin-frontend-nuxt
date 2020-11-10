<template>
  <!-- <b-button
    size="sm"
    @click="handleClickDelete(row.item, $event.target)"
    class="mr-1"
    variant="danger"
  >
    Delete
  </b-button> -->
  <b-button 
    title="Delete row"
    @click="handleClickDeleteButton"
    class="bg-danger"
  >
    <b-icon
      icon="trash-fill"
      variant="light"
      aria-hidden="true"
    />
  </b-button>
</template>

<script>
export default {
  methods: {
    handleClickDeleteButton() {
      this.$emit("clickedDelete");
    }
  }
}
</script>
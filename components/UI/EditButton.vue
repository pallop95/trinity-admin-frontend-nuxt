<template>
    <!-- <b-button
        size="sm"
        @click="handleClickEdit(row.item, $event.target)"
        class="mr-1"
        variant="info"
    >
        Edit
    </b-button> -->
  <b-button
    title="Edit row"
    @click="handleClickEditButton"
    variant="warning"
  >
    <b-icon
        icon="tools"
        variant="light"
        aria-hidden="true"
    />
  </b-button>
</template>

<script>
export default {
  methods: {
    handleClickEditButton() {
      this.$emit("clickedEdit");
    }
  }
}
</script>
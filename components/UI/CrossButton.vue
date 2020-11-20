<template>
  <!-- <b-button 
    title="Delete row"
    @click="handleClickDeleteButton"
    class="bg-danger"
  >
    <b-icon
      icon="x-square"
      variant="red"
      aria-hidden="true"
    />
  </b-button> -->
  <b-icon
    title="Delete row"
    @click="handleClickDeleteButton"
    class="bg-danger"
    icon="x-square"
    variant="red"
    aria-hidden="true"
  />
</template>

<script>
export default {
  methods: {
    handleClickDeleteButton() {
      this.$emit("clickedCross");
    }
  }
}
</script>
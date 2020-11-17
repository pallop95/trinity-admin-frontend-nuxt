<template>
  <div>
    <!-- <Form1 /> -->
    <!-- <VuelidateForm /> -->
    <!-- <FirmwareForm /> -->
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      items: [
        {
          age: 40,
          first_name: "Dickerson",
          last_name: "Macdonald",
          waw: "Macdonald",
          aza: "Maasdsasdacadssaddddddddonald",
          wow: "Maasdsasdacdonald",
          wqw: "Macdonald",
        },
        {
          age: 21,
          first_name: "Larsen",
          last_name: "Shaw",
          waw: "Macdonald",
          aza: "Maasdsasdaasdddddddddddddddddddcdonald",
          wow: "Macdadssadsaonald",
          wqw: "Macdonald",
        },
        {
          age: 89,
          first_name: "Geneva",
          last_name: "Wilson",
          waw: "Macdonald",
          aza: "Maasdsasdacdadsssonald",
          wow: "Macdasdsasdasadsdsaonald",
          wqw: "Macdonald",
        },
        {
          age: 38,
          first_name: "Jami",
          last_name: "Carney",
          waw: "Macdonald",
          aza: "Maasdsasdasdaaaacdonald",
          wow: "Macdasdsaddsasadonald",
          wqw: "Macdonald",
        },
      ],
    };
  },
});
</script>
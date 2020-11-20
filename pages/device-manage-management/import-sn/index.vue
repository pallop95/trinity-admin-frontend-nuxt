<template>
  <div>
    <div class="about-page">
      <h2>
        Device Management > Import S/N
      </h2>
      <UploadFilesGetJson input-label="Import S/N" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import UploadFiles from '@/components/UploadFiles'

export default Vue.extend({
//   name: 'App',
//   components: {
//     UploadFiles
//   }
})
</script>

<style>
.about-page {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .about-page {
    width: 600px;
  }
}

.about-page {
    /* text-align: left; */
    padding: 30px;
}

.about-page > h2 {
  margin-bottom: 50px;
}
</style>

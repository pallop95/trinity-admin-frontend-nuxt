<template>
  <div class="upload-form">
    <div v-if="currentFile" class="progress">
      <div
        class="progress-bar progress-bar-info progress-bar-striped"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="{ width: progress + '%' }"
      >
        {{ progress }}%
      </div>
    </div>

    <label class="btn btn-default">
      {{ inputLabel }} <input ref="file" type="file" @change="selectFile">
    </label>
    <!-- <b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Import S/N" label-for="input-sm">
      <b-form-file
        id="input-sm"
        ref="file"
        size="sm"
        type="file"
        @change="selectFile"
      />
    </b-form-group> -->

    <b-row>
      <b-col md="4" offset-md="4">
        <button class="btn btn-success" :disabled="!selectedFiles" @click="upload">
          Upload
        </button>

        <b-button type="reset" variant="outline-primary" @click="clearSelectedFile">
          Cancel
        </b-button>
      </b-col>
    </b-row>

    <div class="alert alert-light" role="alert">
      {{ message }}
    </div>

    <div class="card">
      <div class="card-header">
        List of Files
      </div>
      <ul class="list-group list-group-flush">
        <li
          v-for="(file, index) in fileInfos"
          :key="index"
          class="list-group-item"
        >
          <a :href="file.url">{{ file.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import UploadService from '../services/UploadFilesService'

export default Vue.extend({
  name: 'UploadFiles',
  props: {
    inputLabel: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectedFiles: undefined as any,
      currentFile: undefined,
      progress: 0,
      message: '',

      fileInfos: []
    }
  },
  computed: {
    file_ref (): Vue & { file: () => boolean } {
      return this.$refs.file as Vue & { file: () => boolean }
    }
  },
  async mounted () {
    const response = await UploadService.getFiles()

    this.fileInfos = response.data
  },
  methods: {
    selectFile () {
      this.selectedFiles = (this.$refs.file as Vue & { files: () => boolean }).files
    },
    clearSelectedFile () {
      (this.$refs.file as Vue & { reset: () => boolean }).reset()
    },
    async upload () {
      this.progress = 0

      try {
        this.currentFile = this.selectedFiles.item(0)
        const response = await UploadService.upload(this.currentFile, (event: any) => {
          this.progress = Math.round((100 * event.loaded) / event.total)
        })

        this.message = response.data.message

        const files = await UploadService.getFiles()

        this.fileInfos = files.data
      } catch (error) {
        this.progress = 0
        this.message = 'Could not upload the file!'
        this.currentFile = undefined
      }

      this.selectedFiles = undefined
    }
  }
})
</script>

<style>
/* .upload-form {
  width: 90%;
  margin: 50px auto;
}

@media (min-width: 768px) {
  .upload-form {
    width: 500px;
  }
} */
</style>

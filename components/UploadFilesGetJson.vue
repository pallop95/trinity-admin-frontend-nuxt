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
      <!-- {{ inputLabel }} <input ref="file" type="file" @change="selectFile"> -->
      {{ inputLabel }} <input type="file" ref="inputFile" @change="onChange" />
    </label>

    <b-row>
      <b-col md="4" offset-md="4">
        <!-- <button class="btn btn-success" :disabled="!selectedFiles" @click="upload">
          Upload
        </button>

        <b-button type="reset" variant="outline-primary" @click="clearSelectedFile">
          Cancel
        </b-button> -->
        <button class="btn btn-success" :disabled="!collection" @click="upload">
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

    <xlsx-read :file="file">
      <template #default="{loading}">
        <span v-if="loading">Loading...</span>
        <xlsx-sheets>
          <template #default="{sheets}">
            <select v-model="selectedSheet">
              <option v-for="(sheet, index) in sheets" :key="sheet" :value="sheet" v-bind:selected="index === 0">
                  <!-- v-bind:selected="index === 0" -->
                {{ sheet }}
              </option>
            </select>
          </template>
        </xlsx-sheets>
        <!-- <xlsx-table :sheet="selectedSheet" /> -->
        <xlsx-json :sheet="selectedSheet" @parsed="onParsed">
          <template #default="{collection}">
            <div>
              {{ collection }}
            </div>
          </template>
        </xlsx-json>
      </template>
    </xlsx-read>

    <button @click="showCollection">Show Collection</button>

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
      fileInfos: [],

      file: null,
      selectedSheet: null,
      // sheetName: null,
      collection: undefined
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
    /*clearSelectedFile () {
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
    },*/

    onChange(event: any) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    onParsed(col: any) {
        // console.log('before col', col)
        console.log('col', col)
        this.collection = col
    },
    showCollection() {
        console.log('collection', this.collection)
        console.log('selectedSheet', this.selectedSheet)
    },
    clearSelectedFile () {
      this.file = null
      this.collection = undefined,
      // this.$refs.inputFile.reset();
      // this.$refs.inputFile.value = null
      (this.$refs.inputFile as any & { value: () => boolean } ).value = null
    },
    async upload () {
      console.log('collection', this.collection)
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

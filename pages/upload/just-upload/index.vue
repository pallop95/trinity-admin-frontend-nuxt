<template>
  <div class="VueXlsx">
    <section>
      <h3>Import XLSX</h3>

      <input type="file" @change="onChange" />

      <xlsx-read :file="file">
        <template #default="{loading}">
          <span v-if="loading">Loading...</span>
          <xlsx-sheets>
            <template #default="{sheets}">
              <select v-model="selectedSheet">
                <option v-for="sheet in sheets" :key="sheet" :value="sheet">
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
    </section>

    <button @click="showCollection">Show Collection</button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      file: null,
      selectedSheet: null,
      sheetName: null,
      collection: [{ a: 1, b: 2 }]
    };
  },
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    onParsed(col) {
        // console.log('before col', col)
        console.log('col', col)
        this.collection = col
    },
    showCollection() {
        console.log('collection', this.collection)
    }
  }
};
</script>

<style></style>

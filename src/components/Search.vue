<template>
  <div class="bg-slate-200 rounded-lg shadow-lg p-2 md:flex md:flex-row gap-2 grid relative">
    <input v-model=" title " @input=" $emit( 'update:title', $event.target.value ) " type="text"
      placeholder="Pencarian Berdasarkan Judul" class="input input-info w-full" />

    <label for="advanced search" class="btn btn-warning">Advanced search</label>

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="advanced search" class="modal-toggle" />
    <div class="modal ">
      <div class="modal-box w-11/12 max-w-5xl overflow-visible">
        <h3 class="font-bold text-lg">Advanced Search</h3>

        <p class="py-4">Judul</p>
        <input v-model=" title " type="text" class="input input-info w-full" />

        <p class="py-4">Teknologi yang digunakan</p>
        <VueMultiselect v-model=" tech " :options=" techList " :multiple=" true " :taggable=" true " @tag=" addTechList "
          tag-placeholder="Tambahkan" placeholder="Cari atau tambahkan" />

        <p class="py-4">Jenis Penelitian</p>
        <VueMultiselect v-model=" categories " :options=" categoryList " :taggable=" true " @tag=" addCategoryList "
          tag-placeholder="Tambahkan" placeholder="Cari atau tambahkan" />

        <p class="py-4">Metode yang digunakan</p>
        <VueMultiselect v-model=" method " :options=" methodList " :multiple=" true " :taggable=" true "
          @tag=" addMethodList " tag-placeholder="Tambahkan" placeholder="Cari atau tambahkan" />

        <div class="modal-action">
          <label for="advanced search" class="btn btn-error">Cancel</label>
          <label for="advanced search" @click=" submit " class="btn btn-info">Search</label>
        </div>
      </div>
    </div>

    <button @click=" submit " class="btn btn-info">Search</button>
  </div>
</template>

<script>
import VueMultiselect from 'vue-multiselect'

export default {
  data () {
    return {
      title: undefined,
      tech: [],
      categories: null,
      method: [],
      techList: [ 'php', 'mysql', 'laravel' ],
      categoryList: [ 'egov', 'karya cipta' ],
      methodList: [ 'fuzzy', 'lainnya' ],
    }
  },
  components: {
    VueMultiselect
  },
  methods: {
    submit () {
      this.$emit( 'submit', {
        title: this.title,
        tech: this.tech,
        categories: this.categories,
        method: this.method
      } )
    },
    addTechList ( newTag ) {
      this.techList.push( newTag )
      this.tech.push( newTag )
    },
    addCategoryList ( newTag ) {
      this.categoryList.push( newTag )
      this.categories = newTag 
    },
    addMethodList ( newTag ) {
      this.methodList.push( newTag )
      this.method.push( newTag )
    },

  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css">

</style>

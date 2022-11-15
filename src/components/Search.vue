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
        <VueMultiselect v-model=" tech " :options=" techList " :multiple=" true " :searchable=" true "
          @search-change=" findTechList " placeholder="Cari Teknologi yang terdaftar" label="name" track-by="name" />

        <p class="py-4">Jenis Penelitian</p>
        <VueMultiselect v-model=" researchFields " :options=" researchFieldList " :multiple=" true " :searchable=" true "
          @search-change=" findResearchField " placeholder="Cari Bidang Penelitian yang terdaftar" label="name"
          track-by="name" />

        <p class="py-4">Metode yang digunakan</p>
        <VueMultiselect v-model=" methods " :options=" methodList " :multiple=" true " :searchable=" true "
          @search-change=" findMethod " placeholder="Cari Metode Penelitian yang terdaftar" label="name"
          track-by="name" />

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
import axios from 'axios'
import { projectService } from '../constant/endpoint'

export default {
  data () {
    return {
      title: undefined,
      tech: [],
      researchFields: [],
      methods: [],
      techList: [],
      researchFieldList: [],
      methodList: [],
    }
  },
  components: {
    VueMultiselect
  },
  mounted () {
    this.findMethod()
    this.findResearchField()
    this.findTechList()
  },
  methods: {
    submit () {
      const tech = []
      for ( const key of this.tech ) {
        tech.push( key.name )
      }
      const researchFields = []
      for ( const key of this.researchFields ) {
        researchFields.push( key.name )
      }
      const methods = []
      for ( const key of this.methods ) {
        methods.push( key.name )
      }
      this.$emit( 'submit', {
        title: this.title,
        tech: tech,
        researchFields: researchFields,
        methods: methods
      } )
    },


    async findTechList ( search ) {
      await axios.get(
        projectService + 'find-tech-list',
        { params: { name: search } }
      )
        .then( ( response ) => {
          this.techList = response.data
        } )
        .catch( ( response ) => {
          this.techList[ 0 ] = response.error
        } )
    },
    async findResearchField ( search ) {
      await axios.get(
        projectService + 'find-research-field',
        { params: { name: search } }
      )
        .then( ( response ) => {
          this.researchFieldList = response.data
        } )
        .catch( ( response ) => {
          this.researchFieldList[ 0 ] = response.error
        } )
    },
    async findMethod ( search ) {
      await axios.get(
        projectService + 'find-research-method',
        { params: { name: search } }
      )
        .then( ( response ) => {
          this.methodList = response.data
        } )
        .catch( ( response ) => {
          this.methodList[ 0 ] = response.error
        } )
    },

  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css">

</style>

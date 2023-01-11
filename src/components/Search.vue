<template>
  <!-- <v-text-field v-model=" title " label="Pencarian Judul" class="-mb-5" density="compact" @input=" submit "></v-text-field> -->

  <v-text-field v-model=" title " v-on:keyup.enter=" submit " variant="outlined" label="Cari Judul"
    prepend-inner-icon="mdi-magnify" append-inner-icon="mdi-nut" single-line hide-details
    @click:append-inner=" dialog = !dialog ">
  </v-text-field>

  <v-dialog v-model=" dialog " persistent>
    <v-card>
      <v-card-title>
        <center class="text-h5">Advanced Search</center>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field v-model=" title " label="Judul Tugas Akhir"></v-text-field>

          <v-autocomplete label="Teknologi yang digunakan" v-model=" tech " v-model:search=" searchTech "
            @input=" findTechList " :items=" techList " item-title="name" placeholder="Start typing then enter search"
            prepend-icon="mdi-database-search" chips closable-chips return-object multiple hide-no-data hide-selected>
          </v-autocomplete>

          <v-autocomplete label="Jenis Penelitian" v-model=" researchField " v-model:search=" searchResearchField "
            @input=" findResearchField " :items=" researchFieldList " item-title="name"
            placeholder="Start typing then enter search" prepend-icon="mdi-tools" chips closable-chips return-object
            multiple hide-no-data hide-selected>
          </v-autocomplete>

          <v-autocomplete label="Metode yang digunakan" v-model=" method " v-model:search=" searchMethod "
            @input=" findMethod " :items=" methodList " item-title="name" placeholder="Start typing then enter search"
            prepend-icon="mdi-account-question" chips closable-chips return-object multiple hide-no-data hide-selected>
          </v-autocomplete>

        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click=" dialog = false ">
          Close
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click=" submit(); dialog = false ">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { API } from 'aws-amplify'

export default {
  data () {
    return {
      dialog: false,
      title: undefined,
      tech: [],
      researchField: [],
      method: [],
      searchTech: null,
      searchResearchField: null,
      searchMethod: null,
      techList: [],
      researchFieldList: [],
      methodList: [],
    }
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
      const researchField = []
      for ( const key of this.researchField ) {
        researchField.push( key.name )
      }
      const method = []
      for ( const key of this.method ) {
        method.push( key.name )
      }
      this.$emit( 'submit', {
        title: this.title,
        tech: tech,
        researchField: researchField,
        method: method
      } )
    },


    async findTechList () {
      await API
        .get( 'etapens', '/find-tech-list', {
          queryStringParameters: { name: this.searchTech }
        } )
        .then( result => {
          this.techList = result.data
        } )
        .catch( result => {
          this.techList[ 0 ] = result.error
        } )
    },
    async findResearchField () {
      await API
        .get( 'etapens', '/find-research-field', {
          queryStringParameters: { name: this.searchResearchField }
        } )
        .then( result => {
          this.researchFieldList = result.data
        } )
        .catch( result => {
          this.researchFieldList[ 0 ] = result.error
        } )
    },
    async findMethod () {
      await API
        .get( 'etapens', '/find-research-method', {
          queryStringParameters: { name: this.searchMethod }
        } )
        .then( result => {
          this.methodList = result.data
        } )
        .catch( result => {
          this.methodList[ 0 ] = result.error
        } )
    },

  }
}
</script>


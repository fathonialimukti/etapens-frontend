<template>
  <div class="grid md:grid-cols-9 gap-2">
    <v-select v-model=" itemPerPage " label="Item per Page" class="md:col-span-2" :items=" [ 12, 25, 50 ] "
      prepend-inner-icon="mdi-format-list-numbered" />
    <v-select v-model=" name " label="Status" class="md:col-span-2" :items=" [ 'All', 'Active', 'Inactive' ] "
      prepend-inner-icon="mdi-list-status" />
    <v-text-field v-model=" title " label="Title" class="md:col-span-5" @input=" getData "
      prepend-inner-icon="mdi-book-search-outline" />
  </div>

  <v-progress-linear v-if=" loading " indeterminate color="green"></v-progress-linear>
  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Student</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Database Name</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Type</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Creds</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Status</h1>
        </th>
      </tr>
    </thead>
    <p>{{error}}</p>
    <tbody>
      <tr v-for=" database  in data" :key=" database.id ">
        <td>{{ database.student.name }}</td>
        <td> {{ database.name }} </td>
        <td>
          <a v-if=" database.sourceCode " :href=" database.sourceCode " target="_blank">
            <v-btn color="warning">
              {{ database.type }}
            </v-btn>
          </a>
          <p v-else>{{ database.type }}</p>
        </td>
        <td>
          <p class="font-bold">{{ database.username }}</p>
          <p>{{ database.password }}</p>
        </td>
        <td>
          <v-btn v-if=" !database.isActive " @click=" deploy( database ) " color="error" size="small" rounded="pill" :loading="loading" :disabled="loading">
            Deploy
          </v-btn>
          <v-chip v-else color="green" text-color="white">
            Active
          </v-chip>
        </td>
      </tr>
    </tbody>
  </v-table>

  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination v-model=" page " class="my-4" :length=" totalPage " @click=" getData "  :loading="loading" :disabled="loading"></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
import { controlService, projectService } from "../../constant/endpoint"

export default {
  data () {
    return {
      data: undefined,
      itemPerPage: 25,
      totalPage: null,
      page: 1,
      name: null,
      isActive: "All",
      loading: false,
      error: null
    }
  },
  beforeMount () {
    this.getData()
  },
  methods: {
    async getData () {
      this.loading = true
      const query = {}
      if ( this.itemPerPage ) query.itemPerPage = this.itemPerPage
      if ( this.name ) query.name = this.name
      if ( this.isActive ) query.isActive = this.isActive

      axios.get( projectService + 'admin/list-database', {
        params: query
      } )
        .then( ( response ) => {
          this.data = response.data.data
          this.totalPage = response.data.totalPage
        } ).catch( ( response ) => {
          this.error = response.data.message
        } )
      this.loading = false
    },

    async deploy ( database ) {
      axios.post( controlService + 'database/create', {
        
      } ).then( this.activate( database.id ) )
      
    },
    async activate ( id ) {
      this.loading = true
      axios.patch( projectService + 'admin/activate-database', {
        id: id,
      } ).then( () => this.getData() )
        .catch( ( response ) => {
          this.error = response.data.message
        } )
      this.getData()
      this.loading = false
    }
  },
  watch: {
    isActive () {
      this.getData()
    },
    itemPerPage () {
      this.getData()
    }
  },
}
</script>

<style>

</style>
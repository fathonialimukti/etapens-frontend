<template>
  <div class="grid md:grid-cols-9 gap-2">
    <v-select v-model=" itemPerPage " label="Item per Page" class="md:col-span-2" :items=" [ 12, 25, 50 ] "
      prepend-inner-icon="mdi-format-list-numbered" />
    <v-select v-model=" isActive " label="Status" class="md:col-span-2" :items=" [ 'All', 'Active', 'Inactive' ] "
      prepend-inner-icon="mdi-list-status" />
    <v-text-field v-model=" name " label="Title" class="md:col-span-5" @input=" getData "
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
          <h1 class=" font-bold text-lg">Description</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Url/Port</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Repository</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Status</h1>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for=" backend in data" :key=" backend.id ">
        <td>{{ backend.student.name }}</td>
        <td> {{ backend.description }} </td>
        <td> <p v-if="!backend.url">{{ backend.id + 20000 }}</p> <a v-else :href="backend.url" target="_blank" rel="noopener noreferrer">{{ backend.url }}</a></td>
        <td>
          <a v-if=" backend.sourceCode " :href=" backend.sourceCode " target="_blank" rel="noopener noreferrer">
            {{ backend.sourceCode }}
          </a>
        </td>
        <td>
          <v-btn v-if=" !backend.isActive " @click=" deploy( backend ) " color="error" size="small" rounded="pill" :loading="loading" :disabled="loading">
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
      page: null,
      title: null,
      role: "Student",
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

      axios.get( projectService + 'admin/list-backend', {
        params: query
      } )
        .then( ( response ) => {
          this.data = response.data.data
          this.totalPage = response.data.totalPage
        } )
      this.loading = false
    },

    async deploy ( backend ) {
      this.loading = true
      this.error = null

      await axios.post( controlService + 'backend/create', {
        username: backend.student.user.username,
        sourceCode: backend.sourceCode,
        id: backend.id,
        runtimeVersion: project.runtimeVersion
      } )
        .then( ( response ) => {
          this.activate( backend.id, response.data.url )
        } )
        .catch( ( error ) => {
          this.error = error
          this.loading = false
        } )
    },

    async activate ( id, url ) {
      await axios.patch( projectService + 'admin/activate-backend', {
        id: id,
        url: url
      } ).then( () => this.getData() )
        .catch( ( error ) => {
          this.error = error
        } )
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
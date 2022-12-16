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
          <h1 class=" font-bold text-lg">Action</h1>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="   backend   in data" :key=" backend.id ">
        <td>{{ backend.student.name }}</td>
        <td> {{ backend.description }} </td>
        <td>
          <p v-if=" !backend.url ">{{ backend.id + 20000 }}</p> <a v-else :href=" backend.url " target="_blank"
            rel="noopener noreferrer">{{ backend.url }}</a>
        </td>
        <td>
          <a v-if=" backend.sourceCode " :href=" backend.sourceCode " target="_blank" rel="noopener noreferrer">
            {{ backend.sourceCode }}
          </a>
        </td>
        <td>
          <v-menu open-on-hover location="start">
            <template v-slot:activator=" { props } ">
              <v-btn :color=" backend.isActive ? 'success' : 'error' " v-bind=" props ">
                {{ backend.isActive ? "Active" : "Inactive" }}
              </v-btn>
            </template>

            <v-list v-if=" backend.isActive ">
              <v-list-item @click=" update( backend ) ">
                <v-icon icon="mdi-update"></v-icon> Update
              </v-list-item>
              <v-list-item @click=" stop( backend ) ">
                <v-icon icon="mdi-play-pause"></v-icon> Stop
              </v-list-item>
              <v-list-item @click=" start( backend ) ">
                <v-icon icon="mdi-play"></v-icon> Start
              </v-list-item>
            </v-list>

            <v-list v-else>
              <v-list-item @click=" deploy( backend ) ">
                <v-icon icon="mdi-bookmark-check-outline"></v-icon> Deploy Application
              </v-list-item>
            </v-list>
          </v-menu>
        </td>
      </tr>
    </tbody>
  </v-table>

  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination v-model=" page " class="my-4" :length=" totalPage " @click=" getData " :loading=" loading "
              :disabled=" loading "></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
import { controlService, backendService } from "../../constant/endpoint"

export default {
  data () {
    return {
      data: undefined,
      itemPerPage: 25,
      totalPage: null,
      page: 1,
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

      axios.get( backendService + 'admin/list-backend', {
        params: query
      } )
        .then( ( response ) => {
          console.log( response )
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
        runtimeVersion: backend.runtimeVersion
      } )
        .then( ( response ) => {
          this.activate( backend.id, response.data.url )
        } )
        .catch( ( response ) => {
          this.error = response.data
          this.loading = false
        } )
    },

    async update ( backend ) {
      this.loading = true
      this.error = null

      await axios.post( controlService + 'backend/update', {
        username: backend.student.user.username,
        sourceCode: backend.sourceCode,
        id: backend.id,
        runtimeVersion: backend.runtimeVersion
      } )
        .then( ( response ) => {
          this.activate( backend.id, response.data.url )
        } )
        .catch( ( response ) => {
          this.error = response.data
          this.loading = false
        } )
    },

    async activate ( id, url ) {
      await axios.patch( backendService + 'admin/activate-backend', {
        id: id,
        url: url
      } ).then( () => this.getData() )
        .catch( ( response ) => {
          this.error = response.data
        } )
      this.loading = false
    },

    async start ( backend ) {
      this.loading = true
      this.error = null

      await axios.post( controlService + 'backend/start', {
        username: backend.student.user.username,
        id: backend.id,
        runtimeVersion: backend.runtimeVersion
      } )
        .then( ( response ) => {
          this.error = response.data
          this.loading = false
        } )
        .catch( ( response ) => {
          this.error = response.data
          this.loading = false
        } )
    },

    async stop ( backend ) {
      this.loading = true
      this.error = null

      await axios.post( controlService + 'backend/stop', {
        id: backend.id,
      } )
        .then( ( response ) => {
          this.error = response.data
          this.loading = false
        } )
        .catch( ( response ) => {
          this.error = response.data
          this.loading = false
        } )
    },
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
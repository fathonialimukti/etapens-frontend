<template>
  <div class="grid md:grid-cols-9 gap-2">
    <v-select v-model=" itemPerPage " label="Item per Page" class="md:col-span-2" :items=" [ 12, 25, 50 ] "
      prepend-inner-icon="mdi-format-list-numbered" />
    <v-select v-model=" isActive " label="Status" class="md:col-span-2" :items=" [ 'All', 'Active', 'Inactive' ] "
      prepend-inner-icon="mdi-list-status" />
    <v-text-field v-model=" name " label="Name" class="md:col-span-5" @input=" getData "
      prepend-inner-icon="mdi-book-search-outline" />
  </div>
  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Lecturer Name</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">NIP</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Status</h1>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="  lecturer  in data" :key=" lecturer.id ">
        <td>
          <v-avatar rounded="0" :image=" lecturer.image " />
          {{ lecturer.name }}
        </td>
        <td>{{ lecturer.nip }}</td>
        <td>
          <v-chip v-if=" lecturer.isActive " color="green" text-color="white">
            Active
          </v-chip>
          <v-btn v-else @click=" activate( lecturer.id ) " color="error" size="small" rounded="pill" :loading="loading" :disabled="loading">
            Activate
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>

  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination v-model=" page " class="my-4" :length=" totalPage " @click=" getData "></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
import { projectService } from "../../constant/endpoint"

export default {
  data () {
    return {
      data: undefined,
      itemPerPage: 25,
      name: null,
      isActive: "All",
      page: null
    }
  },
  beforeMount () {
    this.getData()
  },
  methods: {
    getData () {
      const query = {}
      if ( this.itemPerPage ) query.itemPerPage = this.itemPerPage
      if ( this.name ) query.name = this.name
      if ( this.isActive ) query.isActive = this.isActive
      if ( this.page ) query.page = this.page

      axios
        .get( projectService + 'admin/list-lecturer', {
          params: query
        } )
        .then( response => {
          this.data = response.data.data
        } )
    },
    activate ( id ) {
      axios.patch( projectService + 'admin/activate-lecturer', {
        id: id
      } )
        .then( ( response ) => { if ( response.data == "OK" ) this.getData() } )
        .catch( function ( error ) {
          console.log( error )
        } )
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
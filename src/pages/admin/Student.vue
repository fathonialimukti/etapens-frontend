<template>
  <div class="grid md:grid-cols-9 gap-2">
    <v-select v-model=" itemPerPage " label="Item per Page" class="md:col-span-2" :items=" [ 12, 25, 50 ] "
      prepend-inner-icon="mdi-format-list-numbered" />
    <v-select v-model=" isActive " label="Status" class="md:col-span-2" :items=" [ 'All', 'Active', 'Inactive' ] "
      prepend-inner-icon="mdi-list-status" />
    <v-text-field v-model=" name " label="Name" class="md:col-span-5" @change=" getData "
      prepend-inner-icon="mdi-book-search-outline" />
  </div>
  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Name</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">NRP</h1>
        </th>
        <th class="text-left">
          <h1 class=" font-bold text-lg">Status</h1>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="  student  in data" :key=" student.id ">
        <td>
          <!-- <v-avatar color="grey" rounded="0" :image=" student.image " /> -->
          <router-link :to=" { title: 'student-profile', params: { title: student.name } } "
            class="flex flex-wrap font-bold " target="_blank">
            {{ student.name }}
          </router-link>
        </td>
        <td>{{ student.name }}</td>
        <td>
          <v-chip v-if=" student.isActive " color="green" text-color="white">
            Active
          </v-chip>
          <v-btn v-else @click=" activate( student.id ) " color="error" size="small" rounded="pill">
            Activate
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import axios from "axios"
import { projectService } from "../../constant/endpoint"

export default {
  data () {
    return {
      data: undefined,
      itemPerPage: 25,
      totalPage: null,
      page: null,
      name: null,
      role: "Student",
      isActive: "All"
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
        .get( projectService + 'admin/list-student', {
          params: query
        } )
        .then( response => {
          this.data = response.data.data
          this.totalPage = response.data.totalPage
        } )
    },
    activate ( id ) {
      axios.patch( projectService + 'admin/activate-student', {
        id: id
      } )
        .then( () => this.getData() )
        .catch( function ( error ) {
          console.log( error )
        } )
    }
  }
}
</script>

<style>

</style>
<template>
  <Search @submit="getData "></Search>
  <v-container class="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
    <ProjectCard class="md:col-span-1" v-for="project in projects" :key=" project.id " :project=" project " />
  </v-container>
  <div class="text-center">
    <v-pagination v-model=" page " :length=" totalPage " :total-visible=" 7 " @change=" getData() "></v-pagination>
  </div>

</template>

<script>
import ProjectCard from "../components/ProjectCard.vue"
import Search from "../components/Search.vue"
import { API } from "aws-amplify"

export default {
  components: {
    ProjectCard,
    Search,
  },
  data () {
    return {
      projects: undefined,
      totalPage: undefined,
      page: 1,
    }
  },
  beforeMount () {
    this.getData()
  },
  methods: {
    async getData ( searchQuery ) {
      const query = {}
      if ( this.page < 1 || this.page > this.totalPage ) this.page = 1
      query.page = this.page

      if ( searchQuery ) {
        if ( searchQuery.title ) query.title = searchQuery.title
        if ( searchQuery.tech.length != 0 ) query.tech = searchQuery.tech
        if ( searchQuery.researchField != 0 ) query.researchField = searchQuery.researchField
        if ( searchQuery.method.length != 0 ) query.method = this.method
      }

      await API
        .get( 'etapens', '/', {
          queryStringParameters: query
        } )
        .then( result => {
          this.projects = result.data
          this.totalPage = result.totalPage
        } ).catch(error => console.log(error))
    }
  }
};

</script>
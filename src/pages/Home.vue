<template>
  <div class="mb-2 sm:ml-2 sm:mr-2 p-2 content-center">
    <Search @submit=" getData "></Search>
  </div>
  <ul v-for=" project  in projects" :key=" project._id ">
    <ProjectBlock :project=" project " />
  </ul>
    <div class="btn-group w-full justify-center">
      <button class="btn w-2/5" @click=" page--; getData()">«</button>
      <button class="btn w-1/5">Page {{ page }} of {{ totalPage }}</button>
      <button class="btn w-2/5" @click=" page++; getData() ">»</button>
    </div>
</template>

<script>
import ProjectBlock from "../components/ProjectBlock.vue"
import Search from "../components/Search.vue"
import axios from "axios"
import { projectService } from "../constant/endpoint"

export default {
  components: {
    ProjectBlock,
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
    getData (advancedSearch) {
      const query = {}
      if ( this.page < 1 || this.page > this.totalPage ) this.page = 1
      query.page = this.page

      if ( advancedSearch ) {
        if ( advancedSearch.title ) query.title = advancedSearch.title
        if ( advancedSearch.tech.length != 0 ) query.tech = advancedSearch.tech
        if ( advancedSearch.researchFields != 0 ) query.researchFields = advancedSearch.researchFields
        if ( advancedSearch.methods.length != 0 ) query.methods = this.methods
      }

      axios
        .get( projectService, {
          params: query
        } )
        .then( response => {
          this.projects = response.data.data
          this.totalPage = response.data.totalPage
        } )
    }
  }
};

</script>

<style>
.vsm_collapsed {
  background: transparent !important;
}
</style>
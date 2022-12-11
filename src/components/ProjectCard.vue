<template>
  <v-card @click=" $router.push( { name: 'Project', params: { title: project.title } } )">
    <v-img :src="project.images[0]" height="200px" cover></v-img>

    <v-card-text>
      {{project.title}}
    </v-card-text>

    <v-card-subtitle class="py-0">
      {{project.student.name}}
    </v-card-subtitle>

    <v-card-subtitle class="py-0">
      {{project.student.nrp}}
    </v-card-subtitle>

    <v-card-text>
      <v-chip v-for=" tech in project.tech" color="blue" size="x-small" class="mr-0.5 mb-0.5">
        {{tech.name}}
      </v-chip>
    </v-card-text>


  </v-card>
</template>

<script>
export default {
  props: [ "project" ],
  data () {
    return {
      show: false
    }
  },
  methods: {
    document () { console.log( "document clicked" ) },
    site () { console.log( "site clicked" ) }
  }
}
</script>

<style>

</style>
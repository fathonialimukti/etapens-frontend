<template>
  <v-card @click=" $router.push( { name: 'Project', params: { title: project.title } } )">
    <v-img :src="project.images[0]" height="200px" cover></v-img>

    <v-card-text>
      {{project.title}}
    </v-card-text>

    <v-card-text class="pt-0">
      <v-chip v-for=" tech in project.tech" color="primary" size="x-small" class="m-0.5">
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
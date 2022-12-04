<template>
  <v-toolbar title="Application" color="blue" rounded>
    <v-menu>
      <template v-slot:activator=" { props } ">
        <v-btn color="warning" variant="flat" v-bind=" props ">
          Create New
        </v-btn>
      </template>
      <v-list>
        <router-link v-if=" !user.project " :to=" { name: 'Create Project' } ">
          <v-list-item>
            <v-list-item-title>Create Project</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link v-if=" !user.backend " :to=" { name: 'Create Backend' } ">
          <v-list-item>
            <v-list-item-title>Create Backend</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link v-if=" !user.database " :to=" { name: 'Create Database' } ">
          <v-list-item>
            <v-list-item-title>Create Database</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>
    </v-menu>
  </v-toolbar>

  <v-expansion-panels variant="popout" class="my-4">
    
    <v-expansion-panel v-if=" user.project " title="Project" color="secondary">
      <v-expansion-panel-text>
        {{ user.project }}
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel v-if=" user.backend " title="Backend" color="secondary">
      <v-expansion-panel-text>
        {{ user.backend }}
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel v-if=" user.database " title="Database" color="secondary">
      <v-expansion-panel-text>
        {{ user.database }}
      </v-expansion-panel-text>
    </v-expansion-panel>

  </v-expansion-panels>

</template>

<script>
import axios from 'axios'
import { projectService } from '../../constant/endpoint'
import useAuthStore from '../../stores/auth'

export default {
  data () {
    return {
      store: useAuthStore(),
      user: {},
    }
  },
  beforeMount () {
    axios
      .get( projectService + 'student', {
        params: {
          id: this.store.user.studentAccount.id
        }
      } )
      .then( response => { this.user = response.data } )
  }
}
</script>

<style>

</style>
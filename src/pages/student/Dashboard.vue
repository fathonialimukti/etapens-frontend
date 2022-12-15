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
        <v-card-title> Judul Tugas Akhir </v-card-title>
        <v-card-text>{{ user.project.title }}</v-card-text>

        <v-card-title> Deskripsi </v-card-title>
        <v-card-text>{{ user.project.description }}</v-card-text>

        <v-card-title> Tipe Aplikasi </v-card-title>
        <v-card-text>{{ user.project.type }}</v-card-text>

        <v-card-title> Dosen Pembimbing </v-card-title>
        <v-card-text>
          <v-list lines="one">
            <v-list-item @click="" v-for="lecturer in user.project.lecturers" :key="lecturer.id" :title="lecturer.name" :subtitle="lecturer.nip" :prepend-avatar="lecturer.image"></v-list-item>
          </v-list>
        </v-card-text>

        <v-card-title> Repository </v-card-title>
        <v-card-text>{{ user.project.sourceCode }}</v-card-text>

        <v-card-title> Url </v-card-title>
        <v-card-text>{{ user.project.url }}</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if=" user.project.isActive " color="success" variant="elevated">
            Active
          </v-btn>
          <v-btn v-else color="error" variant="elevated">
            Inactive
          </v-btn>
          <v-btn color="blue" variant="elevated">
            Edit
          </v-btn>
          <v-btn color="warning" variant="elevated">
            Update
          </v-btn>
        </v-card-actions>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel v-if=" user.backend " title="Backend" color="secondary">
      <v-expansion-panel-text>
        <v-card-title> Deskripsi </v-card-title>
        <v-card-text>{{ user.backend.description }}</v-card-text>

        <v-card-title> Repository </v-card-title>
        <v-card-text>{{ user.backend.sourceCode }}</v-card-text>

        <v-card-title> Url </v-card-title>
        <v-card-text>{{ user.backend.url }}</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if=" user.backend.isActive " color="success" variant="elevated">
            Active
          </v-btn>
          <v-btn v-else color="error" variant="elevated">
            Inactive
          </v-btn>
          <v-btn color="warning" variant="elevated">
            Update
          </v-btn>
        </v-card-actions>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel v-if=" user.database " title="Database" color="secondary">
      <v-expansion-panel-text>
        <v-card-title> Nama Database </v-card-title>
        <v-card-text>{{ user.database.name }}</v-card-text>

        <v-card-title> Deskripsi </v-card-title>
        <v-card-text>{{ user.database.description }}</v-card-text>

        <v-card-title> Tipe Database </v-card-title>
        <v-card-text>{{ user.database.type }}</v-card-text>

        <v-card-title> Username </v-card-title>
        <v-card-text>{{ user.database.username }}</v-card-text>

        <v-card-title> Password </v-card-title>
        <v-card-text>{{ user.database.password }}</v-card-text>

z        <v-card-title> Host </v-card-title>
        <v-card-text v-if=" user.database.type == 'mysql' ">ec2-52-74-228-86.ap-southeast-1.compute.amazonaws.com:3306</v-card-text>
        <v-card-text v-if=" user.database.type == 'postgres' ">ec2-52-74-228-86.ap-southeast-1.compute.amazonaws.com:5432</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if=" user.database.isActive " color="success" variant="elevated">
            Active
          </v-btn>
          <v-btn v-else color="error" variant="elevated">
            Inactive
          </v-btn>
          <v-btn color="warning" variant="elevated">
            Update
          </v-btn>
        </v-card-actions>
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
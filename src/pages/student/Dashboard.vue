<template>
  <div class="card shadow-xl bg-base-300 overflow-visible max-w-5xl w-screen">
    <div class="card-body w-full">
      <div class="card-actions justify-between">
        <h2 class="card-title">Project List</h2>
        <div v-if="!user?.project" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-warning m-1">Create new</label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li v-if="!user?.project">
              <router-link :to="{ name: 'Create Project' }">Project</router-link>
            </li>
            <!-- <li v-if="!user?.backend">
              <router-link :to="{ name: 'Create Backend' }">Backend</router-link>
            </li>
            <li v-if="!user?.database">
              <router-link :to="{ name: 'Create Database' }">Database</router-link>
            </li> -->
          </ul>
        </div>
      </div>

      <!-- Project list -->

      <!-- project -->
      <div v-if="user?.project" class="card card-compact w-auto bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{user?.project.title}}</h2>

          <p class="font-bold"> Description: </p>
          <p>{{ user?.project.description}}</p>
          <p class="font-bold"> Tech used: </p>
          <p>{{ user?.project.tech.join(", ")}}</p>
          <p class="font-bold"> Status: </p>
          <p>{{ user?.project.isActive ? "Active" : "Inactive" }}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Edit</button>
          </div>
        </div>
      </div>

      <!-- backend -->
      <div v-if="user?.backend" class="card card-compact w-auto bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Backend!</h2>
          <p>{{ user?.backend.description}}</p>
          <p></p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Edit</button>
          </div>
        </div>
      </div>

      <!-- db -->
      <div v-if="user?.database" class="card card-compact w-auto bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Database Request!</h2>
          <p>{{ user?.database.dbname}}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Edit</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import { projectService } from '../../constant/endpoint'
import useAuthStore from '../../stores/auth'

export default {
  data () {
    return {
      store: useAuthStore(),
      user: null,
    }
  },
  beforeMount () {
    axios
      .get( projectService + 'student', {
        params: {
          id: this.store.user.studentAccount.id
        }
      } )
      .then( response => ( this.user = response.data ) )
  }
}
</script>

<style>

</style>
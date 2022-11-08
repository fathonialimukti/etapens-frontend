<template>
  <nav
    class=" flex flex-wrap items-center justify-between px-3 bg-gray-800/80 backdrop-blur-sm shadow fixed w-full top-0 left-0 z-50">
    <div class="container px-4 mx-auto flex flex-wrap items-center">
      <div class="w-full relative flex justify-between px-4">
        <a class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white" href="#">
          <img class="inline-block h-12 w-12 mr-1" src="/Logo_PENS_putih.png" alt="logo_PENS" /> <span
            class="invisible md:visible">Etalase Tugas Akhir</span>
        </a>
        <div class="dropdown dropdown-end">
          <p tabindex="0" class="btn btn-info m-1 normal-case">
            <Avatar v-if=" store.user.studentAccount?.image || store.user.lecturerAccount?.image "
              :img=" store.user.studentAccount?.image || store.user.lecturerAccount?.image " />{{
                  store.user.username ?
                    store.user.username : "Login/Register"
              }}
          </p>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box min-w-content">
            <authenticator>
              <template v-slot=" { signOut } ">
                <li class="nav-item items-center block" v-for=" item in getNavigation()" :key=" item ">
                  <div v-if="item == 'Inactive'" >
                    Status: <span class="badge badge-error gap-2">Inactive</span>
                  </div>
                  <router-link v-else class="text-xs uppercase  font-bold leading-snug hover:opacity-75"
                    :to=" { name: item } ">
                    <span>{{ item }}</span>
                  </router-link>
                </li>
                <li>
                  <button class="btn btn-outline btn-error" @click=" signOut ">Sign Out</button>
                </li>
              </template>
            </authenticator>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  {{ authenticator }}
</template>

<script>
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue"
import axios from "axios"
import useAuthStore from "../stores/auth"
import "@aws-amplify/ui-vue/styles.css"
import { projectService } from "../constant/endpoint"
import Avatar from "./Avatar.vue"

export default {
  components: { Authenticator, Avatar },
  data () {
    return {
      showMenu: false,
      store: useAuthStore(),
      auth: useAuthenticator()
    }
  },
  watch: {
    "auth.authStatus" ( newStore ) {
      if ( newStore === 'unauthenticated' ) this.clearAuth() // && oldVal === 'authenticated' 
      if ( newStore === 'authenticated' ) this.setAuth() // && oldVal === 'unauthenticated'
    },
  },
  methods: {
    setAuth () {
      axios
        .post( projectService + 'get-user', {
          username: this.auth.user.username,
          email: this.auth.user.attributes.email
        } )
        .then( ( response ) => {
          this.store.setUser( response.data )
        } )
    },
    clearAuth () {
      this.store.deleteUser()
    },
    getNavigation () {
      if ( this.store.user.role == 'Admin' ) {
        return [ "Admin Dashboard", ]
      }
      else if ( this.store.user.role == 'Student' ) {
        if ( this.store.user.studentAccount.isActive ) return [ "Student Dashboard", ]
        else return ["Inactive"]
      }
      else if ( this.store.user.role == 'Lecturer' ) {
        if ( this.store.user.lecturerAccount.isActive ) return [ "Lecturer Dashboard", ]
        else return [ "Inactive" ]   
      }
      else return ["Register"]
    }
  }
}
</script>
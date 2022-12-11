<template>
  <v-app :theme=" theme ">

    <v-app-bar :elevation=" 2 ">
      <v-app-bar-nav-icon variant="text" @click.stop=" drawer = !drawer "></v-app-bar-nav-icon>

      <v-app-bar-title>
        <router-link to="/">Etalase Tugas Akhir</router-link>
      </v-app-bar-title>

      <v-btn :icon=" theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night' " @click=" themeSwitch " />

      <v-btn v-if=" !store.user.id " variant="outlined" @click=" login ">Login</v-btn>
      <Avatar v-else></Avatar>

    </v-app-bar>

    <v-navigation-drawer v-model=" drawer ">

      <v-list :lines=" false " nav>
        <router-link v-for="( navigation, i ) in adminNavigation" :key=" i " :to=" { name: navigation.name } ">
          <v-list-item :value=" navigation.name " active-color="blue">
            <template v-slot:prepend>
              <v-icon :icon=" navigation.icon "></v-icon>
            </template>

            <v-list-item-title v-text=" navigation.name "></v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>

    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from 'vue'
import useAuthStore from "../stores/auth"
import Avatar from '../components/Avatar.vue'

const theme = ref( 'light' )

export default {
  data () {
    return {
      theme,
      drawer: null,
      store: useAuthStore(),
      adminNavigation: [
        { name: 'Admin Dashboard', icon: 'mdi-monitor-dashboard' },
        { name: 'List Frontend', icon: 'mdi-arrange-bring-forward' },
        { name: 'List Backend', icon: 'mdi-arrange-send-backward' },
        { name: 'List Database', icon: 'mdi-database' },
        { name: 'List Student', icon: 'mdi-account-group' },
        { name: 'List Lecturer', icon: 'mdi-human-male-board-poll' },
        { name: 'List Tech', icon: 'mdi-clipboard-list' },
        { name: 'List Research Field', icon: 'mdi-clipboard-list-outline' },
        { name: 'List Research Method', icon: 'mdi-clipboard-minus' },
      ]
    }
  },
  components: {
    Avatar
  },
  methods: {
    themeSwitch () { theme.value = theme.value === 'light' ? 'dark' : 'light' },
    login () { this.$router.push( { name: 'Login' } ) }
  }
}
</script>
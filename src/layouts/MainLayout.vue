<template>
  <v-app :theme=" theme ">
    <v-app-bar>

      <v-app-bar-title>
        <router-link to="/">Etalase Tugas Akhir</router-link>
      </v-app-bar-title>
      
      <v-btn :icon=" theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night' " @click=" themeSwitch " />

      <v-btn v-if=" !store.user.id " variant="outlined" @click=" login ">Login</v-btn>
      <Avatar v-else></Avatar>
    </v-app-bar>

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

const theme = ref( 'dark' )

export default {
  data () {
    return {
      theme,
      store: useAuthStore(),
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
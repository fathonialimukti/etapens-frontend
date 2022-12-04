<template>
    <authenticator>
    </authenticator>
    Login Berhasil.
    <v-btn @click=" $router.push( { name: 'Home' } ) ">
        Pulang
    </v-btn>
</template>

<script>
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue"
import axios from "axios"
import useAuthStore from "../stores/auth"
import "@aws-amplify/ui-vue/styles.css"
import { projectService } from "../constant/endpoint"


const auth = useAuthenticator()
export default {
    components: { Authenticator },
    data () {
        return {
            store: useAuthStore(),
            auth
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
                    // activate this on production
                    // this.$router.push( { name: 'Home' } ) 
                } )
        },
        clearAuth () {
            this.store.deleteUser()
        },
    }
}
</script>
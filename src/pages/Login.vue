<template>
    <authenticator :sign-up-attributes="['email']">
        <template v-slot=" { user, signOut } ">
            <div class="text-center">
                <div>
                    <h1>Hello {{ user.username }}!</h1>
                </div>
                <div class="m-5">
                    <v-btn @click=" $router.push( { name: 'Home' } ) ">Kembali</v-btn>
                </div>
                <div>
                    <v-btn @click=" signOut ">Sign Out</v-btn>
                </div>
            </div>
        </template>
    </authenticator>
</template>

<script>
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue"
import useAuthStore from "../stores/auth"
import "@aws-amplify/ui-vue/styles.css"
import { API } from "aws-amplify"


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
        async setAuth () {
            await API
                .post( 'etapens', '/get-user', {
                    body: {
                        username: this.auth.user.username,
                        email: this.auth.user.attributes.email }
                } )
                .then( result => {
                    this.store.setUser( result )
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
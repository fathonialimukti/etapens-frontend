<script setup>
import { Amplify, Auth } from 'aws-amplify'

Amplify.configure( {
  Auth: {
    identityPoolId: 'ap-southeast-1:15232557-2332-448b-87a5-bf7ddb8b5ca5',
    region: 'ap-southeast-1',
    userPoolId: 'ap-southeast-1_6Vsn41RIq',
    userPoolWebClientId: '3ac8lj16iaku2a8n5cnbg4to1j',
  },

  Storage: {
    AWSS3: {
      bucket: 'pjj2022-fathoni-etapens-storage',
      region: 'ap-southeast-3',
    }
  },

  API: {
    endpoints: [ {
      name: 'etapens',
      endpoint: "https://6zbrs7idyb.execute-api.ap-southeast-3.amazonaws.com/prod",
      region: 'ap-southeast-3',
      custom_header: async () => {
        try {
          return {
            Authorization: `Bearer ${ ( await Auth.currentSession() ).getIdToken().getJwtToken() }`
          }
        } catch ( error ) {
          console.log(error);
        }
      }
    } ]
  }
} )
</script>

<template>
  <router-view></router-view>
</template>

<style>

</style>
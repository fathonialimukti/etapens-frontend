<script setup>
import { Amplify, Auth } from 'aws-amplify'
// import awsconfig from './aws-exports.js'

Amplify.configure( {
  // ...awsconfig,
  Auth: {
    identityPoolId: 'ap-southeast-1:d4cd7c76-7555-42b1-8087-cd061323ed5f', // REQUIRED - Amazon Cognito Identity Pool ID
    region: 'ap-southeast-1', // REQUIRED - Amazon Cognito Region
    userPoolId: 'ap-southeast-1_K041A6i30', // OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: '3d2bd9k4ullte6i7isp8m5uri1', // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  },

  Storage: {
    AWSS3: {
      bucket: 'etapens-storage140101-dev', //REQUIRED -  Amazon S3 bucket name
      region: 'ap-southeast-1', //OPTIONAL -  Amazon service region
    }
  },

  API: {
    endpoints: [ {
      name: "etapens",
      endpoint: "https://vp7oa3lzqj.execute-api.ap-southeast-1.amazonaws.com/dev",
      region: "ap-southeast-1",
      custom_header: async () => {
        if ( await Auth.user ) return {
          Authorization: `Bearer ${ ( await Auth.currentSession() ).getIdToken().getJwtToken() }`
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
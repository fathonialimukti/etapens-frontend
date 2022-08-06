<script setup>
  import { Amplify } from 'aws-amplify';
  import awsconfig from './aws-exports.cjs';

  Amplify.configure(awsconfig);
</script>

<template>
  <authenticator>
    <template v-slot="{ user, signOut }">
      <h1>Hello {{ user.attributes.name }}!</h1>
      <button @click="signOut">Sign Out</button>
    </template>
  </authenticator>

  <router-view></router-view>
  
</template>
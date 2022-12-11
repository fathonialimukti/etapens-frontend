<script setup>
import { Amplify } from 'aws-amplify';
import awsconfig from './aws/aws-exports.js';

Amplify.configure( awsconfig );
</script>

<template>
  <router-view></router-view>
</template>

<style>

</style>
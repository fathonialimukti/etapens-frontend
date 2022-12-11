<script setup>
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws/aws-exports.js';

Amplify.configure( awsconfig );
</script>

<template>
  <router-view></router-view>
</template>

<style>

</style>
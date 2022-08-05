<template>
  <h1>About</h1>
  <p>Email : {{ user.attributes.email }}</p>
  <router-link to="/">Go to Home</router-link>
</template>

<script>
import { useAuthenticator } from '@aws-amplify/ui-vue';
const { user } = useAuthenticator();
export default {
    data ()
    {
        return {
            user: user
        };
    },
};
</script>

<style>

</style>
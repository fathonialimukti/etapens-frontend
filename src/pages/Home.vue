<template>
    <h1>Home</h1>
    <router-link to="/about">Go to About</router-link>
</template>

<script>
import { useAuthenticator } from '@aws-amplify/ui-vue';
// `route` `user` and `signOut` all are reactive.
const { user } = useAuthenticator();
export default {
    data ()
    {
        return {
            auth: user
        };
    },
};
</script>

<style>

</style>
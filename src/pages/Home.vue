<template>
    <h1>Home</h1>
    <p>Name : {{ user.attributes.name }}</p>
    <router-link to="/about">Go to About</router-link>
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
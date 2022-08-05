import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import AmplifyVue from '@aws-amplify/ui-vue';
import '@aws-amplify/ui-vue/styles.css';
import router from './router'

createApp( App )
    .use( AmplifyVue )
    .use( router )
    .mount( '#app' );

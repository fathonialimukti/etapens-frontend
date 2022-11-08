import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'

createApp( App )
    .use( router )
    .use( createPinia() )
    .use( plugin, defaultConfig )
    .mount( '#app' )

// main.d2x5umj65u8v21.amplifyapp.com

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify( {
    components,
    directives,
} )

createApp( App )
    .use( router )
    .use( createPinia() )
    .use( vuetify )
    .mount( '#app' )

// main.d2x5umj65u8v21.amplifyapp.com

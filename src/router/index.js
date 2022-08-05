import { createRouter, createWebHashHistory } from 'vue-router';
import HomeLayout from '../components/HomeLayout.vue';

const routes = [
    {
        path: '/',
        component: HomeLayout,
        children: [
            {
                name: 'Home',
                path: '',
                component: () => import( '../pages/Home.vue' )
            },
            {
                name: 'About',
                path: 'about',
                component: () => import( '../pages/About.vue' )
            }
        ]
    },
];

const router = createRouter( {
    history: createWebHashHistory(),
    routes: routes,
} );

export default router;
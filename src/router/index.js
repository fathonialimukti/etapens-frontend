import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import useAuthStore from '../stores/auth'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [ {
            name: 'Home',
            path: '',
            component: () => import( '../pages/Home.vue' )
        }, {
            name: 'Project',
            path: 'project/:title',
            component: () => import( '../pages/ProjectPage.vue' )
        }, {
            name: 'Student Profile',
            path: 'student-profile/:name',
            component: () => import( '../pages/StudentProfile.vue' )
        }, {
            name: 'Lecturer Profile',
            path: 'lecturer-profile/:name',
            component: () => import( '../pages/LecturerProfile.vue' )
        }, {
            name: 'Register',
            meta: { register: true },
            path: 'register',
            component: () => import( '../pages/Register.vue' )
        }, {
            name: 'Test',
            path: 'test',
            component: () => import( '../pages/Test.vue' )
        }, {
            name: 'Login',
            path: 'login',
            meta: { login: true },
            component: () => import( '../pages/Login.vue' )
        }, {
            path: 'student',
            meta: { student: true },
            children: [ {
                name: 'Student Dashboard',
                path: '',
                component: () => import( '../pages/student/Dashboard.vue' ),
            }, {
                name: 'Create Project',
                path: 'create-project',
                component: () => import( '../pages/student/CreateProject.vue' )
            }, {
                name: 'Create Backend',
                path: 'create-backend',
                component: () => import( '../pages/student/CreateBackend.vue' )
            }, {
                name: 'Create Database',
                path: 'create-database',
                component: () => import( '../pages/student/CreateDatabase.vue' )
            }, ]
        }, {
            path: 'lecturer',
            meta: { lecturer: true },
            children: [ {
                name: 'Lecturer Dashboard',
                path: '',
                component: () => import( '../pages/lecturer/Dashboard.vue' ),
            }, ]
        }, ]
    }, {
        path: '/admin',
        component: AdminLayout,
        meta: { admin: true },
        children: [ {
            name: 'Admin Dashboard',
            path: '',
            component: () => import( '../pages/admin/Dashboard.vue' )
        }, {
            name: 'List Student',
            path: 'list-student',
            component: () => import( '../pages/admin/Student.vue' )
        }, {
            name: 'List Lecturer',
            path: 'list-lecturer',
            component: () => import( '../pages/admin/Lecturer.vue' )
        }, {
            name: 'List Database',
            path: 'list-database',
            component: () => import( '../pages/admin/Database.vue' )
        }, {
            name: 'List Frontend',
            path: 'list-frontend',
            component: () => import( '../pages/admin/Frontend.vue' )
        }, {
            name: 'List Backend',
            path: 'list-backend',
            component: () => import( '../pages/admin/Backend.vue' )
        }, {
            name: 'List Research Field',
            path: 'list-research-field',
            component: () => import( '../pages/admin/ResearchField.vue' )
        }, {
            name: 'List Tech',
            path: 'list-tech',
            component: () => import( '../pages/admin/TechList.vue' )
        }, {
            name: 'List Research Method',
            path: 'list-research-method',
            component: () => import( '../pages/admin/ResearchMethod.vue' )
        } ],
    }
]

const router = createRouter( {
    history: createWebHashHistory(),
    routes: routes,
} )

router.beforeEach( ( to ) => {
    const store = useAuthStore()

    if ( to.meta.student && !store.user.studentAccount.isActive ) return '/'
    if ( to.meta.lecturer && !store.user.lecturerAccount.isActive ) return '/'
    if ( to.meta.admin && store.user.role != 'Admin' ) return '/'
    if ( to.meta.register && store.user.role != 'Guest' ) return '/'
} )

export default router
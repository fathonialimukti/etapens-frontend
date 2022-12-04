<template>
    <div class="grid md:grid-cols-9 gap-2">
        <v-select v-model=" itemPerPage " label="Item per Page" class="md:col-span-2" :items=" [ 12, 25, 50 ] "
            prepend-inner-icon="mdi-format-list-numbered" />
        <v-select v-model=" isActive " label="Status" class="md:col-span-2" :items=" [ 'All', 'Active', 'Inactive' ] "
            prepend-inner-icon="mdi-list-status" />
        <v-text-field v-model=" title " label="Title" class="md:col-span-5" @change=" getData "
            prepend-inner-icon="mdi-book-search-outline" />
    </div>
    <v-progress-linear v-if="loading" indeterminate color="green"></v-progress-linear>
    <v-table fixed-header>
        <thead>
            <tr>
                <th class="text-left">
                    <h1 class=" font-bold text-lg">Title</h1>
                </th>
                <th class="text-left">
                    <h1 class=" font-bold text-lg">Student Name</h1>
                </th>
                <th class="text-left">
                    <h1 class=" font-bold text-lg">Type / Repository</h1>
                </th>
                <th class="text-left">
                    <h1 class=" font-bold text-lg">Status</h1>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="project in data" :key=" project.id ">
                <td>
                    <router-link :to=" { title: 'Project', params: { title: project.title } } "
                        class="flex flex-wrap font-bold " target="_blank">
                        {{ project.title }}
                    </router-link>
                </td>
                <td>{{ project.student.name }}</td>
                <td>
                    <a v-if=" project.sourceCode " :href=" project.sourceCode " target="_blank">
                        <v-btn color="warning" size="x-small">
                            {{ project.type }}
                        </v-btn>
                    </a>
                    <p v-else>{{ project.type }}</p>
                </td>
                <td>
                    <v-btn v-if=" project.type == 'NodeJs' && !project.isActive " @click=" deploy( project ) "
                        color="error" size="small" rounded="pill" >
                        Deploy
                    </v-btn>
                    <v-chip v-else-if=" project.isActive " color="green" text-color="white">
                        Active
                    </v-chip>
                    <v-btn v-else @click=" activate( project.id ) " color="error" size="small" rounded="pill">
                        Activate
                    </v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script>
import axios from "axios"
import { controlService, projectService } from "../../constant/endpoint"

export default {
    data () {
        return {
            data: undefined,
            itemPerPage: 25,
            totalPage: null,
            page: null,
            title: null,
            role: "Student",
            isActive: "All",
            loading: null,
            error: null
        }
    },
    beforeMount () {
        this.getData()
    },
    methods: {
        async getData () {
            this.loading = true
            const query = {}
            if ( this.itemPerPage ) query.itemPerPage = this.itemPerPage
            if ( this.title ) query.title = this.title
            if ( this.isActive ) query.isActive = this.isActive

            await axios.get( projectService + 'admin/list-project', {
                params: query
            } )
                .then( ( response ) => {
                    this.data = response.data.data
                    this.totalPage = response.data.totalPage
                } )
            this.loading = false
        },

        async deploy ( project ) {
            this.loading = true
            this.error = null

            await axios.post( controlService + 'project', {
                username: project.student.user.username,
                sourceCode: project.sourceCode,
            } )
                .then( ( response ) => {
                    console.log( response )
                    this.activate( project.id )
                } )
                .catch( ( error ) => {
                    this.error = error
                    this.loading = false
                } )
        },

        async activate ( id ) {
            this.loading = true
            await axios.patch( projectService + 'admin/activate-project', {
                id: id,
            } ).then( () => this.getData() )
                .catch( ( error ) => {
                    this.error = error
                } )
            this.loading = false
        }
    },
    watch: {
        isActive () {
            this.getData()
        },
        itemPerPage () {
            this.getData()
        }
    },

}
</script>

<style>

</style>
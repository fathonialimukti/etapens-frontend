<template>
    <div class="grid md:grid-cols-9 gap-2">
        <v-select v-model=" itemPerPage " label="Item per Page" class="md:col-span-2" :items=" [ 12, 25, 50 ] "
            prepend-inner-icon="mdi-format-list-numbered" />
        <v-select v-model=" isActive " label="Status" class="md:col-span-2" :items=" [ 'All', 'Active', 'Inactive' ] "
            prepend-inner-icon="mdi-list-status" />
        <v-text-field v-model=" title " label="Title" class="md:col-span-5" @input=" getData "
            prepend-inner-icon="mdi-book-search-outline" />
    </div>
    <v-progress-linear v-if=" loading " indeterminate color="green"></v-progress-linear>
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
                    <h1 class=" font-bold text-lg">Action</h1>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for=" project in data" :key=" project.id ">
                <td>
                    <router-link :to=" { name: 'Project', params: { title: project.title } } "
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
                    <v-row>
                        <v-tooltip v-if=" project.isActive " location="start" text="Active">
                            <template v-slot:activator=" { props } ">
                                <v-btn v-bind=" props " color="success" icon="mdi-bookmark-check-outline"
                                    size="small"></v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip v-if=" !project.isActive && project.type == 'Generals' " location="start"
                            text="Activate">
                            <template v-slot:activator=" { props } ">
                                <v-btn v-bind=" props " color="error" icon="mdi-bookmark-minus-outline" size="small"
                                    @click=" activate( tech.id ) " :loading=" loading " :disabled=" loading "></v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip
                            v-if=" ( project.type == 'NodeJs' || project.type == 'WebStatic' ) && !project.isActive "
                            location="start" text="Deploy App">
                            <template v-slot:activator=" { props } ">
                                <v-btn v-bind=" props " color="error" icon="mdi-play" size="small"
                                    @click=" deploy( project ) " :loading=" loading " :disabled=" loading "></v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip
                            v-if=" ( project.type == 'NodeJs' || project.type == 'WebStatic' ) && project.isActive "
                            location="start" text="Stop Application">
                            <template v-slot:activator=" { props } ">
                                <v-btn v-bind=" props " color="error" icon="mdi-play-pause" size="small"
                                    @click=" stop( project ) " :loading=" loading " :disabled=" loading "></v-btn>
                            </template>
                        </v-tooltip>
                        <!-- <v-tooltip location="start" text="Delete">
                        <template v-slot:activator=" { props } ">
                            <v-btn v-bind=" props " color="error" icon="mdi-delete-alert-outline" size="small"
                                @click=" deleteProject( tech.id ) " :loading=" loading " :disabled=" loading "></v-btn>
                        </template>
                    </v-tooltip> -->
                    </v-row>
                </td>
            </tr>
        </tbody>
    </v-table>

    <div class="text-center">
        <v-container>
            <v-row justify="center">
                <v-col cols="8">
                    <v-container class="max-width">
                        <v-pagination v-model=" page " class="my-4" :length=" totalPage " @click="getData"
                            :loading=" loading " :disabled=" loading "></v-pagination>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
    </div>
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
            page: 1,
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
                } ).catch( ( response ) => {
                    this.error = response.data
                } )
            this.loading = false
        },

        async deploy ( project ) {
            this.loading = true
            this.error = null

            if ( project.type == 'NodeJs' ) {
                await axios.post( controlService + 'frontend/create-nodejs', {
                    id: project.id,
                    username: project.student.user.username,
                    sourceCode: project.sourceCode,
                    runtimeVersion: project.runtimeVersion
                } )
                    .then( ( response ) => {
                        this.activate( project.id, response.data.url )
                    } )
                    .catch( ( response ) => {
                        this.error = response.data
                        this.loading = false
                    } )
            } else if ( project.type == 'WebStatic' ) {
                await axios.post( controlService + 'frontend/create-webstatic', {
                    id: project.id,
                    username: project.student.user.username,
                    sourceCode: project.sourceCode,
                } )
                    .then( ( response ) => {
                        this.activate( project.id, response.data.url )
                    } )
                    .catch( ( response ) => {
                        this.error = response.data
                        this.loading = false
                    } )
            } else { this.error = "App type is missing" }
        },

        async activate ( id, url ) {
            this.loading = true
            await axios.patch( projectService + 'admin/activate-project', {
                id: id,
                url: url
            } ).then( () => this.getData() )
                .catch( ( response ) => {
                    this.error = response.data
                } )
            this.loading = false
        },

        async update ( project ) {
            this.loading = true
            this.error = null

            if ( project.type == 'NodeJs' ) {
                await axios.post( controlService + 'frontend/update-nodejs', {
                    id: project.id,
                    username: project.student.user.username,
                    sourceCode: project.sourceCode,
                    runtimeVersion: project.runtimeVersion
                } )
                    // .then( ( response ) => {
                    //     this.activate( project.id, response.data.url )
                    // } )
                    .catch( ( response ) => {
                        this.error = response.data
                        this.loading = false
                    } )
            } else if ( project.type == 'WebStatic' ) {
                await axios.post( controlService + 'frontend/update-webstatic', {
                    id: project.id,
                    username: project.student.user.username,
                    sourceCode: project.sourceCode,
                } )
                    // .then( ( response ) => {
                    //     this.activate( project.id, response.data.url )
                    // } )
                    .catch( ( response ) => {
                        this.error = response.data
                        this.loading = false
                    } )
            } else { this.error = "App type is missing" }
        },

        async stop ( project ) {
            this.loading = true
            await axios.post( controlService + 'frontend/stop', {
                id: project.id,
            } )
                // .then( () => this.getData() )
                .catch( ( response ) => {
                    this.error = response.data
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
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
        <p>{{ error }}</p>
        <tbody>
            <tr v-for=" project  in data" :key=" project.id ">
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
                    <v-menu open-on-hover location="start">
                        <template v-slot:activator=" { props } ">
                            <v-btn :color=" project.isActive ? 'success' : 'error' " v-bind=" props ">
                                {{ project.isActive ? "Active" : "Inactive" }}
                            </v-btn>
                        </template>

                        <v-list v-if=" project.isActive ">
                            <v-list-item v-if=" project.type == 'NodeJs' || project.type == 'WebStatic' "
                                @click=" update( project ) ">
                                <v-icon icon="mdi-update"></v-icon> Update
                            </v-list-item>
                            <v-list-item v-if=" project.type == 'NodeJs' || project.type == 'WebStatic' "
                                @click=" stop( project ) ">
                                <v-icon icon="mdi-play-pause"></v-icon> Stop
                            </v-list-item>
                            <v-list-item v-if=" project.type == 'NodeJs' || project.type == 'WebStatic' "
                                @click=" start( project ) ">
                                <v-icon icon="mdi-play"></v-icon> Start
                            </v-list-item>
                        </v-list>

                        <v-list v-else>
                            
                            <v-list-item
                                v-if=" ( project.type == 'NodeJs' || project.type == 'WebStatic' ) && !project.isActive "
                                @click=" deploy( project ) ">
                                <v-icon icon="mdi-bookmark-check-outline"></v-icon> Deploy Application
                            </v-list-item>
                            
                            <v-list-item v-else @click=" activate( project.id, project.url || null ) ">
                                <v-icon icon="mdi-bookmark-check-outline"></v-icon> Activate
                            </v-list-item>
                        </v-list>
                    </v-menu>
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

import { API } from "aws-amplify"

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

            await API.get( 'etapens', '/admin/list-project', {
                queryStringParameters: query
            } )
                .then( result => {
                    this.data = result.data
                    this.totalPage = result.totalPage
                } ).catch( error => this.error = error )
            this.loading = false
        },

        async deploy ( project ) {
            this.loading = true
            this.error = null

            if ( project.type == 'NodeJs' ) {
                await API.post( 'etapens', '/frontend/create-nodejs', {
                    body: {
                        id: project.id,
                        username: project.student.user.username,
                        sourceCode: project.sourceCode,
                        runtimeVersion: project.runtimeVersion
                    }
                } )
                    .then( ( result ) => {
                        this.activate( project.id, result.url )
                    } )
                    .catch( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
            } else if ( project.type == 'WebStatic' ) {
                await API.post( 'etapens', '/frontend/create-webstatic', {
                    body: {
                        id: project.id,
                        username: project.student.user.username,
                        sourceCode: project.sourceCode,
                    }
                } )
                    .then( ( result ) => {
                        this.activate( project.id, result.url )
                    } )
                    .catch( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
            } else { this.error = "App type is missing" }
        },

        async activate ( id, url ) {
            this.loading = true
            await API.patch( 'etapens', '/admin/activate-project', {
                body: {
                    id: id,
                    url: url
                }
            } ).then( () => this.getData() )
                .catch( ( result ) => {
                    this.error = result
                } )
            this.loading = false
        },

        async start ( project ) {
            this.loading = true
            this.error = null

            if ( project.type == 'NodeJs' ) {
                await API.post( 'etapens', '/frontend/start-nodejs', {
                    body: {
                        id: project.id,
                        username: project.student.user.username,
                        runtimeVersion: project.runtimeVersion
                    }
                } )
                    .then( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
                    .catch( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
            } else if ( project.type == 'WebStatic' ) {
                await API.post( 'etapens', '/frontend/start-webstatic', {
                    body: {
                        id: project.id,
                        username: project.student.user.username,
                    }
                } )
                    .then( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
                    .catch( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
            } else { this.error = "App type is missing" }
        },

        async update ( project ) {
            this.loading = true
            this.error = null

            if ( project.type == 'NodeJs' ) {
                await API.post( 'etapens', '/frontend/update-nodejs', {
                    body: {
                        id: project.id,
                        username: project.student.user.username,
                        sourceCode: project.sourceCode,
                        runtimeVersion: project.runtimeVersion
                    }
                } )
                    .then( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
                    .catch( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
            } else if ( project.type == 'WebStatic' ) {
                await API.post( 'etapens', '/frontend/update-webstatic', {
                    body: {
                        id: project.id,
                        username: project.student.user.username,
                        sourceCode: project.sourceCode,
                    }
                } )
                    .then( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
                    .catch( ( result ) => {
                        this.error = result
                        this.loading = false
                    } )
            } else { this.error = "App type is missing" }
        },

        async stop ( project ) {
            this.loading = true
            await API.post( 'etapens', '/frontend/stop', {
                body: {
                    id: project.id,
                }
            } )
                .then( ( result ) => {
                    this.error = result
                    this.loading = false
                } )
                .catch( ( result ) => {
                    this.error = result
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
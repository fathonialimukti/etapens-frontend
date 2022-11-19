<template>
    <div class="container card bg-slate-200 mx-auto px-4 sm:px-8">
        <div class="py-8">
            <div>
                <h2 class="text-2xl font-semibold leading-tight">List Projects</h2>
            </div>
            <div class="my-2 flex sm:flex-row flex-col">
                <div class="flex flex-row mb-1 sm:mb-0">
                    <div class="relative">
                        <select v-model=" itemPerPage " @change=" getData "
                            class="appearance-none h-full rounded-l border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option selected>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    <div class="relative">
                        <select v-model=" isActive " @change=" getData "
                            class="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                            <option selected>All</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="block relative">
                    <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
                            <path
                                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                            </path>
                        </svg>
                    </span>
                    <input placeholder="Search by name" v-model=" name " @change=" getData "
                        class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
                </div>
            </div>

            <p>{{ error }}</p>
            <progress v-if=" isLoading " class="progress w-full"></progress>
            <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table class="table-auto">
                        <thead>
                            <tr>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Judul
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Mahasiswa
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Tipe
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="                                        project                                        in data"
                                :key=" project ">
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div class="flex items-center">
                                        <div class="ml-3">
                                            <router-link :to=" { name: 'Project', params: { title: project.title } } "
                                                class="flex flex-wrap target=" target="_blank">
                                                <h2 class="font-semibold text-slate-900">
                                                    {{ project.title }}
                                                </h2>
                                            </router-link>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p class="text-gray-900 whitespace-no-wrap">{{ project.student.name }}</p>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p class="text-gray-900 whitespace-no-wrap">{{ project.type }}</p>
                                    <a v-if=" project.type == 'NodeJs' " :href=" project.sourceCode " target="_blank"
                                        class="btn btn-xs ml-2 btn-warning transition ease-in-out duration-200 hover:shadow-xl hover:scale-105">Repository</a>

                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button v-if=" project.type != 'Generals' && !project.isActive "
                                        @click=" deploy( project ) "
                                        class="btn btn-xs ml-2 btn-error transition ease-in-out duration-200 hover:shadow-xl hover:scale-105">
                                        Deploy
                                    </button>
                                    <span v-else-if=" project.isActive "
                                        class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                        <span aria-hidden
                                            class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                        <span class="relative">Active</span>
                                    </span>
                                    <button v-else @click=" activate( project.id ) "
                                        class="btn btn-xs ml-2 btn-error transition ease-in-out duration-200 hover:shadow-xl hover:scale-105">
                                        Activate
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div
                        class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                        <span class="text-xs xs:text-sm text-gray-900">
                            Showing page {{ page }} of {{ totalPage }}
                        </span>
                        <div class="inline-flex mt-2 xs:mt-0">
                            <button
                                class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                                Prev
                            </button>
                            <button
                                class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import { controlService, projectService } from "../../constant/endpoint"

export default {
    data () {
        return {
            data: undefined,
            itemPerPage: "25",
            totalPage: null,
            page: null,
            name: null,
            role: "Student",
            isActive: "All",
            isLoading: false,
            error: null
        }
    },
    beforeMount () {
        this.getData()
    },
    methods: {
        async getData () {
            this.isLoading = true
            const query = {}
            if ( this.itemPerPage ) query.itemPerPage = this.itemPerPage
            if ( this.name ) query.name = this.name
            if ( this.isActive ) query.isActive = this.isActive

            await axios.get( projectService + 'admin/list-project', {
                params: query
            } )
                .then( ( response ) => {
                    this.data = response.data.data
                    this.totalPage = response.data.totalPage
                } )
            this.isLoading = false
        },

        async deploy ( project ) {
            this.isLoading = true
            this.error = null

            await axios.post( controlService + 'project', {
                username: project.student.user.username,
                sourceCode: project.sourceCode,
                port: project.port.number
            } )
                .then( ( response ) => {
                    console.log( response )
                    this.activate( project.id )
                } )
                .catch( ( error ) => {
                    this.error = error
                    this.isLoading = false
                } )
        },

        async activate ( id ) {
            this.isLoading = true
            await axios.patch( projectService + 'admin/activate-project', {
                id: id,
            } ).then( () => this.getData() )
                .catch( ( error ) => {
                    this.error = error
                } )
            this.isLoading = false
        }
    }
}
</script>

<style>

</style>
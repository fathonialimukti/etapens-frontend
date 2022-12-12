<template>
    <div class="grid md:grid-cols-7 gap-2">
        <v-select v-model=" itemPerPage " label="Item per Page" class="md:col-span-2" :items=" [ 12, 25, 50 ] "
            prepend-inner-icon="mdi-format-list-numbered" />
        <v-text-field v-model=" searchName " label="Name" class="md:col-span-5"
            prepend-inner-icon="mdi-book-search-outline" @input=" getData " />
    </div>
    <v-text-field v-model=" createNewTech " label="Create" append-inner-icon="mdi-creation"
        @click:append-inner=" create " v-on:keyup.enter=" create " />
    <v-table fixed-header>
        <thead>
            <tr>
                <th class="text-left">
                    <h1 class=" font-bold text-lg">Name</h1>
                </th>

                <th class="text-right">
                    <h1 class=" font-bold text-lg">Action</h1>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for=" tech in data" :key=" tech.id ">
                <td>
                    {{ tech.name }}
                </td>
                <td class="text-right">
                    <v-tooltip text="Delete">
                        <template v-slot:activator=" { props } ">
                            <v-btn v-bind=" props " color="error" icon="mdi-delete-alert-outline" size="small"
                                @click=" deleteTech( tech.id ) " :loading="loading" :disabled="loading"></v-btn>
                        </template>
                    </v-tooltip>
                </td>
            </tr>
        </tbody>
    </v-table>
    <div class="text-center">
        <v-container>
            <v-row justify="center">
                <v-col cols="8">
                    <v-container class="max-width">
                        <v-pagination v-model=" page " class="my-4" :length=" totalPage " @click=" getData "></v-pagination>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from "axios"
import { projectService } from "../../constant/endpoint"

export default {
    data () {
        return {
            data: null,
            itemPerPage: 25,
            totalPage: null,
            page: 1,
            searchName: null,
            isActive: "All",
            createNewTech: null,
            error: null
        }
    },
    beforeMount () {
        this.getData()
    },
    methods: {
        getData () {
            const query = {}
            if ( this.itemPerPage ) query.itemPerPage = this.itemPerPage
            if ( this.searchName ) query.name = this.searchName
            if ( this.page ) query.page = this.page

            axios.get( projectService + 'admin/list-research-method', {
                params: query
            } ).then( response => {
                this.data = response.data.data
                this.totalPage = response.data.totalPage
            } )
        },
        create () {
            axios.post( projectService + 'admin/create-research-method', {
                name: this.createNewTech
            } ).then( () => this.getData() )
                .catch( ( error ) => {
                    this.error = error
                } )
        },
        deleteTech ( id ) {
            axios.delete( projectService + 'admin/delete-research-method', {
                data: { id: id }
            } ).then( () => this.getData() )
                .catch( ( error ) => {
                    this.error = error
                } )
        }
    },
    watch: {
        itemPerPage () {
            this.getData()
        }
    },
}
</script>

<style>

</style>
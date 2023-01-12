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
    <p>{{ error }}</p>
        <tbody>
            <tr v-for="researchField in data" :key=" researchField.id ">
                <td>
                    {{ researchField.name }}
                </td>
                <td class="text-right">
                    <v-tooltip text="Delete">
                        <template v-slot:activator=" { props } ">
                            <v-btn v-bind=" props " color="error" icon="mdi-delete-alert-outline" size="small"
                                @click=" deleteTech( researchField.id ) " :loading=" loading "
                                :disabled=" loading "></v-btn>
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
                        <v-pagination v-model=" page " class="my-4" :length=" totalPage "
                            @click=" getData "></v-pagination>
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
        async getData () {
            const query = {}
            if ( this.itemPerPage ) query.itemPerPage = this.itemPerPage
            if ( this.searchName ) query.name = this.searchName
            if ( this.page ) query.page = this.page

            await API.get( 'etapens', '/admin/list-research-field', {
                queryStringParameters: query
            } ).then( result => {
                this.data = result.data
                this.totalPage = result.totalPage
            } )
        },
        async create () {
            await API.post( 'etapens', '/admin/create-research-field', {
                body: { name: this.createNewTech }
            } ).then( () => this.getData() )
                .catch( ( error ) => {
                    this.error = error
                } )
        },
        async deleteTech ( id ) {
            await API.del( 'etapens', '/admin/delete-research-field', {
                body: { id: id }
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
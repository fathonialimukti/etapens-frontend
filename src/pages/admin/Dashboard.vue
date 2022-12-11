<template>
    <div class="grid md:grid-cols-7 gap-2">
        <v-select v-model=" itemPerPage " label="Item per Page" class="md:col-span-2" :items=" [ 12, 25, 50 ] "
            prepend-inner-icon="mdi-format-list-numbered" />
        <v-text-field v-model=" email " label="Email" class="md:col-span-5" @input=" getData "
            prepend-inner-icon="mdi-book-search-outline" />
    </div>
    <v-card-title>Total User: {{totalUser}}</v-card-title>
    <v-table fixed-header>
        <thead>
            <tr>
                <th class="text-left">
                    <h1 class=" font-bold text-lg">Username</h1>
                </th>
                <th class="text-left">
                    <h1 class=" font-bold text-lg">Email</h1>
                </th>
                <th class="text-left">
                    <h1 class=" font-bold text-lg">Role</h1>
                </th>
                <th class="text-right">
                    <h1 class=" font-bold text-lg">Grant Admin</h1>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for=" user in data" :key=" user.id ">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td class="text-right">
                    <v-tooltip text="Grant Admin Roles">
                        <template v-slot:activator=" { props } ">
                            <v-btn v-bind=" props " color="warning" icon="mdi-account-tie-hat" size="small"
                                @click=" grantAdmin( user.id ) " :loading=" loading " :disabled=" loading "></v-btn>
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
import axios from "axios"
import { projectService } from "../../constant/endpoint"

export default {
    data () {
        return {
            data: undefined,
            itemPerPage: 25,
            totalPage: null,
            totalUser: null,
            page: null,
            email: null,
            role: "Student",
            isActive: "All"
        }
    },
    beforeMount () {
        this.getData()
    },
    methods: {
        getData () {
            const query = {}
            if ( this.itemPerPage ) query.itemPerPage = this.itemPerPage
            if ( this.email ) query.email = this.email
            if ( this.page ) query.page = this.page

            axios
                .get( projectService + 'admin/list-user', {
                    params: query
                } )
                .then( response => {
                    this.data = response.data.data
                    this.totalUser = response.data.totalUser
                    this.totalPage = response.data.totalPage
                } )
        },
        grantAdmin ( id ) {
            axios.patch( projectService + 'admin/grant-admin', {
                id: id
            } )
                .then( () => this.getData() )
                .catch( function ( error ) {
                    console.log( error )
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
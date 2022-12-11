<template>
    <v-form ref="form" v-model=" isValid " lazy-validation>
        <v-text-field v-model=" database.name " label="Database Name" required
            :rules=" [ v => !!v || 'Name is required',v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed' ]">
        </v-text-field>
        <v-text-field v-model=" database.username " label="Database user name" required
            :rules=" [ v => !!v || 'Name is required',v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed' ] ">
        </v-text-field>
        <v-text-field v-model=" database.password " label="Database user password" required
            :rules=" [ v => v.match( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/ ) || 'a password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special' ] ">
        </v-text-field>
        <v-textarea v-model=" database.description " label="Description" required
            :rules=" [ v => !!v || 'Description is required' ] "></v-textarea>

        <v-select v-model=" database.type " :items=" dbList " :rules=" [ v => !!v || 'Database type is required' ] "
            label="Database type" required></v-select>

        <v-checkbox v-model=" checkbox " :rules=" [ v => !!v || 'You must agree to continue!' ] "
            label="Apakah data sudah benar?" required></v-checkbox>

        <v-btn color="success" class="mr-4" @click=" validate " :loading="loading" :disabled="loading">
            Submit
        </v-btn>
    </v-form>
</template>

<script>
import axios from 'axios'
import { projectService } from '../../constant/endpoint'
import useAuthStore from '../../stores/auth'

const store = useAuthStore()

export default {
    data () {
        return {
            error: null,
            isValid: null,
            database: {
                type: null,
                name: null,
                username: null,
                password: null,
                description: null,
                studentId: store.user.studentAccount.id
            },
            dbList: [
                'postgresql',
                'mysql'
            ],
            checkbox: false,
            loading: false,
        }
    },
    methods: {
        async validate () {
            const { valid } = await this.$refs.form.validate()

            if ( valid ) this.submit()
            else return
        },

        async submit () {
            this.loading = true
            await axios.post(
                projectService + "student/database",
                this.database,
            )
                .catch( ( response ) => {
                    this.error = response.message
                } )

            if ( this.error ) {
                this.loading = false
                return
            }
            this.$router.push( { name: 'Student Dashboard' } )
        },
    }
}
</script>
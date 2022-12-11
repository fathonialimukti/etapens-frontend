<template lang="">
    <v-form ref="form" v-model=" isValid " lazy-validation>
        <v-text-field v-model=" backend.sourceCode " label="Repository link" required
            :rules=" linkValidation" prepend-icon="mdi-git"/>

        <v-autocomplete label="Versi Node js" v-model=" backend.runtimeVersion "
            :items=" [ '16', '18' ] " :rules=" [ v => !!v || 'Node version is Required' ] "
            prepend-icon="mdi-nodejs" />

        <v-textarea v-model=" backend.description " label="Description" required prepend-icon="mdi-sticker-text-outline"
            :rules=" [ v => !!v || 'Description is required' ] "></v-textarea>

        <v-checkbox v-model=" checkbox " :rules=" [ v => !!v || 'You must agree to continue!' ] "
            label="Apakah data sudah benar?" required></v-checkbox>

        <p>{{error}}</p>

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
            backend: {
                description: null,
                sourceCode: null,
                studentId: store.user.studentAccount.id,
                runtimeVersion: null
            },
            findPort: null,
            portList: [],
            checkbox: false,
            linkValidation: [
                v => !!v || 'Provide SourceCode',
                // v => v.match( '^(https?:\\/\\/)?' + // validate protocol
                //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
                //     '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
                //     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
                //     '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
                //     '(\\#[-a-z\\d_]*)?$', 'i' )
                //     || 'Link is not valid',
            ],
            loading: false
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
            this.error = false

            await axios.post(
                projectService + "student/backend",
                this.backend,
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
    },
}
</script>
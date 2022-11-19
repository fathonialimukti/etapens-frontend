<template lang="">
    <div class="card bg-slate-200 p-4">
        <div class="bg-white p-3 rounded-lg max-w-xl w-screen">
            <FormKit type="form" id="project" submit-label="Register" @submit="submit" :actions="false" #default="{ value }" :config="{ preserveErrors: true }">
                <h1>Request Database!</h1>
                <br />
                
                <FormKit type="select" name="type" label="Tipe Database" validation="required" :options="{mysql: 'MySQL', postgres: 'PostgreSQL'}"/>
                <FormKit type="text" name="name" label="Nama Database" validation="required" />
                <FormKit type="text" name="username" label="username" validation="required" />
                <div class="double">
                    <FormKit
                        type="password"
                        name="password"
                        label="Password"
                        validation="required|length:6|matches:/[^a-zA-Z]/"
                        :validation-messages="{
                        matches: 'Please include at least one symbol',
                        }"
                        placeholder="Your password"
                        help="Choose a password"
                    />
                    <FormKit
                        type="password"
                        name="password_confirm"
                        label="Confirm password"
                        placeholder="Confirm password"
                        validation="required|confirm"
                        help="Confirm your password"
                    />
                </div>
                <FormKit type="textarea" name="description" label="Deskripsi Database" validation="required" />
                <FormKit type="submit" />
                <pre wrap>{{ status }}</pre>
            </FormKit>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { projectService } from '../../constant/endpoint'
import useAuthStore from '../../stores/auth'
import VueMultiselect from 'vue-multiselect'

export default {
    components: { VueMultiselect },
    data () {
        return {
            status: null,
            store: useAuthStore(),
        }
    },
    methods: {
        async submit ( database ) {
            database.studentId = this.store.user.studentAccount.id
            delete database.password_confirm
            await axios.post(
                projectService + "student/database",
                database,
            )
                .then( ( response ) => {
                    this.status = response.message
                } )
                .catch( ( response ) => {
                    this.status = response.message
                    return
                } )

            this.$router.push( { name: 'Student Dashboard' } )
        },
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css">

</style>
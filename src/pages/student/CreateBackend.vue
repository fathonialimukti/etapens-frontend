<template lang="">
    <div class="card bg-slate-200 p-4">
        <div class="bg-white p-3 rounded-lg">
            <FormKit type="form" id="project" submit-label="Register" @submit="submit" :actions="false" #default="{ value }" :config="{ preserveErrors: true }">
                <FormKit type="textarea" name="description" label="Deskripsi" validation="" />
                <FormKit type="url" name="sourceCode" label="Sumber data" help="Link github"  validation="required|url" />
                
                <VueMultiselect v-model=" port " :options=" portList " :multiple=" false " :searchable="true" @search-change=" findPort " placeholder="Cari port yang tersedia" label="number" track-by="number"/>
                <br/>
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
            port: null,
            portList: [],
        }
    },
    methods: {
        async submit ( backend ) {

            backend.studentId = this.store.user.studentAccount.id
            backend.port = this.port
            await axios.post( 
                projectService + "student/backend",
                backend,
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
        async findPort ( number ) {
            await axios.get(
                projectService + 'find-available-port',
                { params: { number } }
            )
                .then( ( response ) => {
                    this.portList = response.data
                    console.log(response.data,this.portList);
                } )
        },
    },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css">

</style>
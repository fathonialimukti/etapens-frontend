<template lang="">
    <div class="card bg-slate-200 p-4">
        <div class="bg-white p-3 rounded-lg max-w-xl w-screen">
            <FormKit type="form" id="project" submit-label="Register" @submit="submit" :actions="false" #default="{ value }" :config="{ preserveErrors: true }">
                <FormKit type="textarea" name="title" label="Judul Penelitian" validation="required" />
                <FormKit type="textarea" name="description" label="Deskripsi Singkat" validation="required" />
                <FormKit type="textarea" name="abstract" label="Penjelasan Lengkap" validation="required" />
                <FormKit type="text" name="video" label="Link Video Youtube" validation="required|url" /> 
                <FormKit type="select" name="type" label="Tipe Aplikasi" validation="required" :options="{Generals: 'Generals', NodeJs: 'Website Node Js', SelfHostedWeb: 'Website Self Hosted'}"/>
                
                <FormKit v-if="value.type == 'SelfHostedWeb'" type="text" name="url" label="Url Aplikasi" validation="url"/>  
                <FormKit v-if="value.type == 'NodeJs'" type="text" name="sourceCode" label="Sumber data" help="Link git. Pastikan repository dapat diakses public" validation="url"/>
                <p v-if="value.type == 'NodeJs'" class="py-4">Port</p>
                <VueMultiselect v-if="value.type == 'NodeJs'" v-model=" port " :options=" portList " :multiple=" false " :searchable="true" @search-change=" findPort " placeholder="Cari port yang tersedia" label="number" track-by="number"/>
                
                <p class="py-4">Dosen Pembimbing</p>
                <VueMultiselect v-model=" lecturers " :options="lecturerList" :multiple=" true " :searchable="true" @search-change="findLecturer" placeholder="Cari Nama" label="name" track-by="name"/>
                
                <p class="py-4">Teknologi yang digunakan</p>
                <VueMultiselect v-model=" tech " :options=" techList " :multiple=" true " :searchable="true" @search-change=" findTechList " placeholder="Cari Teknologi yang terdaftar" label="name" track-by="name" />

                <p class="py-4">Jenis Penelitian</p>
                <VueMultiselect v-model=" researchFields " :multiple=" true " :options=" researchFieldList " :searchable="true" @search-change=" findResearchField " placeholder="Cari Bidang Penelitian yang terdaftar"  label="name" track-by="name"  />

                <p class="py-4">Metode yang digunakan</p>
                <VueMultiselect v-model=" methods " :options=" methodList " :multiple=" true " :searchable="true" @search-change=" findMethod " placeholder="Cari Metode Penelitian yang terdaftar"  label="name" track-by="name"  />
                <br>

                <FormKit type="file" name="images" label="Gambar Hasil Akhir" validation="required" multiple/>
                <FormKit type="file" name="documents" label="Dokumen Penunjang" help="Buku TA dan Presentasi TA dalam bentuk pdf" validation="required" multiple accept=".pdf"/>
                
                <FormKit type="submit" />
                <pre wrap>{{ status }}</pre>
            </FormKit>
        </div>
    </div>
</template>
<script>
import { Storage } from 'aws-amplify'
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
            lecturers: null,
            lecturerList: [],
            tech: null,
            researchFields: null,
            methods: null,
            techList: [],
            researchFieldList: [],
            methodList: [],
            port: null,
            portList: [],
        }
    },
    methods: {
        async submit ( project ) {
            console.log( project )
            // project.student = {}
            // project.student.connect = { id: this.store.user.studentAccount.id }
            project.studentId = this.store.user.studentAccount.id
            console.log( project )

            project.tech = this.tech
            project.researchFields = this.researchFields
            project.methods = this.methods
            project.lecturers = this.lecturers
            project.port = this.port

            const documents = project.documents
            const images = project.images

            project.documents = []
            project.images = []

            const baseUrl = "https://etapens-storage140101-dev.s3.ap-southeast-1.amazonaws.com/public/"

            // validate project
            await axios( {
                method: "post",
                url: projectService + "student/project",
                data: project,
                headers: { "Content-Type": "application/json" },
            } )
                .then( ( response ) => {
                    this.status = response.message
                    project = response.data
                } )
                .catch( () => {
                    this.status = "Error"
                } )

            if ( this.status == "Error" ) return
            // upload
            for ( const index of images ) {
                const image = index.file
                await Storage.put( `${ this.store.user.username }/images/${ image.name }`, image, {
                    acl: "public-read",
                    contentType: image.type,
                    progressCallback: ( progress ) => {
                        this.status = `Uploaded: ${ progress.loaded }/${ progress.total }`
                    },
                    errorCallback: ( error ) => {
                        console.error( 'Unexpected error while uploading', error )
                        return false
                    },
                    completeCallback: ( event ) => {
                        this.status = `Successfully uploaded ${ event.key }`
                    },
                } )
                project.images.push( baseUrl + `${ this.store.user.username }/images/${ image.name.replace( / /g, "+" ) }` )
            };

            if ( this.status == "Error" ) return

            for ( const index of documents ) {
                const document = index.file
                await Storage.put( `${ this.store.user.username }/documents/${ document.name }`, document, {
                    acl: "public-read",
                    contentType: document.type,
                    progressCallback: ( progress ) => {
                        this.status = `Uploaded: ${ progress.loaded }/${ progress.total }`
                    },
                    errorCallback: ( error ) => {
                        this.status = 'Unexpected error while uploading' + error
                        return false
                    },
                    completeCallback: ( event ) => {
                        this.status = `Successfully uploaded ${ event.key }`
                    },
                } )
                project.documents.push( { "name": document.name, "url": baseUrl + `${ this.store.user.username }/documents/${ document.name.replace( / /g, "+" ) }` } )
            };

            if ( this.status == "Error" ) return

            // update project
            await axios( {
                method: "patch",
                url: projectService + "student/project",
                data: project,
                headers: { "Content-Type": "application/json" },
            } )
                .then( ( response ) => {
                    this.status = response.message
                } )
                .catch( () => {
                    this.status = "Error"
                } )

            if ( this.status == "Error" ) return

            this.$router.push( { name: 'Student Dashboard' } )
        },


        async findTechList ( search ) {
            await axios.get(
                projectService + 'find-tech-list',
                { params: { name: search } }
            )
                .then( ( response ) => {
                    this.techList = response.data
                } )
                .catch( ( response ) => {
                    this.techList[ 0 ] = response.error
                } )
        },
        async findResearchField ( search ) {
            await axios.get(
                projectService + 'find-research-field',
                { params: { name: search } }
            )
                .then( ( response ) => {
                    this.researchFieldList = response.data
                } )
                .catch( ( response ) => {
                    this.researchFieldList[ 0 ] = response.error
                } )
        },
        async findMethod ( search ) {
            await axios.get(
                projectService + 'find-research-method',
                { params: { name: search } }
            )
                .then( ( response ) => {
                    this.methodList = response.data
                } )
                .catch( ( response ) => {
                    this.methodList[ 0 ] = response.error
                } )
        },
        async findLecturer ( lecturerName ) {
            await axios.get(
                projectService + 'find-lecturer',
                { params: { name: lecturerName } }
            )
                .then( ( response ) => {
                    this.lecturerList = response.data
                } )
                .catch( ( response ) => {
                    this.lecturerList[ 0 ] = response.error
                } )
        },
        async findPort ( number ) {
            await axios.get(
                projectService + 'find-available-port',
                { params: { number } }
            )
                .then( ( response ) => {
                    this.portList = response.data
                    console.log( response.data, this.portList )
                } )
        },
    },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css">

</style>
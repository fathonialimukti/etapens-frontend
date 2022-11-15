<template lang="">
    <div class="card bg-slate-200 p-4">
        <div class="bg-white p-3 rounded-lg">
            <FormKit type="form" id="project" submit-label="Register" @submit="submit" :actions="false" #default="{ value }" :config="{ preserveErrors: true }">
                <FormKit type="textarea" name="title" label="Judul Penelitian" validation="" />
                <FormKit type="textarea" name="description" label="Deskripsi Singkat" validation="" />
                <FormKit type="textarea" name="abstract" label="Penjelasan Lengkap" validation="" />
                <FormKit type="text" name="video" label="Link Video Youtube" /> <!-- validation="|url"  -->
                <FormKit type="text" name="sourceCode" label="Sumber data" help="Link github atau google drive tempat hasil PA. Pastikan tidak akan dihapus" />     <!-- validation="|url"  -->
                <FormKit type="select" name="type" label="Tipe Aplikasi" validation="" :options="{Generals: 'Generals', StaticWeb: 'Website Static', SelfHostedWeb: 'Website Self Hosted'}"/>

                <p class="py-4">Dosen Pembimbing</p>
                <VueMultiselect v-model=" lecturers " :options="lecturerList" :multiple=" true " :searchable="true" @search-change="findLecturer" placeholder="Cari Nama" label="name" track-by="name"/>
                
                <p class="py-4">Teknologi yang digunakan</p>
                <VueMultiselect v-model=" tech " :options=" techList " :multiple=" true " :searchable="true" @search-change=" findTechList " placeholder="Cari Teknologi yang terdaftar" label="name" track-by="name" />

                <p class="py-4">Jenis Penelitian</p>
                <VueMultiselect v-model=" researchFields " :multiple=" true " :options=" researchFieldList " :searchable="true" @search-change=" findResearchField " placeholder="Cari Bidang Penelitian yang terdaftar"  label="name" track-by="name"  />

                <p class="py-4">Metode yang digunakan</p>
                <VueMultiselect v-model=" methods " :options=" methodList " :multiple=" true " :searchable="true" @search-change=" findMethod " placeholder="Cari Metode Penelitian yang terdaftar"  label="name" track-by="name"  />
                <br>

                <FormKit v-if="value.type == 'StaticWeb'" type="file" name="app" label="Folder Hasil Akhir Aplikasi" accept=".pdf" multiple webkitdirectory help="Nama folder bebas. Harus terdapat index.html di root"/>
                <FormKit v-if="value.type == 'SelfHostedWeb'" type="text" name="url" label="Url Aplikasi" validation="url"/>  

                <FormKit type="file" name="images" label="Gambar Hasil Akhir" validation="" multiple />
                <FormKit type="file" name="documents" label="Dokumen Penunjang" help="Buku TA dan Presentasi TA dalam bentuk pdf" validation="" multiple accept=".pdf"/>
                
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

            const documents = project.documents
            const images = project.images
            const app = project.app

            project.documents = []
            project.images = []
            delete project.app

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
                .catch( ( response ) => {
                    this.status = response.message
                    return
                } )

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
                        return
                    },
                    completeCallback: ( event ) => {
                        this.status = `Successfully uploaded ${ event.key }`
                    },
                } )
                project.images.push( baseUrl + `${ this.store.user.username }/images/${ image.name.replace( / /g, "+" ) }` )
            };

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
                        return
                    },
                    completeCallback: ( event ) => {
                        this.status = `Successfully uploaded ${ event.key }`
                    },
                } )
                project.documents.push( { "name": document.name, "url": baseUrl + `${ this.store.user.username }/documents/${ document.name.replace( / /g, "+" ) }` } )
            };

            if ( !!app ) {
                for ( const index of app ) {
                    const application = index.file
                    application.path = application.webkitRelativePath.split( "/" )
                    application.path.shift()
                    application.path = application.path.join( "/" )
                    await Storage.put( `${ this.store.user.username }/app/${ application.path }`, application, {
                        acl: "authenticated-read",
                        contentType: application.type,
                        progressCallback: ( progress ) => {
                            this.status = `Uploaded: ${ progress.loaded }/${ progress.total }`
                        },
                        errorCallback: ( err ) => {
                            this.status = 'Unexpected error while uploading', err
                            return
                        },
                        completeCallback: ( event ) => {
                            this.status = `Successfully uploaded ${ event.key }`
                        },
                    } )
                };

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
                    .catch( ( response ) => {
                        this.status = response.message
                        return
                    } )
            }

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
        }
    },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css">

</style>
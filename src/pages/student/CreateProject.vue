<template>
    <v-form ref="form" v-model=" isValid " lazy-validation>
        <v-text-field v-model=" project.title " label="Judul Tugas Akhir" :rules=" [ v => !!v || ' is Required' ] "
            prepend-icon="mdi-format-title" clearable />

        <v-textarea v-model=" project.description " label="Deskripsi atau Abstract"
             prepend-icon="mdi-sticker-text-outline" :rules=" [ v => !!v || 'Description is Required' ] " clearable />

        <v-autocomplete label="Dosen pembimbing" v-model=" project.lecturers " v-model:search=" search.lecturers "
            @input=" findLecturer " :items=" list.lecturers " item-title="name" :rules=" [ v => !!v || 'Lecturers list is Required', v => v.length < 4 || 'This maybe a mistake' ] "
            placeholder="Start typing then enter search" prepend-icon="mdi-human-male-board-poll" chips closable-chips
            return-object multiple hide-no-data hide-selected />

        <v-text-field v-model=" project.video " label="Video demo" :rules=" [ v => !!v || 'Video is Required' ] "
            prepend-icon="mdi-youtube" clearable />

        <v-autocomplete label="Tipe Aplikasi" v-model=" project.type "
            :items=" [ 'Generals', 'WebStatic', 'SelfHostedWeb', 'NodeJs' ] "
            :rules=" [ v => !!v || 'App type is Required' ] " prepend-icon="mdi-format-list-bulleted-type" />

        <v-autocomplete v-if=" project.type == 'NodeJs' " label="Versi Node js" v-model=" project.runtimeVersion "
            :items=" [ 16, 18 ] " :rules=" [ v => !!v || 'Node version is Required' ] "
            prepend-icon="mdi-nodejs" />

        <v-text-field v-if=" project.type == 'NodeJs' || project.type == 'WebStatic' " v-model=" project.sourceCode "
            label="Source Code" :rules=" [ v => !!v || 'Source Code is Required' ] " prepend-icon="mdi-git" clearable />

        <v-text-field v-if=" project.type == 'SelfHostedWeb' " v-model=" project.url "
            label="Url Aplikasi" :rules=" [ v => !!v || 'Url is Required' ] " prepend-icon="mdi-web" clearable />

        <v-autocomplete label="Teknologi yang digunakan" v-model=" project.tech " v-model:search=" search.tech "
            @input=" findTech " :items=" list.tech " item-title="name" :rules=" [ v => !!v || 'Tech is Required' ] "
            placeholder="Start typing then enter search" prepend-icon="mdi-tools" multiple chips closable-chips
            return-object hide-no-data hide-selected />

        <v-autocomplete label="Metode yang digunakan" v-model=" project.method " v-model:search=" search.method "
            @input=" findMethods " :items=" list.method " item-title="name" item-value="name"
            :rules=" [ v => !!v || 'Method is Required' ] " placeholder="Start typing then enter search"
            prepend-icon="mdi-tools" multiple chips closable-chips return-object hide-no-data hide-selected />

        <v-autocomplete label="jenis Penelitian" v-model=" project.researchField "
            v-model:search=" search.researchField " @input=" findResearchFields " :items=" list.researchField "
            item-title="name" :rules=" [ v => !!v || 'Reseach Fieldl is Required' ] "
            placeholder="Start typing then enter search" prepend-icon="mdi-focus-field" multiple chips closable-chips
            return-object hide-no-data hide-selected />

        <v-file-input type="file" v-model=" project.images " chips multiple label="Gambar hasil TA"
            :rules=" [ v => !!v || 'Images is Required' ] " prepend-icon="mdi-image-check-outline" />

        <v-file-input type="file" v-model=" project.documents " chips multiple label="Dokumen TA"
            :rules=" [ v => !!v || 'Documents is Required' ] " prepend-icon="mdi-file-document" />

        <v-checkbox v-model=" checkbox " :rules=" [ v => !!v || 'You must agree to continue!' ] "
            label="Apakah data sudah benar?" />

        <!-- Add loading state -->
        <p>{{ error }}</p>
        <p>{{ status }}</p>

        <v-btn color="success" class="mr-4" @click=" validate " :loading="loading" :disabled="loading">
            Submit
        </v-btn>
    </v-form>
</template>

<script>
import { Storage } from 'aws-amplify'
import axios from 'axios'
import { projectService } from '../../constant/endpoint'
import useAuthStore from '../../stores/auth'

const store = useAuthStore()
export default {
    data () {
        return {
            project: {
                title: null,
                studentId: store.user.studentAccount.id,
                description: null,
                lecturers: [],
                video: null,
                type: null,
                runtimeVersion: null,
                sourceCode: null,
                url: null,
                tech: [],
                method: [],
                researchField: [],
                documents: [],
                images: [],
            },
            search: {
                lecturers: null,
                tech: null,
                researchField: null,
                method: null,
            },
            list: {
                lecturers: [],
                tech: [],
                researchField: [],
                method: [],
            },
            status: null,
            error: null,
            loading: false,
            checkbox: false
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
            var project = this.project
            const documents = project.documents
            const images = project.images

            if ( !!project.video.includes( '=' ) ) project.video = project.video.split( '=' ).pop()
            else project.video = project.video.split( '/' ).pop()

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
                .catch( ( error ) => {
                    this.error = "Error:" + error
                } )

            if ( this.error ) {
                this.loading = false
                return
            }

            // upload
            for ( const image of images ) {
                await Storage.put( `${ store.user.username }/images/${ image.name }`, image, {
                    acl: "public-read",
                    contentType: image.type,
                    progressCallback: ( progress ) => {
                        this.status = `Uploaded: ${ progress.loaded }/${ progress.total }`
                    },
                    errorCallback: ( error ) => {
                        this.error = 'Unexpected error while uploading' + error
                    },
                    completeCallback: ( event ) => {
                        this.status = `Successfully uploaded ${ event.key }`
                    },
                } )
                project.images.push( baseUrl + `${ store.user.username }/images/${ image.name.replace( / /g, "+" ) }` )
            };

            if ( this.error ) {
                this.loading = false
                return
            }

            for ( const document of documents ) {
                await Storage.put( `${ store.user.username }/documents/${ document.name }`, document, {
                    acl: "public-read",
                    contentType: document.type,
                    progressCallback: ( progress ) => {
                        this.status = `Uploaded: ${ progress.loaded }/${ progress.total }`
                    },
                    errorCallback: ( error ) => {
                        this.error = 'Unexpected error while uploading' + error
                    },
                    completeCallback: ( event ) => {
                        this.status = `Successfully uploaded ${ event.key }`
                    },
                } )
                project.documents.push( { "name": document.name, "url": baseUrl + `${ store.user.username }/documents/${ document.name.replace( / /g, "+" ) }` } )
            };

            if ( this.error ) {
                this.loading = false
                return
            }

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
                .catch( (error) => {
                    this.error = error
                } )

            if ( this.error ) {
                this.loading = false
                return
            }

            this.$router.push( { name: 'Student Dashboard' } )
        },


        async findLecturer () {
            const name = this.search.lecturers
            await axios.get(
                projectService + 'find-lecturer',
                { params: { name } }
            )
                .then( ( response ) => {
                    this.list.lecturers = response.data
                } )
                .catch( ( response ) => {
                    this.list.lecturers[ 0 ] = response.error
                } )
        },
        async findTech () {
            const search = this.search.tech
            await axios.get(
                projectService + 'find-tech-list',
                { params: { name: search } }
            )
                .then( ( response ) => {
                    this.list.tech = response.data.data
                } )
                .catch( ( response ) => {
                    this.list.tech[ 0 ] = response.error
                } )
        },
        async findResearchFields () {
            const search = this.search.researchField
            await axios.get(
                projectService + 'find-research-field',
                { params: { name: search } }
            )
                .then( ( response ) => {
                    this.list.researchField = response.data.data
                } )
                .catch( ( response ) => {
                    this.list.researchField[ 0 ] = response.error
                } )
        },
        async findMethods () {
            const search = this.search.method
            await axios.get(
                projectService + 'find-research-method',
                { params: { name: search } }
            )
                .then( ( response ) => {
                    this.list.method = response.data.data
                } )
                .catch( ( response ) => {
                    this.list.method[ 0 ] = response.error
                } )
        },
    },
    mounted() {
        this.findLecturer()
        this.findMethods()
        this.findResearchFields()
        this.findTech()
    }
}
</script>
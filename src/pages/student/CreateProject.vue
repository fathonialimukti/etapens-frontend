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
                <VueMultiselect v-model=" lecturer " :options="lecturerList" :multiple=" true " :searchable="searchable" @search-change="asyncFind" placeholder="Cari Nama" label="name" track-by="name" />
                
                <p class="py-4">Teknologi yang digunakan</p>
                <VueMultiselect v-model=" tech " :options=" techList " :multiple=" true " :taggable=" true " @tag=" addTechList "
                tag-placeholder="Tambahkan" placeholder="Cari atau tambahkan" />

                <p class="py-4">Jenis Penelitian</p>
                <VueMultiselect v-model=" categories " :options=" categoryList " :taggable=" true " @tag=" addCategoryList "
                tag-placeholder="Tambahkan" placeholder="Cari atau tambahkan" />

                <p class="py-4">Metode yang digunakan</p>
                <VueMultiselect v-model=" methods " :options=" methodList " :multiple=" true " :taggable=" true "
                @tag=" addMethodList " tag-placeholder="Tambahkan" placeholder="Cari atau tambahkan" />
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
import { controlService, projectService } from '../../constant/endpoint'
import useAuthStore from '../../stores/auth'
import VueMultiselect from 'vue-multiselect'

export default {
    components: { VueMultiselect },
    data () {
        return {
            status: null,
            store: useAuthStore(),
            lecturer: null,
            lecturerList: [],
            tech: [],
            categories: null,
            methods: [],
            techList: [ 'php', 'mysql', 'laravel' ],
            categoryList: [ 'egov', 'karya cipta' ],
            methodList: [ 'fuzzy', 'lainnya' ],
        }
    },
    methods: {
        async submit ( project ) {
            console.log( project )
            project.student = {}
            project.student.connect = { id: this.store.user.studentAccount.id }

            project.tech = this.tech
            project.categories = this.categories
            project.method = this.method
            project.lecturer = this.lecturer

            const documents = project.documents
            const images = project.images
            const app = project.app

            project.documents = []
            project.images = []
            delete project.app

            const lowercased = project.tech.map( tech => tech.toLowerCase() )
            project.tech = lowercased

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
                    this.$router.push( { name: 'Student Dashboard' } )
                } )
                .catch( ( response ) => {
                    this.status = response.message
                    return
                } )
        },

        addTechList ( newTag ) {
            this.techList.push( newTag )
            this.tech.push( newTag )
        },
        addCategoryList ( newTag ) {
            this.categoryList.push( newTag )
            this.categories = newTag
        },
        addMethodList ( newTag ) {
            this.methodList.push( newTag )
            this.method.push( newTag )
        },

        async asyncFind ( lecturerName ) {
            await axios.get(
                projectService + 'find-lecturer',
                { params: { name: lecturerName } }
            )
                .then( ( response ) => {
                    this.lecturerList = response.data
                    console.log(response);
                } )
                .catch( ( response ) => {
                    this.lecturerList[0] = response.error
                } )
        }
    },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css">

</style>
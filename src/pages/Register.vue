<template>
    <div class="flex flex-wrap bg-slate-100 p-3 rounded-lg">
        <div class="w-full items-center">
            <div class="tabs">
                <a class="tab tab-lifted flex-auto" v-on:click="toggleTabs(1)"
                    v-bind:class="{'text-blue-600 bg-white': openTab !== 1, 'text-white bg-blue-600': openTab === 1}">
                    Mahasiswa
                </a>
                <a class="tab tab-lifted flex-auto" v-on:click="toggleTabs(2)"
                    v-bind:class="{'text-yellow-600 bg-white': openTab !== 2, 'text-white bg-yellow-600': openTab === 2}">
                    Dosen
                </a>
            </div>
            <div class="relative flex flex-col min-w-0 break-words bg-white mb-6 shadow-lg rounded w-96">
                <div class="px-4 py-5">
                    <div class="tab-content tab-space">
                        <div v-bind:class="{'hidden': openTab !== 1, 'block': openTab === 1}">
                            <FormKit type="form" id="registration" :form-class="submitted ? 'hide' : 'show'"
                                submit-label="Register" @submit="submitMahasiswa" :actions="false" #default="{ value }"
                                :config="{ preserveErrors: true }">
                                <hr />
                                <FormKit type="text" name="name" label="Nama" validation="required" />
                                <FormKit type="number" name="nrp" label="Nrp" validation="required" />
                                <FormKit type="textarea" name="bio" label="Bio" validation="required" />

                                <FormKit type="file" name="image" label="Foto" help="Hanya file dengan format jpg"
                                    validation="required" accept=".jpg" />

                                <FormKit type="submit" label="Register" />
                                <pre wrap>{{ status }}</pre>
                            </FormKit>
                        </div>
                        <div v-bind:class="{'hidden': openTab !== 2, 'block': openTab === 2}">
                            <FormKit type="form" id="registration" :form-class="submitted ? 'hide' : 'show'"
                                submit-label="Register" @submit="submitDosen" :actions="false" #default="{ value }"
                                :config="{ preserveErrors: true }">
                                <hr />
                                <FormKit type="text" name="name" label="Nama" validation="required" />
                                <FormKit type="number" name="nip" label="NIP" validation="required" />
                                <FormKit type="textarea" name="bio" label="Bio" validation="required" />

                                <FormKit type="file" name="image" label="Foto" help="Hanya file dengan format jpg"
                                    validation="required" accept=".jpg" />

                                <FormKit type="submit" label="Register" />
                                <pre wrap>{{ status }}</pre>
                            </FormKit>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import useAuthStore from '../stores/auth'
import { Storage } from 'aws-amplify'
import axios from 'axios'
import { projectService } from '../constant/endpoint'

const store = useAuthStore()
const studentAccount = {
    user: {
        connect: {
            id: store.user.id
        }
    }
}
const baseUrl = "https://etapens-storage140101-dev.s3.ap-southeast-1.amazonaws.com/public/"

export default {
    data () {
        return {
            openTab: 1,
            studentAccount,
            status: undefined
        }
    },
    methods: {
        toggleTabs ( tabNumber ) {
            this.openTab = tabNumber
        },
        async submitMahasiswa ( values ) {
            await this.upload( values.image[ 0 ] )

            values.image = baseUrl + store.user.username + '/profile.png'
            values.user = {}
            values.user.connect = { id: store.user.id }

            await axios( {
                method: "post",
                url: projectService + "student/create",
                data: values,
                headers: { "Content-Type": "application/json" },
            } )
                .then( ( response ) => {
                    this.status = response.message
                } )
                .catch( ( response ) => {
                    this.status = response.message
                } )

            this.$router.push( { name: 'Home' } )
        },
        async upload ( image ) {
            await Storage.put( `${ store.user.username }/profile.png`, image.file, {
                acl: "public-read",
                contentType: image.file.type,
                progressCallback: ( progress ) => {
                    this.status = `Uploaded: ${ progress.loaded }/${ progress.total }`
                },
                errorCallback: ( err ) => {
                    this.status = 'Unexpected error while uploading' + err
                },
                completeCallback: ( event ) => {
                    this.status = `Successfully uploaded ${ event.key }`
                },
            } )
        },
        async submitDosen ( values ) {
            await this.upload( values.image[ 0 ] )

            values.image = baseUrl + store.user.username + '/profile.png'
            values.user = {}
            values.user.connect = { id: store.user.id }

            await axios( {
                method: "post",
                url: projectService + "lecturer/create",
                data: values,
                headers: { "Content-Type": "application/json" },
            } )
                .then( ( response ) => {
                    this.status = response.message
                    this.$router.push( { name: 'Home' } )
                } )
                .catch( ( response ) => {
                    this.status = response.message
                } )

        },
    }
}
</script>
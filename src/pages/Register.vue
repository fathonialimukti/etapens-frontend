<template>
    <v-card>
        <v-tabs v-model=" tab " bg-color="primary" fixed-tabs>
            <v-tab value="Mahasiswa">Mahasiswa</v-tab>
            <v-tab value="Dosen">Dosen</v-tab>
        </v-tabs>

        <v-card-text>
            <v-window v-model=" tab ">
                <v-window-item value="Mahasiswa">
                    <v-form ref="form" v-model=" valid " lazy-validation>
                        <v-text-field v-model=" newStudent.name " :rules=" [ v => !!v || 'Name is required' ] " label="Nama"
                            required color="secondary" bg-color="amber-lighten-4"></v-text-field>

                        <v-text-field v-model=" newStudent.nrp " :rules=" [ v => !!v || 'Nrp is required' ] " label="NRP"
                            type="number" required color="secondary" bg-color="amber-lighten-4"></v-text-field>

                        <v-textarea v-model=" newStudent.bio " :rules=" [ v => !!v || 'Bio is required' ] " label="Bio"
                            required color="secondary" bg-color="amber-lighten-4">
                        </v-textarea>

                        <v-file-input v-model=" newStudent.image " label="Image" variant="filled"
                            prepend-icon="mdi-camera" color="secondary" bg-color="amber-lighten-4"></v-file-input>

                        <v-btn color="success" class="mr-4" @click=" submitMahasiswa ">
                            Submit
                        </v-btn>
                    </v-form>
                </v-window-item>

                <v-window-item value="Dosen">
                    <v-form ref="form" v-model=" valid " lazy-validation>
                        <v-text-field v-model=" newLecturer.name " :rules=" [ v => !!v || 'Name is required' ] " label="Nama" required
                            color="secondary" bg-color="amber-lighten-4"></v-text-field>
                    
                        <v-text-field v-model=" newLecturer.nip " :rules=" [ v => !!v || 'Nip is required' ] " label="Nip" type="number"
                            required color="secondary" bg-color="amber-lighten-4"></v-text-field>
                    
                        <v-textarea v-model=" newLecturer.bio " :rules=" [ v => !!v || 'Bio is required' ] " label="Bio" required
                            color="secondary" bg-color="amber-lighten-4">
                        </v-textarea>
                    
                        <v-file-input v-model=" newLecturer.image " label="Image" variant="filled" prepend-icon="mdi-camera" color="secondary" bg-color="amber-lighten-4"></v-file-input>
                    
                        <v-btn color="success" class="mr-4" @click=" submitDosen ">
                            Submit
                        </v-btn>
                    </v-form>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
</template>

<script>
import useAuthStore from '../stores/auth'
import { Storage } from 'aws-amplify'
import axios from 'axios'
import { projectService } from '../constant/endpoint'

const store = useAuthStore()
const baseUrl = "https://etapens-storage140101-dev.s3.ap-southeast-1.amazonaws.com/public/"

export default {
    data () {
        return {
            tab: null,
            status: undefined,
            newStudent: {
                name: null,
                nrp: null,
                bio: null,
                image: [],
                userId: store.user.id
            },
            newLecturer: {
                name: null,
                nip: null,
                bio: null,
                image: [],
                userId: store.user.id
            }
        }
    },
    methods: {
        async submitMahasiswa () {
            const { valid } = await this.$refs.form.validate()

            if ( !valid ) return

            await this.upload( this.newStudent.image[ 0 ] )

            this.newStudent.image = baseUrl + store.user.username + '/profile.png'

            await axios( {
                method: "post",
                url: projectService + "student/create",
                data: this.newStudent,
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
            await Storage.put( `${ store.user.username }/profile.png`, image, {
                acl: "public-read",
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
        async submitDosen () {
            const { valid } = await this.$refs.form.validate()

            if ( !valid ) return
            await this.upload( this.newLecturer.image[ 0 ] )

            this.newLecturer.image = baseUrl + store.user.username + '/profile.png'

            await axios( {
                method: "post",
                url: projectService + "lecturer/create",
                data: this.newLecturer,
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
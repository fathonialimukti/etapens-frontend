<template>
    <v-card>
        <v-tabs v-model=" tab " bg-color="primary" fixed-tabs>
            <v-tab value="Mahasiswa">Mahasiswa</v-tab>
            <v-tab value="Dosen">Dosen</v-tab>
        </v-tabs>

        <v-card-text>
            <v-window v-model=" tab ">
                <v-window-item value="Mahasiswa">
                    <v-form ref="form">
                        <v-text-field v-model=" newStudent.name " :rules=" [ v => !!v || 'Name is required' ] "
                            label="Nama" required color="secondary"></v-text-field>

                        <v-text-field v-model=" newStudent.nrp " :rules=" [ v => !!v || 'Nrp is required' ] "
                            label="NRP" type="number" required color="secondary"></v-text-field>

                        <v-textarea v-model=" newStudent.bio " :rules=" [ v => !!v || 'Bio is required' ] " label="Bio"
                            required color="secondary">
                        </v-textarea>

                        <v-file-input v-model=" imageFile " label="Image" variant="filled" prepend-icon="mdi-camera"
                            color="secondary" accept="image/*" show-size></v-file-input>

                        <v-btn color="success" class="mr-4" @click=" submitMahasiswa ">
                            Submit
                        </v-btn>
                    </v-form>
                </v-window-item>

                <v-window-item value="Dosen">
                    <v-form ref="form">
                        <v-text-field v-model=" newLecturer.name " :rules=" [ v => !!v || 'Name is required' ] "
                            label="Nama" required color="secondary"></v-text-field>

                        <v-text-field v-model=" newLecturer.nip " :rules=" [ v => !!v || 'Nip is required' ] "
                            label="Nip" type="number" required color="secondary"></v-text-field>

                        <v-textarea v-model=" newLecturer.bio " :rules=" [ v => !!v || 'Bio is required' ] " label="Bio"
                            required color="secondary">
                        </v-textarea>

                        <v-file-input v-model=" imageFile " label="Image" variant="filled" prepend-icon="mdi-camera"
                            color="secondary" accept="image/*"></v-file-input>

                        <v-btn color="success" class="mr-4" @click=" submitDosen ">
                            Submit
                        </v-btn>
                    </v-form>
                </v-window-item>
            </v-window>
        </v-card-text>
        <v-card-text>{{ status }}</v-card-text>
    </v-card>
</template>

<script>
import useAuthStore from '../stores/auth'
import { API, Storage, Auth } from 'aws-amplify'

const store = useAuthStore()
const baseUrl = 'https://pjj2022-fathoni-etapens-storage.s3.ap-southeast-1.amazonaws.com/public/'


export default {
    data () {
        return {
            tab: null,
            status: undefined,
            newStudent: {
                name: null,
                nrp: null,
                bio: null,
                image: baseUrl + store.user.username + '/profile.png',
                userId: store.user.id
            },
            newLecturer: {
                name: null,
                nip: null,
                bio: null,
                image: baseUrl + store.user.username + '/profile.png',
                userId: store.user.id
            },
            imageFile: null
        }
    },
    methods: {
        async submitMahasiswa () {
            await this.upload()
            // const { valid } = await this.$refs.form.validate()

            // if ( !valid ) return

            // await API.post( 'etapens', '/student/create', {
            //     body: this.newStudent
            // } )
            //     .then( async () => {
            //         console.log( "Success" );
            //         await this.upload()
            //     } )
            //     .catch( ( result ) => {
            //         console.log( "Error" );
            //         this.status = result.message
            //     } )
        },
        async upload () {
            const image = this.imageFile[ 0 ]
            await Storage.put( `${ store.user.username }/profile.png`, image, {
                acl: 'public-read',
                progressCallback: ( progress ) => {
                    this.status = `Uploaded: ${ progress.loaded }/${ progress.total }`
                },
                errorCallback: ( err ) => {
                    this.status = 'Unexpected error while uploading' + err
                },
                completeCallback: async ( event ) => {
                    this.status = `Successfully uploaded ${ event.key }`
                    await this.setAuth()
                },
            } )
        },
        async submitDosen () {
            const { valid } = await this.$refs.form.validate()

            if ( !valid ) return

            await API.post( 'etapens', '/lecturer/create', {
                body: this.newLecturer,
            } )
                .then( async () => {
                    await this.upload()
                } )
                .catch( ( result ) => {
                    this.status = result.message
                } )
        },
        async setAuth () {
            await API
                .post( 'etapens', '/get-user', {
                    body: {
                        username: store.user.username,
                        email: store.user.email
                    }
                } )
                .then( result => {
                    store.setUser( result )

                    this.$router.push( { name: 'Home' } )
                } )
        },
    }
}
</script>
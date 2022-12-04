<template>
    <v-menu rounded>
        <template v-slot:activator=" { props } ">
            <v-btn icon v-bind=" props ">
                <v-avatar size="large">
                    <v-img v-if=" store.user.studentAccount?.image || store.user.lecturerAccount?.image "
                        :src=" store.user.studentAccount?.image || store.user.lecturerAccount?.image "
                        :alt=" store.user.username "></v-img>
                    <span v-else class="text-h5">{{ store.user.username[0] }}</span>
                </v-avatar>
            </v-btn>
        </template>
        <v-card>
            <v-card-text>
                <div class="mx-auto text-center">
                    <v-avatar size="large">
                        <v-img v-if=" store.user.studentAccount?.image || store.user.lecturerAccount?.image "
                            :src=" store.user.studentAccount?.image || store.user.lecturerAccount?.image "
                            :alt=" store.user.username "></v-img>
                        <span v-else class="text-h5">{{ store.user.username[0] }}</span>
                    </v-avatar>
                    <h3>{{ store.user.email }}</h3>
                    <v-divider class="my-3"></v-divider>

                    <v-btn v-if=" store.user.role == 'Admin'" rounded variant="text" @click=" $router.push( { name: 'Admin Dashboard' } ) ">
                        Dashboard
                    </v-btn>
                    <v-btn v-else-if=" store.user.role == 'Student' && store.user.studentAccount.isActive " rounded variant="text" @click=" $router.push( { name: 'Student Dashboard' } ) ">
                        Dashboard
                    </v-btn>
                    <v-btn v-else-if=" store.user.role == 'Lecturer' && store.user.lecturerAccount.isActive " rounded variant="text" @click=" $router.push( { name: 'Lecturer Dashboard' } ) ">
                        Dashboard
                    </v-btn>
                    <v-btn v-else rounded variant="text" color="error" @click=" $router.push( { name: 'Lecturer Dashboard' } ) ">
                        Inactive
                    </v-btn>

                    <v-divider class="my-3"></v-divider>
                    <v-btn rounded variant="text" @click=" signOut ">
                        Logout
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-menu>

</template>

<script>
import { useAuthenticator } from '@aws-amplify/ui-vue'
import useAuthStore from "../stores/auth"

export default {
    data () {
        return {
            store: useAuthStore(),
            auth: useAuthenticator()
        }
    },
    methods: {
        signOut () {
            this.auth.signOut()
            this.store.deleteUser()
        }
    }
}
</script>
import { defineStore } from "pinia"
import { useStorage } from '@vueuse/core'

const useAuthStore = defineStore( {
    id: "Auth",
    state: () => ( {
        user: useStorage( 'user', {} )
    } ),
    getters: {
        getUser: ( state ) => state.user,
        getUserId: ( state ) => state.user.id,
        getRole: ( state ) => state.user.role,
        getAccountId: ( state ) => state.user.studentAccount.id || state.user.lecturerAccount.id,
    },
    actions: {
        setUser ( user ) { this.user = user },
        deleteUser () { this.user = {} }
    }
} )

export default useAuthStore
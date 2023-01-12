<template >
    <div class="card bg-slate-100 divide-y divide-solid sm:ml-2 sm:mr-2 sm:p-4 p-1 mt-2 mb-10">
        <figure><img :src=" lecturer.image " :alt=" lecturer.image " class="h-96"></figure>

        <div class="card-actions justify-end">
            <button class="btn btn-primary">Edit Profile</button>
        </div>

        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-xl font-bold leading-6 text-gray-900">{{ lecturer.name }}</h3>
            <h4 class="text-xl font-bold leading-6 text-gray-900">{{ lecturer.nip }}</h4>
        </div>

        <div class="bg-gray-50 py-5 grid grid-cols-2 gap-4 px-6">
            <p class="text-lg font-medium">Bio</p>
            <p class=" text-gray-900 mt-0 col-span-2">{{ lecturer.bio }}</p>
        </div>

        <div class="bg-gray-50 py-5 grid grid-cols-2 gap-4 px-6">
            <dt class="text-lg font-medium">Daftar Bimbingan Tugas Akhir</dt>
            <dd class=" text-gray-900 mt-0 col-span-2">
                <ul role="list" class="border border-gray-200 rounded-md divide-y divide-gray-200">
                    <li class="pl-3 pr-4 py-3 flex items-center justify-between "
                        v-for="project in lecturer.project" :key=" project ">
                        <div class="w-0 flex-1 flex items-center">
                            <router-link :to=" { name: 'Project', params: { title: project.title } } ">
                                <span class="ml-2 flex-1 w-0 truncate text-black">
                                    {{ project.title }}
                                </span>
                                <p class="ml-2 text-black">{{ project.student.nrp }} - {{ project.student.name }}</p>
                            </router-link>
                        </div>
                    </li>
                </ul>
            </dd>
        </div>
    </div>
</template>
<script>
import { API } from 'aws-amplify'
import useAuthStore from '../../stores/auth'

export default {
    data () {
        return {
            lecturers: null,
            store: useAuthStore()
        }
    },
    async beforeMount () {
        await API
            .get( 'etapens', '/lecturer', { queryStringParameters: { id: this.store.user.lecturerAccount.id } } ) // 21 this.store.user.lecturerAccount.id
            .then( result => this.lecturer = result )
        console.log( this.lecturer )
    }
}
</script>
<style >

</style>

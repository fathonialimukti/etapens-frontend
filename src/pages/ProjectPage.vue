<template>
  <v-carousel show-arrows="hover" hide-delimiters>
    <v-carousel-item>
      <center class="h-full w-full">
        <iframe align-self="center" class="h-full aspect-video"
          :src=" ( 'https://www.youtube-nocookie.com/embed/' + project.video ) " title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </center>
    </v-carousel-item>
    <v-carousel-item v-for=" image  in project.images" :src=" image " :key=" image "></v-carousel-item>
  </v-carousel>

  <h1 class="font-bold text-4xl mt-5 antialiased md:subpixel-antialiased leading-relaxed">{{ project.title }}</h1>

  <v-btn variant="text" color="warning" class="mr-2" rounded="lg">Lihat Website</v-btn>
  <v-btn variant="text" color="warning" rounded="lg">Source Code</v-btn>

  <br />
  <br />
  <p>{{ project.description }}</p>
  <br />
  <div class="py-5 gap-4 px-6">
    <dt class="text-lg font-medium">Creator</dt>

    <div class="grid md:grid-cols-2  items-start text-left gap-3 m-2">

      <div class="flex-auto">
        <img :src=" project.student.image " :alt=" project.student.name " class="rounded-md bg-slate-100 max-h-60" />
      </div>

      <div class="min-w-0 relative flex-auto">
        <router-link :to=" { name: 'Student Profile', params: { name: project.student.name } } ">
          <h2 class="font-semibold text-slate-900 truncate pr-20">
            {{ project.student.name }}
          </h2>
        </router-link>

        <div>
          <div class="flex-none w-full mt-2 font-normal">
            <p class="text-slate-500">NRP: {{ project.student.nrp }}</p>
          </div>
          <div class="flex-none w-full mt-2 font-normal">
            <p class="">{{ project.student.bio }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="py-5 gap-4 px-6">
    <dt class="text-lg font-medium">Dosen Pembimbing</dt>

    <div class="grid md:grid-cols-2  items-start text-left gap-3 m-2"
      v-for="        lecturer        in project.lecturers">

      <div class="flex-auto">
        <img :src=" lecturer.image " :alt=" lecturer.name " class="rounded-md bg-slate-100 max-h-60" />
      </div>

      <div class="min-w-0 relative flex-auto">
        <router-link :to=" { name: 'Lecturer Profile', params: { name: lecturer.name } } ">
          <h2 class="font-semibold text-slate-900 truncate pr-20">
            {{ lecturer.name }}
          </h2>
        </router-link>

        <div>
          <div class="flex-none w-full mt-2 font-normal">
            <p class="text-slate-500">NRP: {{ lecturer.nip }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="py-5 grid grid-cols-2 gap-4 px-6">
    <dt class="text-lg font-medium">Attachments</dt>
    <dd class=" text-gray-900 mt-0 col-span-2">
      <ul role="list"
        class="border border-gray-200 rounded-md divide-y divide-gray-200 transition ease-in-out duration-200 hover:bg-white hover:shadow-xl hover:scale-105">

        <li v-for="        document        in project.documents" :key=" document "
          class="pl-3 pr-4 py-3 flex items-center justify-between ">
          <a :href=" document.url " target="_blank" class="w-0 flex-1 flex items-center text-black">
            <PaperClipIcon class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
            <span class="ml-2 flex-1 w-0 truncate"> {{ document.name }} </span>
          </a>
        </li>
      </ul>
    </dd>
  </div>
  <h2 class="card-title">Discussion</h2>
  <v-text-field v-model=" comment " label="Comment" append-inner-icon="mdi-comment"
    @click:append-inner=" postComment "></v-text-field>

  <v-list lines="one">
    <v-list-item v-for=" comment  in project.comments" :key=" comment.id " :title=" comment.username "
      :subtitle=" comment.comment "></v-list-item>
  </v-list>
</template>

<script>
import axios from "axios"
import { projectService } from "../constant/endpoint"
import useAuthStore from "../stores/auth"


export default {
  data () {
    return {
      project: {},
      store: useAuthStore(),
      comment: null
    }
  },
  beforeCreate () {
    axios
      .get( projectService + 'get-project', { params: { title: this.$route.params.title } } )
      .then( response => this.project = response.data )
  },
  methods: {
    postComment () {
      axios
        .post( projectService + 'post-comment', {
          id: this.project.id,
          username: this.store.user.username,
          comment: this.comment
        } )
      location.reload()
    }
  },

}
</script>

<style>

</style>
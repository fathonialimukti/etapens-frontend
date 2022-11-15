<template>
  <div class="sm:ml-2 sm:mr-2 sm:p-4 p-1 mt-2 mb-10">

    <carousel :items-to-show=" 1 " wrap-around="false">
      <template #slides>
        <slide v-for="          image           in project.images" :key=" image ">
          <div class="carousel__item"><img :src=" image " :alt=" image " class="h-96"></div>
        </slide>
        <slide>
          <div class="carousel__item">Hore</div>
        </slide>
      </template>
      <template #addons>
        <Navigation />
      </template>
    </carousel>

    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-xl font-bold leading-6 text-gray-900">{{ project.title }}</h3>
        <a v-if=" project.url " class="btn btn-warning btn-xs rounded-xl transition ease-in-out duration-200 hover:shadow-xl hover:scale-105" target="_blank" :href=" project.url ">Go to Site</a>

      <label for="video demo"
        class="btn btn-warning btn-xs rounded-xl transition ease-in-out duration-200 hover:shadow-xl hover:scale-105 ml-3">Video
        Demo</label>
      <input type="checkbox" id="video demo" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative max-w-fit max-h-fit">
          <label for="video demo" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <iframe class="w-full aspect-video" :src=" project.video " title="video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>

      <a v-if=" project.sourceCode " :href=" project.sourceCode " target="_blank"
        class="btn btn-xs ml-2 btn-warning text-black transition ease-in-out duration-200 hover:shadow-xl hover:scale-105">Sumber
        Data</a>
    </div>

    <div class="py-5 grid grid-cols-2 gap-4 px-6">
      <p class="text-lg font-medium">Abstract</p>
      <p class=" text-gray-900 mt-0 col-span-2">{{ project.abstract }}</p>
    </div>

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
          </div>
        </div>
      </div>
    </div>

    <div class="py-5 gap-4 px-6">
      <dt class="text-lg font-medium">Dosen Pembimbing</dt>

      <div class="grid md:grid-cols-2  items-start text-left gap-3 m-2"
        v-for="          lecturer           in project.lecturer">

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

          <li v-for="          document           in project.documents" :key=" document "
            class="pl-3 pr-4 py-3 flex items-center justify-between ">
            <a :href=" document.url " target="_blank" class="w-0 flex-1 flex items-center text-black">
              <PaperClipIcon class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
              <span class="ml-2 flex-1 w-0 truncate"> {{ document.name }} </span>
            </a>
          </li>
        </ul>
      </dd>
    </div>
  </div>


  <h2 class="card-title">Discussion</h2>
  <FormKit v-if=" store.user.username " type="form" id="registration" :form-class=" submitted ? 'hide' : 'show' "
    submit-label="Post Comment" @submit=" postComment " #default=" { value } " :config=" { preserveErrors: true } ">
    <FormKit type="textarea" name="comment" label="Comment" validation="required"/>
  </FormKit>

  <ul>
    <li v-for="    comment     in project.comments" :key=" comment ">
      <div class="card w-auto bg-base-100 shadow-sm card-compact m-1">
        <div class="card-body">
          <h2 class="card-title">{{ comment.username }}</h2>
          <p>{{ comment.comment }}</p>
        </div>
      </div>
    </li>
  </ul>

</template>

<script>
import axios from "axios"
import { projectService } from "../constant/endpoint"
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import useAuthStore from "../stores/auth"


export default {
  components: { Carousel, Slide, Navigation, Pagination },
  data () {
    return {
      project: null,
      store: useAuthStore()
    }
  },
  beforeMount () {
    axios
      .get( projectService + 'get-project', { params: { title: this.$route.params.title } } )
      .then( response => this.project = response.data )
  },
  methods: {
    postComment ( values ) {
      axios
        .post( projectService + 'post-comment', {
          id: this.project.id,
          username: this.store.user.username,
          comment: values.comment
        } )
      location.reload()
    }
  },

}
</script>

<style>

</style>
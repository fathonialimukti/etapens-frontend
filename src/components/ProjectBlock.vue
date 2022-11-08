<template>


  <div
    class="md:flex sm:grid items-start text-left text-black gap-3 m-2 p-2 border-solid border-2 border-blue-200 rounded-xl transition ease-in-out duration-200 hover:bg-white hover:shadow-xl hover:scale-105">

    <div class="flex-auto max-w-2xl md:max-w-xs">
      <img :src=" project.images[ 0 ] " alt="Project image" class="rounded-md bg-slate-100" />
    </div>

    <div class="min-w-0 relative flex-auto">
      <router-link :to=" { name: 'Project', params: { title: project.title } } ">
        <h2 class="font-semibold text-slate-900">
          {{ project.title }}
        </h2>
      </router-link>
      <dl class="mt-2 flex flex-wrap text-md leading-6 font-medium">
        <!-- <div class="absolute top-0 right-0 flex items-center space-x-1">
          <dt class="text-sky-500">
            <span class="sr-only">Star rating</span>
            <svg width="16" height="20" fill="currentColor">
              <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
            </svg>
          </dt>
          <dd>{{ project.starRating }}</dd>
        </div> -->
        <p>{{ project.description }}</p>
      </dl>

      <div>
        <div class="badge badge-outline mr-1 capitalize" v-for="  tech   in project.tech" :key=" tech ">{{ tech }}</div>
      </div>

      <div>
        <div class="flex-none w-full mt-2 font-normal">
          <p class="text-slate-500">{{ project.student.name }}</p>
        </div>
      </div>

      <button class="badge mr-1 btn-xs btn-warning">Document</button>
      <div class="badge mr-1 btn-xs btn-warning" v-if=" project.url "><a class="text-black" target="_blank"
          :href=" project.url ">Go to Site</a>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  props: [ "project" ],
  methods: {
    document () { console.log( "document clicked" ) },
    site () { console.log( "site clicked" ) }
  }
}
</script>

<style>

</style>
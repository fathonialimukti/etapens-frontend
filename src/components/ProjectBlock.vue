<template>


  <div
    class="grid grid-flow-row md:grid-flow-col md:flex md:flex-row text-left text-black gap-3 m-2 p-2 border-solid border-2 border-blue-200 rounded-xl transition ease-in-out duration-200 hover:bg-white hover:shadow-xl hover:scale-105">

    <div class="basis-1/4">
      <img :src=" project.images[ 0 ] " alt="Project image" class="rounded-md bg-slate-100 max-h-48" />
    </div>
    

    <div class="relative basis-3/4">
      <router-link :to=" { name: 'Project', params: { title: project.title } } ">
        <h2 class="font-semibold text-slate-900">
          {{ project.title }}
        </h2>
      </router-link>
      <dl class="mt-2 flex flex-wrap text-md leading-6 font-medium">
        <p>{{ project.description }}</p>
      </dl>

      <div>
        <div class="badge badge-outline mr-1 capitalize" v-for="    tech     in project.tech" :key=" tech ">{{ tech.name
        }}
        </div>
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
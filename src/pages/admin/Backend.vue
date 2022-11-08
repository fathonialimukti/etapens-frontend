<template>
  <button @click="getData()" class="btn btn-block">Refresh</button>
  <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-6">
            Name
          </th>
          <th scope="col" class="py-3 px-6">
            Nrp
          </th>
          <th scope="col" class="py-3 px-6">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in data" :key="user.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white">
            <img class="w-10 h-10 rounded-full" :src="user.image" alt="img">
            <div class="pl-3">
              <div class="text-base font-semibold">{{ user.name }}</div>
              <div class="font-normal text-gray-500">{{ user.email }}</div>
            </div>
          </th>
          <td class="py-4 px-6">
            {{ user.nrp }}
          </td>
          <td class="py-4 px-6">
            <button @click="activate(user._id)" class="btn btn-success btn-xs">activate</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data () {
    return { data: null }
  },
  beforeMount () {
    this.getData()
  },
  methods: {
    getData () {
      axios
        .get( 'http://localhost:4000/user/new' )
        .then( response => ( this.data = response.data ) )
    },
    activate ( userId ) {
      axios.post( 'http://localhost:4000/user/activate', {
        target: userId
      } )
        .then( function ( response ) {
          console.log( response )
        } )
        .catch( function ( error ) {
          console.log( error )
        } )
    }
  }
}
</script>

<style>

</style>
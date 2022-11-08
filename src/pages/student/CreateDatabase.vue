<template>
    <div class="card card-compact w-auto bg-base-100 shadow-xl">
        <div class="card-body">
            <h2 class="card-title">Request Database</h2>
            <!-- type, dbname, username, password -->
            <div class="form-control w-full max-w-xs">
                <label class="label"> <span class="label-text">Type</span> </label>
                <input :value="form.type" @input="event => form.type = event.target.value" type="text"
                    placeholder="Type" class="input input-info w-full max-w-xs" />

                <label class="label"> <span class="label-text">dbname</span> </label>
                <input :value="form.dbname" @input="event => form.dbname = event.target.value" type="text"
                    placeholder="dbname" class="input input-info w-full max-w-xs" />

                <label class="label"> <span class="label-text">Username</span> </label>
                <input :value="form.username" @input="event => form.username = event.target.value" type="text" placeholder="username"
                    class="input input-info w-full max-w-xs" />

                <label class="label"> <span class="label-text">password</span> </label>
                <input :value="form.password" @input="event => form.password = event.target.value" type="text" placeholder="password"
                    class="input input-info w-full max-w-xs" />
            </div>

            <div class="card-actions justify-end">
                <button @click="send" class="btn btn-primary">Create</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios"
import useAuthStore from "../../stores/auth"

export default {
    data () {
        return {
            form: {},
            store: useAuthStore()
        }
    },
    methods: {
        send () {
            let self = this
            this.form.user = this.store.user._id
            axios( {
                method: "post",
                url: "http://localhost:4000/project",
                data: this.form,
                headers: { "Content-Type": "application/json" },
                params: { type: 'database' }
            } )
                .then( function ( response ) {
                    if ( response.statusText == 'OK' ) self.$router.push( { name: 'User Dashboard' } )
                } )
                .catch( function ( response ) {
                    console.log( response )
                } )
        }
    },
}
</script>
<style>

</style>
<template>
    <div class="card card-compact w-auto bg-base-100 shadow-xl">
        <div class="card-body">
            <h2 class="card-title">Create new Backend</h2>
            <!-- appName, description, sourceCode -->
            <div class="form-control w-full max-w-xs">
                <label class="label"> <span class="label-text">Application Name</span> </label>
                <input :value="form.appName" @input="event => form.appName = event.target.value" type="text"
                    placeholder="appName" class="input input-info w-full max-w-xs" />

                <label class="label"> <span class="label-text">Description</span> </label>
                <input :value="form.description" @input="event => form.description = event.target.value" type="text"
                    placeholder="description" class="input input-info w-full max-w-xs" />

                <label class="label"> <span class="label-text">Source Code</span> </label>
                <input :value="form.sourceCode" @input="event => form.sourceCode = event.target.value" type="text"
                    placeholder="Source Code" class="input input-info w-full max-w-xs" />
            </div>

            <div class="card-actions justify-end">
                <button @click="send" class="btn btn-primary">Create</button>
            </div>
        </div>
    </div>
</template>
<script>
import useAuthStore from "../../stores/auth"
import axios from "axios"
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
                params: { type: 'backend' }
            } )
                .then( function ( response ) {
                    if ( response.statusText == 'OK' ) self.$router.push( { name: 'User Dashboard' } )
                } )
                .catch( function ( response ) {
                    console.log( response )
                } )
        },
    },
}
</script>
<style>

</style>
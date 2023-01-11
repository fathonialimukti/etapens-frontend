<template>
    <input type="file" @change="test">
    <!-- <button @click="getData">getdata</button>
    <div>
        <p>{{newData}}</p>
    </div> -->
</template>
<script>

export default {
    data () {
        return {
        }
    },
    methods: {
        async getData () {
            this.$router.push( { name: 'Student Dashboard' } )
        },
        async test ( e ) {
            const files = e.target.files
            for ( const file of files ) {
                file.path = file.webkitRelativePath.split( "/" )
                file.path.shift()
                file.path = file.path.join( "/" )
            }

            try {
                console.log( files )
            } catch ( error ) {
                console.log( error )
            }
        }
    },
}
</script>
<style>

</style>
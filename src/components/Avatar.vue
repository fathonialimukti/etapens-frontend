<template>
<div class="avatar">
    <div class="w-10 mr-3 mask mask-squircle">
        <img :src="img" />
    </div>
</div>
</template>
<script>
export default {
    props: [ 'img' ],
}
</script>
<style>

</style>
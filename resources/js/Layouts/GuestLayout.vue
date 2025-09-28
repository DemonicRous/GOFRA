<script setup>
import {Head} from "@inertiajs/vue3";
import Header from "@/Components/Layout/Header.vue";

</script>

<template>
    <Header></Header>
    <div class="container mx-auto p-4">
        <slot/>
    </div>
</template>

<style scoped>

</style>



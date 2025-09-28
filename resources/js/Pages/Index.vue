<!-- resources/js/Pages/Index.vue -->
<script setup>
import GuestLayout from "@/Layouts/GuestLayout.vue";
import {Head} from "@inertiajs/vue3";
import {route} from "ziggy-js";
import NavLink from "@/Components/Navigation/NavLink.vue";
</script>
<Head title="Index"/>
<template>
    <GuestLayout>
        <h1 class="text-2xl font-bold">Добро пожаловать в GOFRA!</h1>
        <p>Это пример страницы с переключением темы и прелоадером.</p>
        <NavLink :href="route('about')" class="mt-4 inline-block text-green-600 hover:underline dark:text-green-400">Перейти на страницу О проекте</NavLink>
    </GuestLayout>
</template>

<style scoped>

</style>

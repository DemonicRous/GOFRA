<!-- resources/js/Pages/About.vue -->
<script setup>
import { Head } from '@inertiajs/vue3';
import GuestLayout from "@/Layouts/GuestLayout.vue";
import {route} from "ziggy-js";
import NavLink from "@/Components/Navigation/NavLink.vue"; // Импортируем компонент логотипа
</script>

<template>
    <Head title="About" />
    <GuestLayout>
        <h1 class="text-2xl font-bold">О проекте GOFRA</h1>
        <p class="mt-2">Это вторая страница для демонстрации переходов и прелоадера.</p>
        <NavLink :href="route('index')" class="mt-4 inline-block text-green-600 hover:underline dark:text-green-400">Вернуться на главную</NavLink>
    </GuestLayout>
</template>

<style scoped>
/* Стили для этой страницы, если нужно */
</style>

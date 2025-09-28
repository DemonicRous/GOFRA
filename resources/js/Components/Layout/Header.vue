<!-- resources/js/Pages/Index.vue -->
<script setup>
import Logo from "@/Components/UI/Logo.vue";
import ThemeToggle from "@/Components/ThemeToggle.vue"; // Импортируем компонент
</script>

<template>
    <div class="container flex justify-between items-center mx-auto p-4">
        <Logo />
        <ThemeToggle />
    </div>
</template>

<style scoped>
/* Стили для этой страницы, если нужно */
</style>

<!-- resources/js/Components/ThemeToggle.vue -->
<template>
    <button
        @click="toggleTheme"
        class="theme-toggle flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900"
        aria-label="Переключить тему"
    >
        <!-- Используем solid иконки -->
        <svg v-if="currentTheme === 'light'" class="h-4 w-4 theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <svg v-else class="h-4 w-4 theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentTheme = ref('light');

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        currentTheme.value = 'dark';
    }
});

const toggleTheme = () => {
    if (currentTheme.value === 'light') {
        document.documentElement.classList.add('dark');
        currentTheme.value = 'dark';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        currentTheme.value = 'light';
        localStorage.setItem('theme', 'light');
    }
};
</script>

<style scoped>
/* Стили для кнопки остаются теми же, но теперь она больше */
.theme-toggle {
    background-color: var(--button-bg);
    color: var(--button-text);
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.theme-toggle:hover {
    background-color: var(--button-hover-bg);
    transform: scale(1.05); /* Лёгкое увеличение при наведении */
}

/* Стиль для иконки */
.theme-icon {
    /* Цвет иконки будет браться из цвета текста кнопки, определённого в CSS-переменных */
    /* Убедимся, что он не переопределяется */
    color: inherit;
    stroke: currentColor; /* Для outline иконок */
    fill: currentColor;   /* Для solid иконок */
    /* В данном случае, outline иконки используют stroke, solid - fill. */
    /* currentColor всегда ссылается на значение color: из родителя (кнопки). */
    /* Так как цвет кнопки задаётся в CSS-переменных, которые меняются при .dark, цвет иконки тоже будет меняться. */
}
</style>

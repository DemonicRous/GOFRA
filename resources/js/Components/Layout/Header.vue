<!-- resources/js/Components/Layout/Header.vue -->
<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import Logo from '@/Components/UI/Logo.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';

// Состояние для открытия/закрытия мобильного меню (Drawer)
const isMobileMenuOpen = ref(false);

// Функция для переключения состояния меню
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // Опционально: предотвращаем прокрутку фона при открытом drawer
  if (isMobileMenuOpen.value) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
};

// Опционально: закрыть меню при клике на ссылку
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.classList.remove('overflow-hidden');
};

// Пример навигационных ссылок
const navLinks = [
  { name: 'Главная', routeName: 'index' },
  { name: 'О проекте', routeName: 'about' },
];
</script>

<template>
  <header class="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
    <div class="container mx-auto px-4">
      <!-- Основная строка хедера -->
      <div class="flex justify-between items-center py-4">
        <!-- Логотип -->
        <div class="flex-shrink-0">
          <Logo />
        </div>

        <!-- Навигационные ссылки (скрыты на мобильных) -->
        <nav class="hidden md:flex space-x-6">
          <Link
              v-for="link in navLinks"
              :key="link.routeName"
              :href="route(link.routeName)"
              class="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 font-medium px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              :class="{
                            'text-green-600 dark:text-green-400 font-semibold': $page.component && $page.component === link.routeName.charAt(0).toUpperCase() + link.routeName.slice(1)
                        }"
          >
            {{ link.name }}
          </Link>
        </nav>

        <!-- Правая сторона: переключатель темы и бургер -->
        <div class="flex items-center space-x-4">
          <!-- Переключатель темы (скрыт на мобильных, теперь в drawer) -->
          <ThemeToggle class="hidden md:block" />

          <!-- Бургер-меню (видимо только на мобильных) -->
          <button
              @click="toggleMobileMenu"
              class="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
              aria-label="Открыть меню"
          >
            <!-- Иконка бургера -->
            <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  v-if="!isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
              ></path>
              <!-- Иконка "крестик" для закрытия -->
              <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Мобильное меню (Drawer) -->
    <transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-show="isMobileMenuOpen"
          class="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          @click="toggleMobileMenu"
      ></div>
    </transition>

    <transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
    >
      <div
          v-show="isMobileMenuOpen"
          class="fixed top-0 left-0 h-full w-full bg-white dark:bg-gray-800 shadow-lg z-50 flex flex-col"
      @click.stop
      >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <Logo />
        <div class="flex items-center space-x-4"> <!-- Контейнер для кнопок темы и закрытия -->
          <ThemeToggle /> <!-- Перенесли сюда -->
          <button
              @click="toggleMobileMenu"
              class="text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
              aria-label="Закрыть меню"
          >
            <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <nav class="flex-1 flex flex-col p-4 space-y-2">
        <Link
            v-for="link in navLinks"
            :key="link.routeName"
            :href="route(link.routeName)"
            class="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 font-medium py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            :class="{
                            'text-green-600 dark:text-green-400 font-semibold bg-gray-100 dark:bg-gray-700': $page.component && $page.component === link.routeName.charAt(0).toUpperCase() + link.routeName.slice(1)
                        }"
            @click="closeMobileMenu"
        >
          {{ link.name }}
        </Link>
      </nav>
      <!-- ThemeToggle больше не нужен внизу, так как он теперь наверху -->
      </div>
    </transition>
  </header>
</template>

<style scoped>
/* Дополнительные стили, если нужно */
/* Убедимся, что overflow-hidden работает корректно */
body.overflow-hidden {
  overflow: hidden;
}
</style>

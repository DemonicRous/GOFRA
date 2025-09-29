<!-- resources/js/Components/Layout/Header.vue -->
<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import Logo from '@/Components/UI/Logo.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.classList.remove('overflow-hidden');
};

const navLinks = [
  { name: 'Главная', routeName: 'index' },
  { name: 'О проекте', routeName: 'about' },
];
</script>

<template>
  <header class="bg-[var(--bg-color)] shadow-md sticky top-0 z-40">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="flex-shrink-0">
          <Logo />
        </div>

        <nav class="hidden md:flex space-x-6">
          <Link
              v-for="link in navLinks"
              :key="link.routeName"
              :href="route(link.routeName)"
              class="text-[var(--text-color)] hover:text-green-600 transition-colors duration-200 font-medium px-3 py-1 rounded-md hover:bg-[var(--bg-color)]"
              :class="{
                            'text-green-600 font-semibold': $page.component && $page.component.toLowerCase().includes(link.routeName.toLowerCase())
                        }"
          >
            {{ link.name }}
          </Link>
        </nav>

        <div class="flex items-center space-x-4">
          <!-- Кнопка темы скрыта на мобильных -->
          <ThemeToggle class="hidden md:block w-10 h-10" />
          <button
              @click="toggleMobileMenu"
              class="md:hidden text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
              aria-label="Открыть меню"
          >
            <svg
                v-if="!isMobileMenuOpen"
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
                  d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
            <svg
                v-else
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
          class="fixed top-0 left-0 h-full w-full bg-[var(--bg-color)] shadow-lg z-50 md:hidden flex flex-col"
      >
      <!-- Заголовок drawer: Логотип слева, крестик справа -->
      <div class="flex justify-between items-center p-4 border-b border-[var(--text-color)] border-opacity-20"> <!-- Цвет границы с прозрачностью -->
        <Logo />
        <button
            @click="toggleMobileMenu"
            class="text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
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

      <nav class="flex-1 flex flex-col p-4 space-y-2">
        <Link
            v-for="link in navLinks"
            :key="link.routeName"
            :href="route(link.routeName)"
            class="text-[var(--text-color)] hover:bg-[var(--color-gray-800)] hover:bg-opacity-50 transition-colors duration-200 font-medium py-3 px-4 rounded-md w-full text-left"
        :class="{
        'text-green-600 font-semibold bg-[var(--color-gray-800)] bg-opacity-30': $page.component && $page.component.toLowerCase().includes(link.routeName.toLowerCase())
        }"
        @click="closeMobileMenu"
        >
        {{ link.name }}
        </Link>
      </nav>

      <!-- ThemeToggle в нижней части drawer -->
      <div class="p-4 border-t border-[var(--text-color)] border-opacity-20"> <!-- Цвет границы с прозрачностью -->
        <ThemeToggle class="w-10 h-10" />
      </div>
      </div>
    </transition>
  </header>
</template>

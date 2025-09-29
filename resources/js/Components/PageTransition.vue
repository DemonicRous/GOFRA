<template>
    <!-- Transition для "коробки" лоадера -->
    <transition name="box" mode="out-in">
        <div v-if="shouldShowLoader" key="loader" class="fixed inset-0 z-50 flex items-center justify-center bg-page-transition-bg">
            <!-- "Коробка" с анимацией -->
            <transition name="logo" appear>
                <div class="relative logo-container">
                    <!-- Шестиугольник с пульсацией -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0.699 0.928 86.602 98.144"
                        width="60"
                        height="60"
                        class="hexagon-logo"
                    >
                        <g :fill="logoPrimaryColor">
                            <path d="M47 1.732l37.301 21.536a6 6 0 0 1 3 5.196v43.072a6 6 0 0 1-3 5.196L47 98.268a6 6 0 0 1-6 0L3.699 76.732a6 6 0 0 1-3-5.196V28.464a6 6 0 0 1 3-5.196L41 1.732a6 6 0 0 1 6 0z" />
                        </g>
                    </svg>
                    <!-- Значок внутри шестиугольника -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="6.999 5.999 86 87.998"
                        width="30"
                        height="30"
                        class="inner-logo"
                    >
                        <g :fill="logoSecondaryColor"> <!-- Цвет теперь зависит от темы -->
                            <path d="M49.957 6a3.949 3.949 0 0 0-1.473.297l-39 16H9.48a4.002 4.002 0 0 0-2.48 3.7v48c0 1.624.98 3.085 2.48 3.702l39 16h.004a3.993 3.993 0 0 0 3.031 0l39-16h.004A4.002 4.002 0 0 0 93 74V26c0-1.625-.98-3.086-2.48-3.7l-39-16h-.003a4.012 4.012 0 0 0-1.56-.3zM50 14.32L78.465 26 50 37.676 21.535 26zM15 31.961l31 12.72v39.351L15 71.313zm70 0v39.355l-31 12.72V44.682z" />
                        </g>
                    </svg>
                </div>
            </transition>
        </div>
    </transition>

    <!-- Transition для контента страницы -->
    <!-- Используем mode="out-in" здесь для плавного перехода между содержимым страниц -->
    <transition name="page-content" mode="out-in" :duration="{ enter: 600, leave: 600 }">
        <!-- Отображаем содержимое страницы, если лоадер НЕ должен отображаться -->
        <div v-if="!shouldShowLoader" key="page-content" class="page-content">
            <slot />
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { Inertia } from '@inertiajs/inertia';

// Состояния
const isLoading = ref(false);
const minTimeElapsed = ref(true); // Изначально true, чтобы не блокировать первый рендер
const startTimestamp = ref(0); // Время начала загрузки

// Таймер для обеспечения минимального времени отображения лоадера
let minDisplayTimer = null;

// Вычисляемое свойство для определения, нужно ли показывать лоадер
const shouldShowLoader = ref(false);

// Реактивное состояние для отслеживания темы
const isDarkTheme = ref(document.documentElement.classList.contains('dark'));

// Обновляем isDarkTheme при изменении класса 'dark' на html
watchEffect(() => {
    // Эта функция будет вызываться при каждом изменении зависимостей
    // document.documentElement.classList - это объект, и его свойство 'contains' отслеживается
    isDarkTheme.value = document.documentElement.classList.contains('dark');
});

// Вычисляемые свойства для цветов логотипа, зависящие от isDarkTheme
const logoPrimaryColor = computed(() => '#0bb14b'); // Зелёный всегда зелёный
const logoSecondaryColor = computed(() => isDarkTheme.value ? '#1f2937' : '#ffffff'); // Белый в светлой, темно-серый в тёмной

// Функция для обновления shouldShowLoader
const updateShouldShowLoader = () => {
    shouldShowLoader.value = isLoading.value || !minTimeElapsed.value;
};

// Функция для сброса таймера (если он активен)
const clearMinTimer = () => {
    if (minDisplayTimer) {
        clearTimeout(minDisplayTimer);
        minDisplayTimer = null;
    }
};

// Функция для запуска таймера минимального времени
const startMinTimer = () => {
    startTimestamp.value = Date.now(); // Запоминаем время начала
    minTimeElapsed.value = false; // Устанавливаем флаг, что минимальное время ещё не прошло
    updateShouldShowLoader(); // Обновляем отображение

    clearMinTimer(); // Очищаем старый таймер, если был
    minDisplayTimer = setTimeout(() => {
        // Проверяем, прошло ли ровно 2 секунды с момента start
        const elapsed = Date.now() - startTimestamp.value;
        const remaining = Math.max(0, 2000 - elapsed); // Оставшееся время до 2 секунд

        if (remaining === 0) {
            // 2 секунды точно прошли
            minTimeElapsed.value = true; // Устанавливаем флаг, что минимальное время прошло
            updateShouldShowLoader(); // Обновляем отображение
        } else {
            // Старт был давно, но таймер сработал с задержкой
            // Перезапускаем таймер на оставшееся время
            minDisplayTimer = setTimeout(() => {
                minTimeElapsed.value = true;
                updateShouldShowLoader();
            }, remaining);
        }
    }, 2000); // Планируем срабатывание на 2000 мс после start
};

onMounted(() => {
    // Подписываемся на события Inertia
    Inertia.on('start', () => {
        // console.log("Inertia start event - showing loader");
        isLoading.value = true; // Устанавливаем флаг загрузки
        startMinTimer(); // Запускаем таймер минимального времени
        updateShouldShowLoader(); // Обновляем отображение
    });

    Inertia.on('finish', (event) => {
        // console.log("Inertia finish event received:", event);
        if (event && event.visit) {
            if (event.visit.completed || event.visit.cancelled) {
                // console.log("Inertia finished (completed or cancelled).");
                isLoading.value = false; // Сбрасываем флаг загрузки

                // Проверяем, прошло ли минимальное время
                if (minTimeElapsed.value) {
                    // Если минимальное время уже прошло, лоадер скроется сразу
                    // благодаря изменению shouldShowLoader
                    // console.log("Min time already elapsed, loader will hide.");
                    updateShouldShowLoader();
                } else {
                    // Если минимальное время ещё не прошло, лоадер останется видимым
                    // до тех пор, пока minTimeElapsed не станет true (в setTimeout выше)
                    // console.log("Min time not elapsed yet, loader will hide after timer.");
                    // updateShouldShowLoader не вызываем, так как minTimeElapsed ещё false
                    // и isLoading уже false, но shouldShowLoader останется true
                    // благодаря isLoading в логике
                }
            } else if (event.visit.interrupted) {
                // console.log("Inertia visit was interrupted.");
                // isLoading остаётся true, если был новый start, иначе сбросится
                // Логика updateShouldShowLoader сама разберётся
                updateShouldShowLoader();
            }
        } else {
            // console.log("Inertia finish event received but event.visit is undefined or null, hiding loader.");
            isLoading.value = false;
            updateShouldShowLoader();
        }
    });
});
</script>

<style scoped>
/* Анимация для "коробки" лоадера */
.box-enter-active, .box-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.box-enter-from {
    opacity: 0;
    transform: scale(0.8);
}
.box-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

/* Анимация для логотипа */
.logo-enter-active {
    transition: opacity 0.3s ease 0.1s; /* Небольшая задержка */
}
.logo-enter-from {
    opacity: 0;
}

/* Стили для контейнера логотипа */
.logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px; /* Размер коробки */
    height: 120px;
    perspective: 1000px; /* Для 3D эффекта, если нужно */
    position: relative; /* Для позиционирования внутреннего лого */
}

/* Стили для шестиугольника */
.hexagon-logo {
    position: absolute;
    width: 60px;
    height: 60px;
    animation: pulse 2s infinite;
}

/* Стили для внутреннего значка */
.inner-logo {
    position: absolute;
    width: 30px;
    height: 30px;
    /* Центрируем относительно контейнера */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Анимация пульсации для шестиугольника */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.05);
    }
}

/* Анимация для контента страницы - Slide & Fade (новая анимация) */
/* Анимация ухода старой страницы */
.page-content-leave-active {
    transition: opacity 0.6s ease, transform 0.6s ease;
    /* Убедимся, что элемент не влияет на макет во время анимации */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    /* min-height: 100dvh; /* Не добавляем здесь, чтобы не создавать лишнего контейнера */
}
.page-content-leave-to {
    opacity: 0;
    transform: translateX(-50px); /* Старая страница уходит влево */
}

/* Анимация появления новой страницы */
.page-content-enter-active {
    transition: opacity 0.6s ease, transform 0.6s ease;
    /* Убедимся, что элемент не влияет на макет до анимации */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    /* min-height: 100dvh; /* Не добавляем здесь, чтобы не создавать лишнего контейнера */
}
.page-content-enter-from {
    opacity: 0;
    transform: translateX(50px); /* Новая страница въезжает справа */
}

/* Обертка для контента */
.page-content {
    min-height: 100dvh;
    /* overflow-x: hidden; /* Уже добавлен в app.css */
    /* Убедимся, что позиционирование не сломает макет */
    position: relative;
}

/* Определяем CSS переменные для цвета фона лоадера */
:root {
    --page-transition-bg: #ffffff; /* Цвет фона лоадера в светлой теме */
}
html.dark {
    --page-transition-bg: #111827; /* Цвет фона лоадера в тёмной теме */
}

/* Используем CSS переменную для фона лоадера */
.bg-page-transition-bg {
    background-color: var(--page-transition-bg);
}
</style>

<template>
    <!-- Transition для "коробки" лоадера -->
    <transition name="box" mode="out-in">
        <!-- Показываем лоадер, если showLoader = true ИЛИ если мы в состоянии ожидания (minTimeNotElapsed) -->
        <div v-if="showLoader || minTimeNotElapsed" key="loader" class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
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
                        <g fill="var(--logo-primary-color, #0bb14b)">
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
                        <g fill="var(--logo-secondary-color, #ffffff)">
                            <path d="M49.957 6a3.949 3.949 0 0 0-1.473.297l-39 16H9.48a4.002 4.002 0 0 0-2.48 3.7v48c0 1.624.98 3.085 2.48 3.702l39 16h.004a3.993 3.993 0 0 0 3.031 0l39-16h.004A4.002 4.002 0 0 0 93 74V26c0-1.625-.98-3.086-2.48-3.7l-39-16h-.003a4.012 4.012 0 0 0-1.56-.3zM50 14.32L78.465 26 50 37.676 21.535 26zM15 31.961l31 12.72v39.351L15 71.313zm70 0v39.355l-31 12.72V44.682z" />
                        </g>
                    </svg>
                </div>
            </transition>
        </div>
    </transition>

    <!-- Transition для контента страницы -->
    <transition name="page-content" mode="out-in" :duration="300">
        <!-- Показываем контент, если НЕ showLoader И НЕ minTimeNotElapsed -->
        <div v-if="!(showLoader || minTimeNotElapsed)" key="page-content" class="page-content">
            <slot />
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Inertia } from '@inertiajs/inertia';

// Состояние для отображения лоадера
const showLoader = ref(false);
// Состояние для отслеживания, прошло ли минимальное время
const minTimeNotElapsed = ref(false);
// Таймер для обеспечения минимального времени отображения лоадера
let minDisplayTimer = null;

// Функция для скрытия лоадера
const hideLoader = () => {
    // console.log("Attempting to hide loader...");
    if (minTimeNotElapsed.value) {
        // Минимальное время ещё не прошло, ждём
        // console.log("Min time not elapsed yet, waiting...");
        return; // finish не должен вызывать скрытие до окончания таймера
    }
    // console.log("Hiding loader now.");
    showLoader.value = false;
};

// Функция для показа лоадера и запуска таймера
const startLoading = () => {
    // console.log("Showing loader and starting min timer.");
    showLoader.value = true;
    minTimeNotElapsed.value = true; // Устанавливаем флаг, что минимальное время не прошло

    // Запускаем таймер на 2 секунды
    if (minDisplayTimer) {
        clearTimeout(minDisplayTimer);
    }
    minDisplayTimer = setTimeout(() => {
        // console.log("Min timer (2s) elapsed.");
        // Таймер истёк, минимальное время прошло
        minTimeNotElapsed.value = false; // Сбрасываем флаг
        // Теперь можно скрывать, если finish уже сработал или сработает
        if (!showLoader.value) {
            // Если showLoader уже false (например, finish сработал до таймера),
            // то лоадер должен скрыться, когда отрисуется slot
            // Это уже будет обработано в шаблоне
        }
    }, 2000);
};

onMounted(() => {
    // Подписываемся на события Inertia
    Inertia.on('start', () => {
        // console.log("Inertia start event - showing loader");
        startLoading();
    });

    Inertia.on('finish', (event) => {
        // console.log("Inertia finish event received:", event); // Лог для отладки
        // Проверяем, завершён ли переход и существует ли event.visit
        if (event && event.visit) {
            // Проверяем статус завершения
            if (event.visit.completed || event.visit.cancelled) {
                // console.log("Inertia finished (completed or cancelled).");
                // Проверяем, прошло ли минимальное время
                if (!minTimeNotElapsed.value) {
                    // Минимальное время уже прошло, можно скрывать
                    // console.log("Min time already elapsed, hiding loader.");
                    showLoader.value = false;
                } else {
                    // Минимальное время ещё не прошло, finish дождётся таймера
                    // console.log("Min time not elapsed yet, finish will wait for timer.");
                    // hideLoader вызовется в setTimeout выше, когда minTimeNotElapsed.value станет false
                }
            } else if (event.visit.interrupted) {
                // console.log("Inertia visit was interrupted, keeping loader visible.");
                // Loader уже должен быть видимым, но если был кратковременный finish, можно перезапустить
                // startLoading(); // Если нужно показать loader снова при прерывании и новом старте
            }
        } else {
            // console.log("Inertia finish event received but event.visit is undefined or null, hiding loader.");
            // Если event.visit нет, возможно, это редкий случай или изменение API
            if (!minTimeNotElapsed.value) {
                showLoader.value = false;
            }
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

/* Анимация для контента страницы */
.page-content-enter-active, .page-content-leave-active {
    transition: opacity 0.3s ease;
}
.page-content-enter-from, .page-content-leave-to {
    opacity: 0;
}

/* Обертка для контента */
.page-content {
    min-height: 100vh;
}
</style>

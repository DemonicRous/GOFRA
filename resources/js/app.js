// resources/js/app.js
import './bootstrap';
import '../css/app.css';
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createApp, h } from "vue";
import { ZiggyVue } from 'ziggy-js';
import PageTransition from './Components/PageTransition.vue'; // Импортируем компонент

const appName = import.meta.env.VITE_APP_NAME || 'GOFRA';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        // Оборачиваем App в PageTransition
        // PageTransition теперь сам управляет showLoader через Inertia события
        return createApp({
            render: () => h(PageTransition, null, h(App, props))
        })
            .use(plugin)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

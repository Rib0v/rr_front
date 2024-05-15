import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "index",
            component: () => import("@/views/AdvertIndex.vue"),
        },
        {
            path: "/show/:id",
            name: "show",
            component: () => import("@/views/AdvertShow.vue"),
        },
        {
            path: "/create",
            name: "create",
            component: () => import("@/views/AdvertCreate.vue"),
        },
    ],
});

export default router;

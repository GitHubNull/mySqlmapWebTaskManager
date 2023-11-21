// router.js

import { createRouter, createWebHistory } from 'vue-router';

// 导入你的组件
import Home from './components/Home.vue';
import ErrorDetail from './components/ErrorDetail.vue';
import LogDetail from './components/LogDetail.vue';
import PayloadDetail from './components/PayloadDetail.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/errors/:taskId',
        name: 'ErrorDetail',
        component: ErrorDetail
    },
    {
        path: '/logs/:taskId',
        name: 'LogDetail',
        component: LogDetail
    },
    {
        path: '/payloads/:taskId',
        name: 'PayloadDetail',
        component: PayloadDetail
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
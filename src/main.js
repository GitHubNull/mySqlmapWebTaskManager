import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import dayjs from 'dayjs'

import JsonViewer from "vue3-json-viewer";
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import "vue3-json-viewer/dist/index.css";

import router from './router';

const app = createApp(App);
app.config.globalProperties.$dayjs = dayjs
app.use(router);
app.use(JsonViewer);
app.use(Antd).mount('#app');
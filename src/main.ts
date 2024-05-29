import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import router from './router';
import '@/back-and-forth';

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  });
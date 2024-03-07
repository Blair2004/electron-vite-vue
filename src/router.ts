import { createRouter, createWebHashHistory } from 'vue-router';
import SelectLicense from './pages/SelectLicense.vue';
import Authenticate from './pages/Authenticate.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Authenticate
  }, {
    path: '/select-license',
    name: 'SelectLicense',
    component: SelectLicense
  }, {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./pages/Dashboard.vue')
  }, {
    path: '/dashboard/log',
    name: 'Log',
    component: () => import('./pages/Log.vue')
  }, {
    path: '/dashboard/printers',
    name: 'Printers',
    component: () => import('./pages/Printers.vue')
  }, {
    path: '/dashboard/settings',
    name: 'Settings',
    component: () => import('./pages/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
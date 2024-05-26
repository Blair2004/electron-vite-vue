import { createRouter, createWebHashHistory } from 'vue-router';
import SelectLicense from './pages/SelectLicense.vue';
import Authenticate from './pages/Authenticate.vue';

const routes = [
  {
    path: '/',
    name: 'Authenticate',
    component: Authenticate
  }, {
    path: '/select-license',
    name: 'SelectLicense',
    component: SelectLicense
  }, {
    path: '/dashboard',
    name: 'Dashboard.Home',
    component: () => import('./pages/Dashboard/Home.vue')
  }, {
    path: '/dashboard/log',
    name: 'Dashboard.Log',
    component: () => import('./pages/Dashboard/Log.vue')
  }, {
    path: '/dashboard/printers',
    name: 'Dashboard.Printers',
    component: () => import('./pages/Dashboard/Printers.vue')
  }, {
    path: '/dashboard/settings',
    name: 'Dashboard.Settings',
    component: () => import('./pages/Dashboard/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
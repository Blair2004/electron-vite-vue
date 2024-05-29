import { createRouter, createWebHashHistory } from 'vue-router';
import SelectLicense from './pages/SelectLicense.vue';
import Authenticate from './pages/Authenticate.vue';
import { AuthenticateMiddleware } from './middleware/AuthenticateMiddleware';
import { IpcRenderer } from 'electron';
import { CheckCredentialsMiddleware } from './middleware/CheckCredentialsMiddleware';
import { CheckAppStatusMiddleware } from './middleware/CheckAppStatusMiddleware';

declare const ipcRenderer: IpcRenderer;

const routes = [
  {
    path: '/',
    name: 'Authenticate',
    component: Authenticate,
    middlewares: [ new AuthenticateMiddleware ]
  }, {
    path: '/select-license',
    name: 'SelectLicense',
    component: SelectLicense,
    middlewares: [ new CheckCredentialsMiddleware ]
  }, {
    path: '/dashboard',
    name: 'Dashboard.Home',
    component: () => import('./pages/Dashboard/Home.vue'),
    middlewares: [ new CheckAppStatusMiddleware ]
  }, {
    path: '/dashboard/log',
    name: 'Dashboard.Log',
    component: () => import('./pages/Dashboard/Log.vue'),
    middlewares: [ new CheckAppStatusMiddleware ]
  }, {
    path: '/dashboard/printers',
    name: 'Dashboard.Printers',
    component: () => import('./pages/Dashboard/Printers.vue'),
    middlewares: [ new CheckAppStatusMiddleware ]
  }, {
    path: '/dashboard/settings',
    name: 'Dashboard.Settings',
    component: () => import('./pages/Dashboard/Settings.vue'),
    middlewares: [ new CheckAppStatusMiddleware ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach( async (to,from,next) => {
  console.log(to.fullPath);
  for( let route in routes ) {
    if ( routes[ route ].middlewares && routes[ route ].path === to.path ) {
      for( let i = 0; i < (<any[]>routes[ route ].middlewares)?.length; i++ ) {
        const instance = routes[ route ]?.middlewares?.[i];
        if ( instance?.handle !== undefined ) {
          const result = await instance.handle( next );
          if ( ! result ) {
            return;
          }
        }
      }
    }
  }

  next();
});

export default router
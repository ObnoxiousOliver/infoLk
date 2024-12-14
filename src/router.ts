import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: () => {
        const booted = localStorage.getItem('booted') === 'true'
        return booted ? '/explorer' : '/startup'
      }
    },
    {
      path: '/:operation(shutdown|startup)',
      component: () => import('./views/Boot.vue')
    },
    {
      path: '/explorer/:path(.*)',
      alias: '/explorer',
      component: () => import('./views/Explorer.vue')
    },
    {
      path: '/ext/:path(.*)?',
      alias: '/ext',
      component: () => import('./views/ExternalViewer.vue')
    },
    {
      path: '/:path(.*)',
      component: () => import('./views/404.vue')
    }
  ]
})
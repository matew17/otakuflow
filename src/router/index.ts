import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import AnimeDetailView from '@/views/AnimeDetailView.vue'
import ExploreView from '@/views/ExploreView.vue'
import LibraryView from '@/views/LibraryView.vue'
import LoginView from '@/views/LoginView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: DefaultLayout,
    redirect: 'explore',
    children: [
      { path: '/explore', component: ExploreView, meta: { layout: 'DefaultLayout' } },
      { path: '/anime/:id', component: AnimeDetailView },
      { path: '/library', component: LibraryView },
      { path: '/login', component: LoginView },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import AnimeDetailView from '@/views/AnimeDetailView.vue'
import ExploreView from '@/views/ExploreView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import LibraryView from '@/views/LibraryView.vue'
import LoginView from '@/views/LoginView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const loginMeta = {
  requiresAuth: true,
}

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: DefaultLayout,
    redirect: 'explore',
    children: [
      { path: 'explore', component: ExploreView, meta: loginMeta },
      { path: 'anime/:id', component: AnimeDetailView, meta: loginMeta },
      { path: 'favorites', component: FavoritesView, meta: loginMeta },
      { path: 'library', component: LibraryView, meta: loginMeta },
      { path: 'login', component: LoginView },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: 'login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router

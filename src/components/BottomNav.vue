<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

defineOptions({ name: 'BottomNav' })

const auth = useAuthStore()
const router = useRouter()

const navItems = [
  { to: '/explore', icon: 'material-symbols:explore', label: 'Explore' },
  { to: '/library', icon: 'material-symbols:local-library', label: 'Library' },
  { to: '/favorites', icon: 'material-symbols:favorite', label: 'Favorites' },
] as const

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav
    v-if="auth.isLoggedIn"
    class="fixed bottom-0 left-0 right-0 z-50 bg-[--color-surface] border-t border-white/10 flex items-center justify-around pt-2"
    style="padding-bottom: max(1rem, env(safe-area-inset-bottom))"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      :aria-label="item.label"
      class="flex flex-col items-center gap-1 px-4 py-1 transition-transform hover:scale-110 text-white/60 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent]"
      active-class="text-[--color-accent]"
    >
      <Icon :icon="item.icon" class="text-2xl" />
      <span class="text-xs" aria-hidden="true">{{ item.label }}</span>
    </RouterLink>

    <button
      aria-label="Logout"
      class="flex flex-col items-center gap-1 px-4 py-1 transition-transform hover:scale-110 text-white/60 hover:text-white cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent]"
      @click="handleLogout"
    >
      <Icon icon="material-symbols:logout" class="text-2xl" aria-hidden="true" />
      <span class="text-xs" aria-hidden="true">Logout</span>
    </button>
  </nav>
</template>

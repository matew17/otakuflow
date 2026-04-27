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
    class="fixed bottom-0 left-0 right-0 z-50 bg-[--color-surface] border-t border-white/10 flex items-center justify-around pb-4 pt-2"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-1 px-4 py-1 transition-transform hover:scale-110 text-white/60"
      active-class="text-[--color-accent]"
    >
      <Icon :icon="item.icon" class="text-2xl" />
      <span class="text-xs">{{ item.label }}</span>
    </RouterLink>

    <button
      class="flex flex-col items-center gap-1 px-4 py-1 transition-transform hover:scale-110 text-white/60 hover:text-white cursor-pointer"
      @click="handleLogout"
    >
      <Icon icon="material-symbols:logout" class="text-2xl" />
      <span class="text-xs">Logout</span>
    </button>
  </nav>
</template>

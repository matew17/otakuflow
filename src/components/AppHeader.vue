<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { RouterLink, useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'

const { logout } = useAuthStore()
const router = useRouter()

const logoutForm = async () => {
  await logout()
  router.push({ path: 'login' })
}
</script>

<template>
  <nav class="flex flex-row items-center bg-primary gap-4 p-2">
    <RouterLink class="p-2" activeClass=" border border-black text-black" to="/explore">
      Explore
    </RouterLink>
    <RouterLink class="p-2" activeClass=" border border-black text-black" to="/library">
      Library
    </RouterLink>

    <BaseButton @click="logoutForm" variant="secondary">Logout</BaseButton>
  </nav>
</template>

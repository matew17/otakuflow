<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-surface text-white">
    <AppHeader v-if="auth.isLoggedIn" />

    <main class="max-w-7xl mx-auto">
      <router-view />
    </main>
  </div>
</template>

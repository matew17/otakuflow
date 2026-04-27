<script setup lang="ts">
import BottomNav from '@/components/BottomNav.vue'
</script>

<template>
  <div class="min-h-screen bg-surface text-white">
    <main class="max-w-7xl mx-auto pb-20">
      <router-view />
    </main>

    <BottomNav />
  </div>
</template>

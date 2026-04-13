<script setup lang="ts">
import type { Anime } from '@/types/anime'

defineProps<{
  anime: Anime
}>()
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-card bg-surface-light hover:ring-2 hover:ring-primary transition-all cursor-pointer"
  >
    <img
      :src="anime.images?.jpg?.image_url"
      :alt="anime.title"
      class="w-full aspect-[3/4] object-cover"
    />
    <div class="p-3">
      <h3 class="text-sm font-medium text-white truncate">{{ anime.title }}</h3>
      <span class="text-xs text-accent">★ {{ anime.score }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '@/types/anime'
import type { AnimeSearch } from '@/types/anime-search'
import { computed } from 'vue'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'

const props = defineProps<{
  anime: Anime | AnimeSearch
}>()

const { isFavorite, toggleFavorite } = useFavoriteToggle()
const isFav = computed(() => isFavorite(props.anime.mal_id))
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-card bg-surface-light hover:ring-2 hover:ring-primary transition-all cursor-pointer"
  >
    <img
      :src="anime.images?.jpg?.image_url ?? ''"
      :alt="anime.title"
      class="w-full aspect-[3/4] object-cover"
    />

    <button
      class="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
      :class="isFav ? 'text-accent' : 'text-white'"
      :aria-label="isFav ? 'Remove from favorites' : 'Add to favorites'"
      @click.stop="toggleFavorite(anime)"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          :fill="isFav ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </button>

    <div class="p-3">
      <h3 class="text-pretty whitespace-normal break-words text-sm font-medium text-white">
        {{ anime.title }}
      </h3>
      <span class="text-xs text-accent">★ {{ anime.score }}</span>
    </div>
  </div>
</template>

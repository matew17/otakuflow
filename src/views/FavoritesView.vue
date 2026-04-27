<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import AnimeCard from '@/components/AnimeCard.vue'
import CardWrapper from '@/components/CardWrapper.vue'
import PageTitle from '@/components/PageTitle.vue'

const router = useRouter()
const favoritesStore = useFavoritesStore()

const redirectToDetails = (id: number) => {
  router.push('anime/' + id)
}
</script>

<template>
  <section class="flex flex-col gap-4 px-4 py-6">
    <PageTitle title="Favorites" />

    <section class="flex gap-4 flex-wrap justify-center">
      <template v-if="favoritesStore.favorites.length === 0">
        <p class="text-white/60 mt-8">No favorites yet. Click the heart on any anime to save it.</p>
      </template>

      <template v-else>
        <CardWrapper
          v-for="anime in favoritesStore.favorites"
          :key="anime.mal_id"
          @click="redirectToDetails(anime.mal_id)"
        >
          <AnimeCard :anime="anime" />
        </CardWrapper>
      </template>
    </section>
  </section>
</template>

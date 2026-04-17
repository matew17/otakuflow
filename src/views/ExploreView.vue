<script setup lang="ts">
import { computed, ref } from 'vue'

import { useGetTopAnime } from '@/composables/useAnimeGetTop'
import SearchInput from '@/components/SearchInput.vue'
import { useAnimeSearch } from '@/composables/useAnimeSearch'
import { refDebounced } from '@vueuse/core'
import SkeletonCard from '@/components/SkeletonCard.vue'
import AnimeCard from '@/components/AnimeCard.vue'

const searchInput = ref('')
const searchQuery = refDebounced(searchInput, 400)
const page = ref(1)

const queryTopAnime = useGetTopAnime()
const querySearchAnime = useAnimeSearch(searchQuery, page)

const animeData = computed(
  () => querySearchAnime.data?.value?.data || queryTopAnime.data?.value?.data,
)
const isLoading = computed(
  () => Boolean(querySearchAnime.isLoading.value) || Boolean(queryTopAnime.isLoading.value),
)
</script>

<template>
  <section class="flex flex-col gap-4">
    <h1>Explore</h1>

    <div class="w-full">
      <SearchInput
        placeholder="Search by Anime Name"
        v-model="searchInput"
        :button-disabled="!searchInput"
      />
    </div>

    <SkeletonCard v-if="isLoading" />

    <ul v-if="!isLoading">
      <section class="flex gap-4 flex-wrap justify-center">
        <div class="w-[300px]" v-for="anime in animeData" :key="anime.mal_id">
          <AnimeCard :anime="anime" />
        </div>
      </section>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useGetTopAnime } from '@/composables/useAnimeGetTop'
import SearchInput from '@/components/SearchInput.vue'
import { useAnimeSearch } from '@/composables/useAnimeSearch'
import { refDebounced } from '@vueuse/core'
import SkeletonCard from '@/components/SkeletonCard.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import { useRouter } from 'vue-router'
import CardWrapper from '@/components/CardWrapper.vue'
import PageTitle from '@/components/PageTitle.vue'

const router = useRouter()

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

const redirectToDetails = (id: number) => {
  router.push('anime/' + id)
}
</script>

<template>
  <section class="flex flex-col gap-4 px-4 py-6">
    <PageTitle title="Explore" />

    <div class="w-full px-6">
      <SearchInput
        v-model="searchInput"
        placeholder="Search by Anime Name"
        :button-disabled="!searchInput"
      />
    </div>

    <section class="flex gap-4 flex-wrap justify-center">
      <template v-if="isLoading">
        <CardWrapper v-for="value in [1, 2, 3, 4, 5, 6]" :key="value">
          <SkeletonCard />
        </CardWrapper>
      </template>

      <template v-else>
        <CardWrapper
          v-for="anime in animeData"
          :key="anime.mal_id"
          @click="redirectToDetails(anime.mal_id)"
        >
          <AnimeCard :anime="anime" />
        </CardWrapper>
      </template>
    </section>
  </section>
</template>

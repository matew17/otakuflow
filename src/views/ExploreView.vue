<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { refDebounced } from '@vueuse/core'

import { useGetTopAnime } from '@/composables/useAnimeGetTop'
import { useAnimeSearch } from '@/composables/useAnimeSearch'
import { useAnimeSeasonNow } from '@/composables/useAnimeSeasonNow'
import SearchInput from '@/components/SearchInput.vue'
import FilterTabs from '@/components/FilterTabs.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import CardWrapper from '@/components/CardWrapper.vue'
import PageTitle from '@/components/PageTitle.vue'

type FilterValue = 'top' | 'season'

const route = useRoute()
const router = useRouter()

// Safely narrow the filter query param
const rawFilter = route.query['filter']
const initialFilter: FilterValue =
  rawFilter === 'season' ? 'season' : 'top'

// Safely narrow the q query param
const rawQ = route.query['q']
const initialQ = typeof rawQ === 'string' ? rawQ : ''

const activeFilter = ref<FilterValue>(initialFilter)
const searchInput = ref(initialQ)
const searchQuery = refDebounced(searchInput, 400)
const page = ref(1)

const isSearching = computed(() => searchQuery.value.length > 2)

const queryTopAnime = useGetTopAnime()
const querySeasonNow = useAnimeSeasonNow()
const querySearchAnime = useAnimeSearch(searchQuery, page)

const animeData = computed(() => {
  if (isSearching.value) return querySearchAnime.data?.value?.data
  if (activeFilter.value === 'season') return querySeasonNow.data?.value?.data
  return queryTopAnime.data?.value?.data
})

const isLoading = computed(() => {
  if (isSearching.value) return Boolean(querySearchAnime.isLoading.value)
  if (activeFilter.value === 'season') return Boolean(querySeasonNow.isLoading.value)
  return Boolean(queryTopAnime.isLoading.value)
})

const onFilterChange = (filter: FilterValue) => {
  activeFilter.value = filter
  router.replace({ query: { ...route.query, filter } })
}

watch(searchInput, (val) => {
  const q = val.length > 0 ? val : undefined
  router.replace({ query: { ...route.query, q } })
})

const redirectToDetails = (id: number) => {
  router.push('anime/' + id)
}
</script>

<template>
  <section class="flex flex-col gap-4 px-4 py-6">
    <PageTitle title="Explore" />

    <FilterTabs :model-value="activeFilter" @update:model-value="onFilterChange" />

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

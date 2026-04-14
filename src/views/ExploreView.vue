<script setup lang="ts">
import { toRefs } from 'vue'

import { useGetTopAnime } from '@/composables/useAnimeGetTop'

const queryResult = useGetTopAnime()
const { data, isLoading } = toRefs(queryResult)
</script>

<template>
  <h1>Explore</h1>

  <ul v-if="!isLoading">
    <li v-for="anime in data?.data" :key="anime.mal_id">
      {{ anime.title }}
    </li>
  </ul>

  <p v-if="isLoading">loading...</p>
</template>

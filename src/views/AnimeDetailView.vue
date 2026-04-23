<script setup lang="ts">
import SkeletonCard from '@/components/SkeletonCard.vue'
import { useGetAnimeCharacters } from '@/composables/useAnimeCharacters'
import { useGetAnimeDetails } from '@/composables/useAnimeDetail'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const animeId = computed(() => Number(route.params?.id))

const animeQuery = useGetAnimeDetails(animeId)
const charactersQuery = useGetAnimeCharacters(animeId)

const { data } = animeQuery

const sortedCharacters = computed(() =>
  charactersQuery.data.value?.data
    ? [...charactersQuery.data.value.data]
        .sort((a, b) => b.favorites - a.favorites)
        .sort((a, b) => a.role.localeCompare(b.role))
    : [],
)
</script>

<template>
  <template v-if="animeQuery.isLoading.value || charactersQuery.isLoading.value">
    <SkeletonCard />
  </template>
  <template v-else>
    <section class="flex flex-col text-end bg-primary p-4 relative">
      <p>Score</p>
      <p>⭐️ {{ data?.data.score }}</p>

      <div class="w-100px border-4 border-white absolute">
        <img
          :src="data?.data.images?.jpg?.image_url ?? ''"
          :alt="data?.data.title"
          class="w-full aspect-[3/4] object-cover"
        />
      </div>
    </section>

    <section class="flex flex-col text-end p-4 text-sm">
      <div class="p-0 m-1">
        <p>Rank</p>
        <p># {{ data?.data.rank }}</p>
      </div>

      <div class="p-0 m-1">
        <p>Popularity</p>
        <p># {{ data?.data.popularity }}</p>
      </div>

      <div class="p-0 m-1">
        <p>Members</p>
        <p>{{ data?.data?.members }}</p>
      </div>

      <div class="p-0 m-1">
        <p>Favorites</p>
        <p>{{ data?.data?.favorites }}</p>
      </div>
    </section>

    <h1 class="mt-8 mb-2 text-xl text-center font-bold">
      {{ data?.data.title }}
    </h1>

    <section class="flex justify-center">
      <p v-for="(genre, index) in data?.data.genres" :key="genre.mal_id" class="text-indigo-200">
        {{ genre.name }}
        <span v-if="index !== Number(data?.data?.genres?.length) - 1" class="text-indigo-600">
          &nbsp;•&nbsp;
        </span>
      </p>
    </section>

    <p class="p-4 text-pretty">
      {{ data?.data.synopsis }}
    </p>

    <h1 class="p-4 text-xl text-center font-bold">Characters</h1>

    <section class="flex gap-4 flex-wrap justify-center py-4">
      <div
        v-for="value in sortedCharacters"
        :key="value.character.mal_id"
        class="flex flex-col w-[100px] gap-2"
      >
        <img
          :src="value.character.images.webp.image_url ?? ''"
          :alt="value.character.name"
          class="w-full aspect-[3/4] object-cover object-top rounded-full"
        />

        <p class="text-center text-sm">{{ value.character.name }}</p>
        <p class="text-center text-xs text-indigo-200">{{ value.role }}</p>
      </div>
    </section>
  </template>
</template>

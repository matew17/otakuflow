import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Anime } from '@/types/anime'
import type { AnimeSearch } from '@/types/anime-search'

type FavoriteAnime = Anime | AnimeSearch

export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const favorites = ref<FavoriteAnime[]>([])

    const isFavorite = (id: number) => favorites.value.some((a) => a.mal_id === id)

    const toggleFavorite = (anime: FavoriteAnime) => {
      if (isFavorite(anime.mal_id)) {
        favorites.value = favorites.value.filter((a) => a.mal_id !== anime.mal_id)
      } else {
        favorites.value.push(anime)
      }
    }

    const clearFavorites = () => {
      favorites.value = []
    }

    return { favorites, isFavorite, toggleFavorite, clearFavorites }
  },
  { persist: { key: 'otakuflow:favorites' } },
)

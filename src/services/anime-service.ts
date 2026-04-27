import type { AnimeResponse } from '@/types/anime'
import { apiFetch } from './api'
import type { AnimeSearch, AnimeSearchResponse } from '@/types/anime-search'
import type { AnimeCharacterResponse } from '@/types/characters'

export const searchAnime = (query: string, page = 1) => {
  return apiFetch<AnimeSearchResponse>(`/anime?q=${query}&page=${page}`)
}

export const getAnimeById = (id: number) => {
  return apiFetch<{ data: AnimeSearch }>(`/anime/${id}`)
}

export const getTopAnime = () => {
  return apiFetch<AnimeResponse>('/top/anime')
}

export const getSeasonNow = () => {
  return apiFetch<AnimeResponse>('/seasons/now')
}

export const getCharacters = (animeId: number) => {
  return apiFetch<AnimeCharacterResponse>(`/anime/${animeId}/characters`)
}

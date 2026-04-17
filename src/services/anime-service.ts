import type { Anime, AnimeResponse } from '@/types/anime'
import { apiFetch } from './api'
import type { AnimeSearchResponse } from '@/types/anime-search'

export const searchAnime = (query: string, page = 1) => {
  return apiFetch<AnimeSearchResponse>(`/anime?q=${query}&page=${page}`)
}

export const getAnimeById = (id: number) => {
  return apiFetch<Anime>(`/anime/${id}`)
}

export const getTopAnime = () => {
  return apiFetch<AnimeResponse>('/top/anime')
}

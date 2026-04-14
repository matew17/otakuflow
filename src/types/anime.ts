import type { Pagination } from './pagination'

export interface Anime {
  mal_id: number
  title: string
  synopsis: string
  score: number
  episodes: number
  images: { jpg: { image_url: string; large_image_url: string } }
  genres: { mal_id: number; name: string }[]
  status: string
  year: number
}

export interface AnimeResponse {
  data: Anime[]
  pagination: Pagination
}

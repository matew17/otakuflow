import { getSeasonNow } from '@/services/anime-service'
import { useQuery } from '@tanstack/vue-query'

export const useAnimeSeasonNow = () => {
  return useQuery({
    queryKey: ['anime', 'season', 'now'],
    queryFn: () => getSeasonNow(),
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
  })
}

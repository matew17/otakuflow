import { getSeasonNow } from '@/services/anime-service'
import { useQuery } from '@tanstack/vue-query'
import { type ComputedRef } from 'vue'

export const useAnimeSeasonNow = (enabled?: ComputedRef<boolean>) => {
  return useQuery({
    queryKey: ['anime', 'season', 'now'],
    queryFn: () => getSeasonNow(),
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
    enabled,
  })
}

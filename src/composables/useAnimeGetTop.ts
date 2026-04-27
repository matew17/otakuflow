import { getTopAnime } from '@/services/anime-service'
import { useQuery } from '@tanstack/vue-query'
import { type ComputedRef } from 'vue'

export const useGetTopAnime = (enabled?: ComputedRef<boolean>) => {
  return useQuery({
    queryKey: ['anime-top'],
    queryFn: () => getTopAnime(),
    staleTime: 300000, // 5 minute
    gcTime: 600000, // 10 minutes
    enabled,
  })
}

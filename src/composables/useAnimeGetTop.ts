import { getTopAnime } from '@/services/anime-service'
import { useQuery } from '@tanstack/vue-query'

export const useGetTopAnime = () => {
  return useQuery({
    queryKey: ['anime-top'],
    queryFn: () => getTopAnime(),
  })
}

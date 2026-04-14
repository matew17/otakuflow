import { getAnimeById } from '@/services/anime-service'
import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

export const useGetAnimeDetails = (id: Ref<number>) => {
  return useQuery({
    queryKey: ['anime', 'byId', id],
    queryFn: () => getAnimeById(id.value),
    enabled: computed(() => Boolean(id.value)),
  })
}

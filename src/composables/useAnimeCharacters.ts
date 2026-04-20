import { getAnimeById, getCharacters } from '@/services/anime-service'
import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

export const useGetAnimeCharacters = (id: Ref<number>) => {
  return useQuery({
    queryKey: ['anime', 'characters', id],
    queryFn: () => getCharacters(id.value),
    enabled: computed(() => Boolean(id.value)),
  })
}

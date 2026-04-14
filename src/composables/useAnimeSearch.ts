import { searchAnime } from '@/services/anime-service'
import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

export const useAnimeSearch = (query: Ref<string>, page: Ref<number>) => {
  return useQuery({
    queryKey: ['anime', 'search', query, page],
    queryFn: () => searchAnime(query.value, page.value),
    enabled: computed(() => query.value.length > 2),
  })
}

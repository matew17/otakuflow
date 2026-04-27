import { useFavoritesStore } from '@/stores/favorites'

export function useFavoriteToggle() {
  const store = useFavoritesStore()
  return {
    isFavorite: store.isFavorite,
    toggleFavorite: store.toggleFavorite,
  }
}

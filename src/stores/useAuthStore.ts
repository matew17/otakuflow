import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type User = { username: string } | null

export const useAuthStore = defineStore('', () => {
  const user = ref<User>(null)
  const isLoggedIn = computed(() => user.value !== null)

  const login = (username: string) => {
    user.value = { username }
  }

  const logout = () => {
    user.value = null
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
  }
})

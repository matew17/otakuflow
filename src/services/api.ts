import { APP_CONFIG } from '@/constants/app-config'

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const base_url = APP_CONFIG.ANIME_API_BASE_URL

  try {
    const res = await fetch(`${base_url}${endpoint}`)

    if (!res.ok) throw new Error(`API error: ${res.status}`)

    const json = await res.json()

    return json
  } catch (error) {
    throw new Error(`${error}`)
  }
}

export interface AnimeCharacterResponse {
  data: AnimeCharacterEntry[]
}

export interface AnimeCharacterEntry {
  character: AnimeCharacter
  role: string
  favorites: number
  voice_actors: AnimeVoiceActor[]
}

export interface AnimeCharacter {
  mal_id: number
  url: string
  images: AnimeCharacterImages
  name: string
}

export interface AnimeCharacterImages {
  jpg: AnimeCharacterImageJpg
  webp: AnimeCharacterImageWebp
}

export interface AnimeCharacterImageJpg {
  image_url: string | null
}

export interface AnimeCharacterImageWebp {
  image_url: string | null
  small_image_url?: string | null
}

export interface AnimeVoiceActor {
  person: AnimePerson
  language: string
}

export interface AnimePerson {
  mal_id: number
  url: string
  images: AnimePersonImages
  name: string
}

export interface AnimePersonImages {
  jpg: AnimePersonImageJpg
}

export interface AnimePersonImageJpg {
  image_url: string | null
}

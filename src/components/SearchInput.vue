<script lang="ts" setup>
withDefaults(
  defineProps<{
    id?: string
    placeholder?: string
    buttonLabel?: string
    loading?: boolean
    buttonDisabled?: boolean
  }>(),
  {
    id: 'searchInput',
    placeholder: 'Search',
    buttonLabel: 'Search',
  },
)

const model = defineModel<string>()
</script>

<template>
  <form class="max-w-md mx-auto">
    <label for="search" class="block mb-2.5 text-sm font-medium text-heading sr-only">Search</label>
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          class="w-4 h-4 text-body"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        class="block w-full p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-white text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-white"
        :id="id"
        type="search"
        :placeholder="placeholder"
        v-model="model"
      />
    </div>
  </form>
</template>

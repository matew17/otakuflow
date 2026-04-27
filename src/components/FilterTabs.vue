<script setup lang="ts">
type FilterValue = 'top' | 'season'

const props = defineProps<{
  modelValue: FilterValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FilterValue]
}>()

const tabs: { label: string; value: FilterValue }[] = [
  { label: 'Top Anime', value: 'top' },
  { label: 'This Season', value: 'season' },
]

const onTabClick = (value: FilterValue) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex gap-2">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="flex-1 rounded-base px-4 py-2 text-sm font-medium transition-colors"
      :class="
        props.modelValue === tab.value
          ? 'bg-primary text-white'
          : 'bg-surface text-body hover:bg-surface-light'
      "
      @click="onTabClick(tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

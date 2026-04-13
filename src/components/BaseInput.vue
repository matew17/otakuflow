<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    type?: string
  }>(),
  {
    type: 'text',
  },
)

const model = defineModel<string>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm text-gray-400">
      {{ label }}
    </label>

    <input
      v-model="model"
      :placeholder="placeholder"
      class="bg-surface-light border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
      :type="type"
    />
  </div>
</template>

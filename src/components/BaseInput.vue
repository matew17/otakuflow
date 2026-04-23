<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    type?: string
    id?: string
  }>(),
  {
    type: 'text',
    label: 'Input Base',
    placeholder: 'Ingresa la informacion',
    id: 'input-id',
  },
)

const model = defineModel<string>()
</script>

<template>
  <div>
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
</template>

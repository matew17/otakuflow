<script setup lang="ts">
defineOptions({ name: 'PageTitle' })

defineProps<{
  title: string
}>()
</script>

<template>
  <h1 class="text-center text-4xl font-bold py-6 mb-6 text-white">{{ title }}</h1>
</template>

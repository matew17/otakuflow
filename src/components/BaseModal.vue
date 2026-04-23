<script setup lang="ts">
defineProps<{
  show: boolean
}>()

defineEmits<{
  close: [void]
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/60" @click="$emit('close')" />
      <div class="relative bg-surface rounded-xl p-6 max-w-lg w-full mx-4">
        <!-- Modal Content here -->
        <slot />
      </div>
    </div>
  </Teleport>
</template>

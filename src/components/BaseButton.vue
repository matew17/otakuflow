<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}>()
defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
      variant === 'secondary'
        ? 'bg-surface-light text-white hover:bg-surface'
        : 'bg-primary text-white hover:bg-primary-hover',
      disabled && 'opacity-50 cursor-not-allowed',
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <!-- Like children or Content projection -->
    <slot />
  </button>
</template>

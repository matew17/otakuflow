<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}>()
defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer w-full',
      variant === 'secondary'
        ? 'bg-surface-light text-white hover:bg-surface'
        : 'bg-primary text-white hover:bg-primary-hover',
      disabled && 'opacity-50 cursor-not-allowed',
    ]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <!-- Like children or Content projection -->
    <slot />
  </button>
</template>

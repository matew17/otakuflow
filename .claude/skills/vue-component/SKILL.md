---
name: vue-component
description: Authoring rules and templates for Vue 3 SFCs in this repo. Load when editing .vue files.
---

# vue-component

Follow these when creating or editing a Vue SFC.

## Structure

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  title: string
  count?: number
}
const props = withDefaults(defineProps<Props>(), { count: 0 })
const emit = defineEmits<{ (e: 'select', id: string): void }>()

const doubled = computed(() => props.count * 2)
</script>

<template>
  <section :aria-label="props.title">
    <!-- content -->
  </section>
</template>

<style scoped>
/* nothing global */
</style>
```

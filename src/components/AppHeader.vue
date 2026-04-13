<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="flex flex-row items-center bg-primary gap-4 p-2">
    <RouterLink class="p-2" activeClass=" border border-black text-black" to="/explore">
      Explore
    </RouterLink>
    <RouterLink class="p-2" activeClass=" border border-black text-black" to="/library">
      Library
    </RouterLink>
  </nav>
</template>

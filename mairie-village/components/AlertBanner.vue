<script setup>
import { ref } from 'vue'

defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true }
})

const isVisible = ref(true)
</script>

<template>
  <div v-if="isVisible" class="alert-banner" role="alert">
    <div>
      <h3 class="alert-banner__title">{{ title }}</h3>
      <p class="alert-banner__message">{{ message }}</p>
    </div>
  </div>
</template>

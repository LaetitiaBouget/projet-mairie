<script setup>
const mairie = {
  name: 'Vic-de-Chassenay'
}
</script>

<template>
  <NuxtLink to="/">
    <div class="branding">
      <span class="branding__subtitle">Commune</span>

      <h1 class="branding__title">
        {{ mairie.name }}
      </h1>

      <div class="branding__separator"></div>
    </div>
  </NuxtLink>
</template>

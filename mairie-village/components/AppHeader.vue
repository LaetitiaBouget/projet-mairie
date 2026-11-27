<script setup>
import { computed } from 'vue'
import { useRoute } from '#app'

const route = useRoute()

const heroesData = {
  '/': '/images/hero-home.webp',
  '/actualites': '/images/hero-actualites.jpg',
  '/vie-municipale': '/images/hero-mairie.webp',
  '/vie-locale': '/images/hero-vie-locale.jpg',
  '/salle-communale': '/images/hero-vie-locale.jpg',
  '/ecole': '/images/hero-vie-locale.jpg',
  '/marotte-and-grignote': '/images/hero-vie-locale.jpg',
  '/vic-a-venir': '/images/hero-vie-locale.jpg',
  '/infos-pratiques': '/images/hero-services.jpg',
  '/patrimoine': '/images/hero-patrimoine.webp',
  '/mentions-legales': '/images/hero-home.webp'
}

const currentHeroImage = computed(() => {
  return heroesData[route.path] || heroesData['/']
})
</script>

<template>
  <header
    class="header"
    :class="{
      'header--inner': route.path !== '/',
      'header--patrimoine': route.path === '/patrimoine',
      'header--legal': route.path === '/mentions-legales'
    }"
  >
    <div class="header__top">
      <AppBranding />
      <AppNavBar />
    </div>

    <div class="hero-container">
      <img :src="currentHeroImage" alt="Bannière de la commune" class="hero-img" />
    </div>

    <QuickLinks v-if="route.path === '/'" />
  </header>
</template>

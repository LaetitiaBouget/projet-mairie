<script setup>
import { computed } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const route = useRoute()

const formatDate = (dateString) => {
  if (!dateString) return ''

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}

const { data: strapiResponse } = await useAsyncData(`actu-${route.params.id}`, () => {
  if (import.meta.server) {
    return $fetch(`http://localhost:1337/api/articles/${route.params.id}?populate=*`)
  }

  return null
})

const article = computed(() => {
  return strapiResponse.value?.data || null
})

const imageUrl = computed(() => {
  return (
    article.value?.image?.formats?.large?.url ||
    article.value?.image?.formats?.medium?.url ||
    article.value?.image?.formats?.small?.url ||
    article.value?.image?.url ||
    'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=600'
  )
})
</script>

<template>
  <main class="article-page container">
    <div v-if="article" class="article-layout">
      <img :src="imageUrl" :alt="article?.title" class="article-page__image" />

      <div class="article-page__content-wrapper">
        <div class="article-page__meta">
          <span class="article-page__date">
            <Icon name="lucide:calendar" />
            {{ formatDate(article?.publishedAt) }}
          </span>

          <span class="article-page__category">
            {{ article?.category }}
          </span>
        </div>

        <h1 class="article-page__title">
          {{ article?.title }}
        </h1>

        <p class="article-page__excerpt">
          {{ article?.excerpt }}
        </p>

        <div class="article-page__content rich-text">
          <StrapiBlocks v-if="article.description" :content="article.description" />
        </div>

        <NuxtLink to="/actualites" class="article-page__back">
          <Icon name="lucide:arrow-left" />
          Retour aux actualités
        </NuxtLink>
      </div>
    </div>

    <div v-else class="loading">
      <p>Article introuvable ou en cours de chargement...</p>
    </div>
  </main>
</template>

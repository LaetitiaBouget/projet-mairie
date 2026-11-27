<script setup>
import { computed } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const route = useRoute()

const { data: strapiResponse } = await useAsyncData(`event-${route.params.id}`, () => {
  if (import.meta.server) {
    return $fetch(`http://localhost:1337/api/events/${route.params.id}?populate=*`)
  }

  return null
})

const event = computed(() => strapiResponse.value?.data || null)

const formatEventDate = (start, end) => {
  if (!start) return ''

  const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris'
  }

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris'
  }

  const startDate = new Date(start)

  const formattedDate = new Intl.DateTimeFormat('fr-FR', dateOptions).format(startDate)

  const formattedStartTime = new Intl.DateTimeFormat('fr-FR', timeOptions).format(startDate)

  if (!end) {
    return `${formattedDate} à ${formattedStartTime}`
  }

  const endDate = new Date(end)

  const formattedEndTime = new Intl.DateTimeFormat('fr-FR', timeOptions).format(endDate)

  return `${formattedDate}, de ${formattedStartTime} à ${formattedEndTime}`
}
</script>

<template>
  <main class="article-page container">
    <div v-if="event" class="article-layout">
      <!-- Image -->
      <img
        v-if="event.image?.url"
        :src="
          event.image?.formats?.large?.url ||
          event.image?.formats?.medium?.url ||
          event.image?.formats?.small?.url ||
          event.image?.url
        "
        :alt="event.title"
        class="article-page__image"
      />

      <div class="article-page__content-wrapper">
        <div class="event-detail__meta-wrapper">
          <div class="event-detail__date-box">
            <div class="event-detail__date-icon">
              <Icon name="lucide:calendar-days" />
            </div>

            <div class="event-detail__date-text">
              <span class="event-detail__date-label">Date de l'événement</span>

              <time class="event-detail__date-value" :datetime="event.date_begin">
                {{ formatEventDate(event.date_begin, event.date_end) }}
              </time>
            </div>
          </div>
        </div>

        <h1 class="article-page__title">
          {{ event.title }}
        </h1>

        <p v-if="event.location">
          {{ event.location }}
        </p>

        <div class="article-page__content rich-text">
          <StrapiBlocks v-if="event.description" :content="event.description" />
        </div>

        <NuxtLink to="/actualites" class="article-page__back">
          <Icon name="lucide:arrow-left" />
          Retour aux actualités
        </NuxtLink>
      </div>
    </div>

    <div v-else>
      <p>Événement introuvable</p>
    </div>
  </main>
</template>

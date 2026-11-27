<script setup>
import { computed } from 'vue'
import InfoBanner from '~/components/InfoBanner.vue'
import AlertBanner from '~/components/AlertBanner.vue'

const { find } = useStrapi()

const { data: alertResponse } = await useAsyncData('alert-home', () => find('alerts'))

const alert = computed(() => (alertResponse.value?.data || []).find((item) => item.is_enabled))

const { data: newsResponse } = await useAsyncData('home-news', () =>
  find('articles', {
    populate: '*',
    sort: ['publishedAt:desc'],
    pagination: {
      pageSize: 3
    }
  })
)

const lastNews = computed(() => {
  const news = newsResponse.value?.data || []

  if (import.meta.client && window.innerWidth <= 1024 && window.innerWidth > 600) {
    return news.slice(0, 2)
  }

  return news
})

const { data: eventsResponse } = await useAsyncData('home-events', () =>
  find('events', {
    populate: '*'
  })
)

const lastEvents = computed(() => {
  const now = new Date()

  const events = (eventsResponse.value?.data || [])
    .filter((event) => {
      return event.date_begin && new Date(event.date_begin) >= now
    })
    .sort((a, b) => new Date(a.date_begin) - new Date(b.date_begin))

  if (import.meta.client && window.innerWidth <= 1024 && window.innerWidth > 600) {
    return events.slice(0, 2)
  }

  return events.slice(0, 3)
})
</script>

<template>
  <AlertBanner v-if="alert" :title="alert.title" :message="alert.message" />
  <main class="landing container">
    <div class="sections__layout">
      <div class="section__news">
        <div class="section__header">
          <h1 class="section__title">Actualités</h1>
          <NuxtLink to="/actualites" class="actus-link">
            <p>Voir toutes les actualités</p>
            <span class="section__icon-wrapper">
              <Icon name="lucide:move-up-right" />
            </span>
          </NuxtLink>
        </div>
        <SectionsSectionActu :newsList="lastNews" />
      </div>

      <div class="section__events">
        <div class="section__header">
          <h1 class="section__title">Agenda</h1>
          <NuxtLink to="/actualites#events" class="actus-link events">
            <p>Voir tout</p>
            <span class="section__icon-wrapper">
              <Icon name="lucide:move-up-right" />
            </span>
          </NuxtLink>
        </div>
        <SectionsSectionEvent :eventsList="lastEvents" :show-image="false" />
      </div>
    </div>
  </main>
  <InfoBanner />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import EventSection from '~/components/sections/SectionEvent.vue'

const { find } = useStrapi()

const { data: strapiResponse } = await useAsyncData('actus-strapi', () =>
  find('articles', { populate: '*' })
)

const allNews = computed(() => {
  return [...(strapiResponse.value?.data || [])].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  )
})

const { data: eventsResponse } = await useAsyncData('events-strapi', () =>
  find('events', { populate: '*' })
)

const allEvents = computed(() => eventsResponse.value?.data || [])

if (import.meta.prerender) {
  prerenderRoutes([
    ...allNews.value
      .filter((article) => article.documentId)
      .map((article) => `/actu/${article.documentId}`),

    ...allEvents.value
      .filter((event) => event.documentId)
      .map((event) => `/event/${event.documentId}`)
  ])
}

const categories = computed(() => {
  const list = allNews.value.map((actu) => actu.category)
  return [...new Set(list)]
})

const selectedCategory = ref('')

const currentNewsIndex = ref(0)

const isMobile = ref(false)
let mobileQuery

const updateMobile = () => {
  isMobile.value = mobileQuery.matches
}

const isTablet = ref(false)
let tabletQuery

const updateTablet = () => {
  isTablet.value = tabletQuery.matches
}

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 600px)')
  updateMobile()
  mobileQuery.addEventListener('change', updateMobile)

  tabletQuery = window.matchMedia('(min-width: 601px) and (max-width: 1024px)')
  updateTablet()
  tabletQuery.addEventListener('change', updateTablet)
})

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', updateMobile)
  tabletQuery?.removeEventListener('change', updateTablet)
})

const newsPerPage = computed(() => (isMobile.value ? 3 : 6))

const filteredNews = computed(() => {
  if (!selectedCategory.value) {
    return allNews.value
  }
  return allNews.value.filter((actu) => actu.category === selectedCategory.value)
})

watch(selectedCategory, () => {
  currentNewsIndex.value = 0
})

const displayedNews = computed(() => {
  return filteredNews.value.slice(
    currentNewsIndex.value,
    currentNewsIndex.value + newsPerPage.value
  )
})

const scrollToNews = () => {
  if (!isMobile.value) return

  document.querySelector('.news-header')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const nextNews = () => {
  if (currentNewsIndex.value + newsPerPage.value < filteredNews.value.length) {
    currentNewsIndex.value += newsPerPage.value
    scrollToNews()
  }
}

const prevNews = () => {
  if (currentNewsIndex.value - newsPerPage.value >= 0) {
    currentNewsIndex.value -= newsPerPage.value
    scrollToNews()
  }
}

const upcomingEvents = computed(() => {
  const now = new Date()

  return [...allEvents.value]
    .filter((event) => new Date(event.date_begin) >= now)
    .sort((a, b) => new Date(a.date_begin) - new Date(b.date_begin))
})

const currentEventIndex = ref(0)

const eventsPerPage = computed(() => (isTablet.value ? 2 : 3))

const displayedEvents = computed(() => {
  return upcomingEvents.value.slice(
    currentEventIndex.value,
    currentEventIndex.value + eventsPerPage.value
  )
})

const scrollToEvents = (sectionId) => {
  if (!isMobile.value) return

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const nextEvents = () => {
  if (currentEventIndex.value + eventsPerPage.value < upcomingEvents.value.length) {
    currentEventIndex.value += eventsPerPage.value
    scrollToEvents('events')
  }
}

const prevEvents = () => {
  if (currentEventIndex.value - eventsPerPage.value >= 0) {
    currentEventIndex.value -= eventsPerPage.value
    scrollToEvents('events')
  }
}

const pastEvents = computed(() => {
  const now = new Date()

  return [...allEvents.value]
    .filter((event) => new Date(event.date_begin) < now)
    .sort((a, b) => new Date(b.date_begin) - new Date(a.date_begin))
})

const currentPastEventIndex = ref(0)

const displayedPastEvents = computed(() => {
  return pastEvents.value.slice(
    currentPastEventIndex.value,
    currentPastEventIndex.value + eventsPerPage.value
  )
})

const nextPastEvents = () => {
  if (currentPastEventIndex.value + eventsPerPage.value < pastEvents.value.length) {
    currentPastEventIndex.value += eventsPerPage.value
    scrollToEvents('past-events')
  }
}

const prevPastEvents = () => {
  if (currentPastEventIndex.value - eventsPerPage.value >= 0) {
    currentPastEventIndex.value -= eventsPerPage.value
    scrollToEvents('past-events')
  }
}
</script>

<template>
  <main class="news-page container">
    <header class="news-header">
      <h1 class="section__title">Actualités</h1>
      <div class="events-slider-header">
        <!-- Filtres ordinateur -->
        <div class="filters">
          <button :class="{ active: selectedCategory === '' }" @click="selectedCategory = ''">
            Toutes
          </button>

          <button
            v-for="cat in categories"
            :key="cat"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Filtre smartphone -->
        <div class="filters-mobile">
          <label for="category-filter">
            <Icon name="lucide:sliders-horizontal" />
            Filtrer :
          </label>

          <select id="category-filter" v-model="selectedCategory">
            <option value="">Toutes les actualités</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div v-if="filteredNews.length > newsPerPage" class="slider-arrows">
          <button class="slider-arrow" :disabled="currentNewsIndex === 0" @click="prevNews">
            <Icon name="lucide:chevron-left" />
          </button>

          <button
            class="slider-arrow"
            :disabled="currentNewsIndex + newsPerPage >= filteredNews.length"
            @click="nextNews"
          >
            <Icon name="lucide:chevron-right" />
          </button>
        </div>
      </div>
    </header>
    <SectionsSectionActu :newsList="displayedNews" />

    <!-- Pagination smartphone des actualités -->
    <div v-if="filteredNews.length > newsPerPage" class="mobile-pagination">
      <button class="pagination-button" :disabled="currentNewsIndex === 0" @click="prevNews">
        <Icon name="lucide:chevron-left" />
        Précédent
      </button>

      <span class="pagination-info">
        Page {{ Math.floor(currentNewsIndex / newsPerPage) + 1 }} /
        {{ Math.ceil(filteredNews.length / newsPerPage) }}
      </span>

      <button
        class="pagination-button"
        :disabled="currentNewsIndex + newsPerPage >= filteredNews.length"
        @click="nextNews"
      >
        Suivant
        <Icon name="lucide:chevron-right" />
      </button>
    </div>

    <section v-if="upcomingEvents.length > 0" class="news-page__events-section" id="events">
      <div class="events-slider-header">
        <h2 class="section__title">Agenda</h2>

        <div v-if="upcomingEvents.length > eventsPerPage" class="slider-arrows">
          <button class="slider-arrow" :disabled="currentEventIndex === 0" @click="prevEvents">
            <Icon name="lucide:chevron-left" />
          </button>
          <button
            class="slider-arrow"
            :disabled="currentEventIndex + eventsPerPage >= upcomingEvents.length"
            @click="nextEvents"
          >
            <Icon name="lucide:chevron-right" />
          </button>
        </div>
      </div>

      <div class="news-page__slider-wrapper">
        <EventSection :eventsList="displayedEvents" class="upcomingEvents" />
      </div>
      <!-- Pagination smartphone de l'Agenda -->
      <div v-if="upcomingEvents.length > eventsPerPage" class="mobile-pagination">
        <button class="pagination-button" :disabled="currentEventIndex === 0" @click="prevEvents">
          <Icon name="lucide:chevron-left" />
          Précédent
        </button>

        <span class="pagination-info">
          Page {{ Math.floor(currentEventIndex / eventsPerPage) + 1 }} /
          {{ Math.ceil(upcomingEvents.length / eventsPerPage) }}
        </span>

        <button
          class="pagination-button"
          :disabled="currentEventIndex + eventsPerPage >= upcomingEvents.length"
          @click="nextEvents"
        >
          Suivant
          <Icon name="lucide:chevron-right" />
        </button>
      </div>
    </section>

    <section
      v-if="pastEvents.length > 0"
      class="news-page__events-section past-events-section"
      id="past-events"
    >
      <div class="events-slider-header">
        <h2 class="section__title">Événements passés</h2>

        <div v-if="pastEvents.length > eventsPerPage" class="slider-arrows">
          <button
            class="slider-arrow"
            :disabled="currentPastEventIndex === 0"
            @click="prevPastEvents"
          >
            <Icon name="lucide:chevron-left" />
          </button>

          <button
            class="slider-arrow"
            :disabled="currentPastEventIndex + eventsPerPage >= pastEvents.length"
            @click="nextPastEvents"
          >
            <Icon name="lucide:chevron-right" />
          </button>
        </div>
      </div>

      <div class="news-page__slider-wrapper">
        <EventSection :eventsList="displayedPastEvents" class="past-events" />
      </div>
      <!-- Pagination smartphone des événements passés -->
      <div v-if="pastEvents.length > eventsPerPage" class="mobile-pagination">
        <button
          class="pagination-button"
          :disabled="currentPastEventIndex === 0"
          @click="prevPastEvents"
        >
          <Icon name="lucide:chevron-left" />
          Précédent
        </button>

        <span class="pagination-info">
          Page {{ Math.floor(currentPastEventIndex / eventsPerPage) + 1 }} /
          {{ Math.ceil(pastEvents.length / eventsPerPage) }}
        </span>

        <button
          class="pagination-button"
          :disabled="currentPastEventIndex + eventsPerPage >= pastEvents.length"
          @click="nextPastEvents"
        >
          Suivant
          <Icon name="lucide:chevron-right" />
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
defineProps({
  title: String,
  date: String,
  time: String,
  category: String,
  excerpt: String,
  description: String,
  image: String,
  id: [Number, String],
  documentId: String,
  detailType: {
    type: String,
    default: 'article'
  }
})

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return ''

  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris'
    })
  }).format(new Date(dateString))
}
</script>

<template>
  <article class="card" :class="{ 'card--minimal': !image }">
    <a
      v-if="documentId || id"
      :href="detailType === 'event' ? `/event/${documentId || id}` : `/actu/${documentId || id}`"
      class="card__whole-link"
    >
      <div v-if="image" class="card__image-wrapper">
        <img :src="image" :alt="title" class="card__image" />
      </div>

      <div class="card__content">
        <span class="card__date">
          {{ formatDate(date, detailType === 'event') }}
        </span>

        <h3 class="card__title">{{ title }}</h3>

        <p v-if="excerpt" class="card__excerpt">{{ excerpt }}</p>

        <span class="card__link">Lire la suite</span>
      </div>
    </a>
  </article>
</template>

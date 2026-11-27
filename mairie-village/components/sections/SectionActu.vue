<script setup>
import CardNews from './Card.vue'

defineProps({
  newsList: {
    type: Array,
    required: true
  }
})

const getNewsProps = (item) => {
  return {
    ...item,
    date: item.publishedAt,
    image:
      item.image?.formats?.medium?.url || item.image?.formats?.small?.url || item.image?.url || ''
  }
}
</script>

<template>
  <section class="news-section">
    <div class="news-section__grid">
      <CardNews
        v-for="item in newsList"
        :key="item.documentId || item.id"
        v-bind="getNewsProps(item)"
      />
    </div>
  </section>
</template>

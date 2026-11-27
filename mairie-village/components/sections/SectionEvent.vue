<script setup>
import CardEvent from './Card.vue'

defineProps({
  eventsList: {
    type: Array,
    required: true
  },
  showImage: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <section class="event-section">
    <div class="event-section__grid event-card-container">
      <CardEvent
        v-for="item in eventsList"
        :key="item.documentId || item.id"
        v-bind="item"
        detail-type="event"
        :date="item.date_begin"
        :image="
          showImage
            ? item.image?.formats?.medium?.url ||
              item.image?.formats?.small?.url ||
              item.image?.url ||
              ''
            : ''
        "
      />
    </div>
  </section>
</template>

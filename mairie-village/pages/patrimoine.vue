```vue
<script setup>
import { computed } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const { find } = useStrapi()

const { data: histoireResponse } = await useAsyncData('histoire', () =>
  find('histoire', {
    populate: '*'
  })
)

const histoire = computed(() => histoireResponse.value?.data)

const { data: patrimoineResponse } = await useAsyncData('patrimoine', () =>
  find('patrimoines', {
    populate: '*',
    sort: ['order:asc']
  })
)

const heritage = computed(() => patrimoineResponse.value?.data || [])

const histoireImage = computed(() => {
  const image = histoire.value?.image

  if (!image) return null

  return (
    image.formats?.large?.url ||
    image.formats?.medium?.url ||
    image.formats?.small?.url ||
    image.url
  )
})
</script>

<template>
  <main class="container heritage-page">
    <h1 class="section__title">Histoire</h1>

    <section v-if="histoire" class="history-section">
      <div class="history-card">
        <div class="history-card__image-container">
          <img
            v-if="histoireImage"
            :src="histoireImage"
            :alt="histoire.title || 'Histoire du village'"
            class="history-card__image"
          />
        </div>

        <div class="history-card__content">
          <h2 class="history-card__title">
            <Icon name="lucide:book-open" class="history-card__icon" />
            {{ histoire.title || "L'histoire de notre village" }}
          </h2>

          <div class="history-card__text rich-text">
            <StrapiBlocks v-if="histoire.description" :content="histoire.description" />
          </div>
        </div>
      </div>
    </section>

    <section v-if="heritage.length" class="monuments-section">
      <h2 class="section__title">Notre patrimoine remarquable</h2>

      <div class="monuments-grid">
        <article v-for="item in heritage" :key="item.documentId" class="monument-card">
          <div class="monument-card__image-container">
            <img
              v-if="item.image?.url"
              :src="
                item.image?.formats?.large?.url ||
                item.image?.formats?.medium?.url ||
                item.image?.formats?.small?.url ||
                item.image?.url
              "
              :alt="item.name"
              class="monument-card__image"
            />
          </div>

          <div class="monument-card__content">
            <h3 class="monument-card__name">{{ item.name }}</h3>

            <div class="monument-card__description rich-text">
              <StrapiBlocks v-if="item.description" :content="item.description" />
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

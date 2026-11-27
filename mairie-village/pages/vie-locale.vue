<script setup>
import { computed } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const { find } = useStrapi()

const { data: hallResponse } = await useAsyncData('local-hall', () =>
  find('salle-communale', { populate: '*' })
)
const hall = computed(() => hallResponse.value?.data || null)

const { data: schoolResponse } = await useAsyncData('local-school', () =>
  find('ecole', { populate: '*' })
)
const school = computed(() => schoolResponse.value?.data || null)

const { data: associationsResponse } = await useAsyncData('local-associations', () =>
  find('associations', { populate: '*', sort: ['order:asc'] })
)
const associations = computed(() => associationsResponse.value?.data || [])

if (import.meta.prerender) {
  prerenderRoutes(
    associations.value
      .filter((association) => association.slug)
      .map((association) => `/associations/${association.slug}`)
  )
}
</script>

<template>
  <main class="container local-life-page">
    <h1 class="section__title">Vie locale</h1>

    <section class="local-section">
      <div class="local-facilities-grid">
        <NuxtLink v-if="hall" to="/salle-communale" class="info-card">
          <div class="info-card__image-container">
            <img
              v-if="hall.main_image?.url"
              :src="hall.main_image?.formats?.medium?.url || hall.main_image?.url"
              :alt="hall.title"
              class="info-card__image"
            />
          </div>

          <div class="info-card__content">
            <h2 class="local-section__title">{{ hall.title }}</h2>
            <div class="rich-text">
              <StrapiBlocks v-if="hall.description" :content="hall.description" />
            </div>
            <div class="alert-box">
              <p class="alert-box__text">
                <strong>En savoir plus</strong>
                <Icon name="lucide:arrow-right" />
              </p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink v-if="school" to="/ecole" class="info-card">
          <div class="info-card__image-container">
            <img
              v-if="school.main_image?.url"
              :src="school.main_image?.formats?.medium?.url || school.main_image?.url"
              :alt="school.title"
              class="info-card__image"
            />

            <div v-if="school.logo?.url" class="info-card__badge-logo">
              <img :src="school.logo?.formats?.small?.url || school.logo?.url" alt="Logo RPI" />
            </div>
          </div>

          <div class="info-card__content">
            <h2 class="local-section__title">{{ school.title }}</h2>
            <div class="rich-text">
              <StrapiBlocks v-if="school.description" :content="school.description" />
            </div>
            <div class="alert-box">
              <p class="alert-box__text">
                <strong>En savoir plus</strong>
                <Icon name="lucide:arrow-right" />
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="local-section">
      <h2 class="section__title">Associations de la commune</h2>

      <div class="assoc-grid">
        <NuxtLink
          v-for="club in associations"
          :key="club.documentId"
          :to="`/associations/${club.slug}`"
          class="assoc-card"
        >
          <div v-if="club.logo?.url" class="assoc-card__image-container">
            <img
              :src="
                club.logo?.formats?.medium?.url || club.logo?.formats?.small?.url || club.logo?.url
              "
              :alt="`Logo de ${club.name}`"
              class="assoc-card__image"
            />
          </div>

          <div class="assoc-card__content">
            <div class="assoc-card__header">
              <Icon name="lucide:users" class="assoc-card__icon" />
              <h3 class="assoc-card__name">{{ club.name }}</h3>
            </div>
            <div class="rich-text">
              <StrapiBlocks v-if="club.description" :content="club.description" />
            </div>
            <div class="alert-box">
              <p class="alert-box__text">
                <strong>En savoir plus</strong>
                <Icon name="lucide:arrow-right" />
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const { find } = useStrapi()

const { data: hallResponse } = await useAsyncData('hall-detail', () =>
  find('salle-communale', { populate: '*' })
)

const hall = computed(() => hallResponse.value?.data || null)

// Pagination de la galerie : 6 photos par page
const photosPerPage = 6
const currentPhotoPage = ref(0)

const displayedImages = computed(() => {
  if (!hall.value?.images) return []

  const start = currentPhotoPage.value * photosPerPage
  return hall.value.images.slice(start, start + photosPerPage)
})

const nextPhotos = () => {
  if (
    hall.value?.images &&
    (currentPhotoPage.value + 1) * photosPerPage < hall.value.images.length
  ) {
    currentPhotoPage.value++
  }
}

const prevPhotos = () => {
  if (currentPhotoPage.value > 0) {
    currentPhotoPage.value--
  }
}

// Gestion de la visionneuse
const selectedImageIndex = ref(null)

const openImage = (index) => {
  selectedImageIndex.value = index
}

const closeImage = () => {
  selectedImageIndex.value = null
}

const previousImage = () => {
  if (selectedImageIndex.value === null || !hall.value?.images?.length) return

  selectedImageIndex.value =
    (selectedImageIndex.value - 1 + hall.value.images.length) % hall.value.images.length
}

const nextImage = () => {
  if (selectedImageIndex.value === null || !hall.value?.images?.length) return

  selectedImageIndex.value = (selectedImageIndex.value + 1) % hall.value.images.length
}

const handleKeydown = (event) => {
  if (selectedImageIndex.value === null) return

  if (event.key === 'Escape') closeImage()
  if (event.key === 'ArrowLeft') previousImage()
  if (event.key === 'ArrowRight') nextImage()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <main v-if="hall" class="container salle-page">
    <NuxtLink to="/vie-locale" class="back-link">
      <Icon name="lucide:arrow-left" />
      Retour à la vie locale
    </NuxtLink>

    <h1 class="section__title">{{ hall.title }}</h1>

    <!-- Présentation avec photo -->
    <section class="salle-presentation">
      <div v-if="hall.main_image?.url" class="salle-main-image">
        <img
          :src="
            hall.main_image.formats?.large?.url ||
            hall.main_image.formats?.medium?.url ||
            hall.main_image.url
          "
          :alt="`Photo de ${hall.title}`"
        />
      </div>

      <div v-if="hall.description" class="salle-presentation__content">
        <h2>Présentation</h2>
        <div class="rich-text">
          <StrapiBlocks :content="hall.description" />
        </div>
      </div>
    </section>

    <!-- Galerie photos -->
    <section v-if="hall.images?.length" class="salle-section">
      <div class="salle-gallery-header">
        <h2>La salle en images</h2>

        <div v-if="hall.images.length > photosPerPage" class="slider-arrows">
          <button
            class="slider-arrow"
            :disabled="currentPhotoPage === 0"
            @click="prevPhotos"
            aria-label="Photos précédentes"
          >
            <Icon name="lucide:chevron-left" />
          </button>

          <button
            class="slider-arrow"
            :disabled="(currentPhotoPage + 1) * photosPerPage >= hall.images.length"
            @click="nextPhotos"
            aria-label="Photos suivantes"
          >
            <Icon name="lucide:chevron-right" />
          </button>
        </div>
      </div>

      <div class="salle-gallery">
        <img
          v-for="(image, index) in displayedImages"
          :key="image.id || index"
          :src="image.formats?.large?.url || image.formats?.medium?.url || image.url"
          :alt="`Photo de la salle communale ${currentPhotoPage * photosPerPage + index + 1}`"
          @click="openImage(currentPhotoPage * photosPerPage + index)"
        />
      </div>
    </section>

    <!-- Visionneuse -->
    <div v-if="selectedImageIndex !== null" class="lightbox" @click.self="closeImage">
      <button class="lightbox__close" @click="closeImage" aria-label="Fermer">
        <Icon name="lucide:x" />
      </button>

      <button
        class="lightbox__nav lightbox__prev"
        @click="previousImage"
        aria-label="Photo précédente"
      >
        <Icon name="lucide:chevron-left" />
      </button>

      <img
        :src="
          hall.images[selectedImageIndex].formats?.large?.url || hall.images[selectedImageIndex].url
        "
        :alt="`Photo de la salle communale ${selectedImageIndex + 1}`"
        class="lightbox__image"
      />

      <button class="lightbox__nav lightbox__next" @click="nextImage" aria-label="Photo suivante">
        <Icon name="lucide:chevron-right" />
      </button>

      <span class="lightbox__counter">{{ selectedImageIndex + 1 }} / {{ hall.images.length }}</span>
    </div>

    <!-- Équipements -->
    <section v-if="hall.equipment" class="salle-section">
      <h2>Équipements</h2>
      <div class="rich-text">
        <StrapiBlocks :content="hall.equipment" />
      </div>
    </section>

    <!-- Tarifs -->
    <section v-if="hall.rental_rates" class="salle-section">
      <h2>Tarifs de location</h2>
      <div class="rich-text">
        <StrapiBlocks :content="hall.rental_rates" />
      </div>
    </section>

    <!-- Conditions -->
    <section v-if="hall.rental_rules" class="salle-section">
      <h2>Conditions de location</h2>
      <div class="rich-text">
        <StrapiBlocks :content="hall.rental_rules" />
      </div>
    </section>

    <!-- Réservation -->
    <section v-if="hall.booking_info" class="salle-section">
      <h2>Réservation</h2>
      <div class="rich-text">
        <StrapiBlocks :content="hall.booking_info" />
      </div>
      <p>Pour toute demande, contactez la mairie.</p>
    </section>

    <!-- Documents -->
    <section v-if="hall.documents?.length" class="salle-section">
      <h2>Documents à télécharger</h2>
      <ul>
        <li v-for="document in hall.documents" :key="document.id">
          <a :href="document.url" target="_blank" rel="noopener noreferrer">
            <Icon name="lucide:file-text" />
            {{ document.name }}
          </a>
        </li>
      </ul>
    </section>
  </main>
</template>

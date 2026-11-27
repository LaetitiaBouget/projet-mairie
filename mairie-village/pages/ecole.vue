<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const { find } = useStrapi()

const { data: schoolResponse } = await useAsyncData('school-detail', () =>
  find('ecole', { populate: '*' })
)

const school = computed(() => schoolResponse.value?.data || null)

// Pagination de la galerie : 6 photos par page
const photosPerPage = 6
const currentPhotoPage = ref(0)

const displayedImages = computed(() => {
  if (!school.value?.images) return []

  const start = currentPhotoPage.value * photosPerPage

  return school.value.images.slice(start, start + photosPerPage)
})

const nextPhotos = () => {
  if (
    school.value?.images &&
    (currentPhotoPage.value + 1) * photosPerPage < school.value.images.length
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
  if (selectedImageIndex.value === null || !school.value?.images?.length) return

  selectedImageIndex.value =
    (selectedImageIndex.value - 1 + school.value.images.length) % school.value.images.length
}

const nextImage = () => {
  if (selectedImageIndex.value === null || !school.value?.images?.length) return

  selectedImageIndex.value = (selectedImageIndex.value + 1) % school.value.images.length
}

// Navigation au clavier
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
  <main v-if="school" class="container school-page">
    <NuxtLink to="/vie-locale" class="back-link">
      <Icon name="lucide:arrow-left" />
      Retour à la vie locale
    </NuxtLink>

    <h1 class="section__title">{{ school.title }}</h1>

    <!-- Présentation avec photo -->
    <section
      class="school-presentation"
      :class="{ 'school-presentation--text-only': !school.main_image?.url }"
    >
      <div v-if="school.main_image?.url" class="school-main-image">
        <img
          :src="
            school.main_image.formats?.large?.url ||
            school.main_image.formats?.medium?.url ||
            school.main_image.url
          "
          :alt="`Photo de ${school.title}`"
        />
      </div>

      <div v-if="school.description" class="school-presentation__content">
        <h2>Présentation</h2>
        <div class="rich-text">
          <StrapiBlocks :content="school.description" />
        </div>
      </div>
    </section>

    <!-- Galerie photos -->
    <section v-if="school.images?.length" class="school-section">
      <div class="school-gallery-header">
        <h2>L'école en images</h2>

        <div v-if="school.images.length > photosPerPage" class="slider-arrows">
          <button class="slider-arrow" :disabled="currentPhotoPage === 0" @click="prevPhotos">
            <Icon name="lucide:chevron-left" />
          </button>

          <button
            class="slider-arrow"
            :disabled="(currentPhotoPage + 1) * photosPerPage >= school.images.length"
            @click="nextPhotos"
          >
            <Icon name="lucide:chevron-right" />
          </button>
        </div>
      </div>

      <div class="school-gallery">
        <img
          v-for="(image, index) in displayedImages"
          :key="image.id || index"
          :src="image.formats?.large?.url || image.formats?.medium?.url || image.url"
          :alt="`Photo de l'école ${currentPhotoPage * photosPerPage + index + 1}`"
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
          school.images[selectedImageIndex].formats?.large?.url ||
          school.images[selectedImageIndex].url
        "
        :alt="`Photo de l'école ${selectedImageIndex + 1}`"
        class="lightbox__image"
      />

      <button class="lightbox__nav lightbox__next" @click="nextImage" aria-label="Photo suivante">
        <Icon name="lucide:chevron-right" />
      </button>

      <span class="lightbox__counter">
        {{ selectedImageIndex + 1 }} / {{ school.images.length }}
      </span>
    </div>

    <!-- Informations pratiques -->
    <section v-if="school.details" class="school-section">
      <h2>Informations pratiques</h2>
      <div class="rich-text">
        <StrapiBlocks :content="school.details" />
      </div>
    </section>

    <!-- Direction -->
    <section
      v-if="school.director_name || school.director_email || school.director_phone"
      class="school-section"
    >
      <h2>La direction</h2>

      <p v-if="school.director_name">
        <strong>Direction :</strong>
        {{ school.director_name }}
      </p>

      <p v-if="school.director_email">
        <strong>Email :</strong>
        <a :href="`mailto:${school.director_email}`">
          {{ school.director_email }}
        </a>
      </p>

      <p v-if="school.director_phone">
        <strong>Téléphone :</strong>
        <a :href="`tel:${school.director_phone}`">
          {{ school.director_phone }}
        </a>
      </p>
    </section>
  </main>
</template>

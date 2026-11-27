<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const route = useRoute()
const { find } = useStrapi()

const { data: associationResponse } = await useAsyncData(`association-${route.params.slug}`, () =>
  find('associations', {
    filters: {
      slug: {
        $eq: route.params.slug
      }
    },
    populate: '*'
  })
)

const association = computed(() => associationResponse.value?.data?.[0] || null)

// Pagination de la galerie : 6 photos par page
const photosPerPage = 6
const currentPhotoPage = ref(0)

const displayedImages = computed(() => {
  if (!association.value?.images) return []

  const start = currentPhotoPage.value * photosPerPage
  return association.value.images.slice(start, start + photosPerPage)
})

const nextPhotos = () => {
  if (
    association.value?.images &&
    (currentPhotoPage.value + 1) * photosPerPage < association.value.images.length
  ) {
    currentPhotoPage.value++
  }
}

const prevPhotos = () => {
  if (currentPhotoPage.value > 0) {
    currentPhotoPage.value--
  }
}

// Visionneuse
const selectedImageIndex = ref(null)

const openImage = (index) => {
  selectedImageIndex.value = index
}

const closeImage = () => {
  selectedImageIndex.value = null
}

const previousImage = () => {
  if (selectedImageIndex.value === null || !association.value?.images?.length) return

  selectedImageIndex.value =
    (selectedImageIndex.value - 1 + association.value.images.length) %
    association.value.images.length
}

const nextImage = () => {
  if (selectedImageIndex.value === null || !association.value?.images?.length) return

  selectedImageIndex.value = (selectedImageIndex.value + 1) % association.value.images.length
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
  <main v-if="association" class="container association-page">
    <NuxtLink to="/vie-locale" class="back-link">
      <Icon name="lucide:arrow-left" />
      Retour à la vie locale
    </NuxtLink>

    <h1 class="section__title">{{ association.name }}</h1>

    <!-- Logo et présentation -->
    <div class="association-intro">
      <div v-if="association.logo?.url" class="association-logo">
        <img :src="association.logo.url" :alt="`Logo de ${association.name}`" />
      </div>

      <section v-if="association.description" class="association-section">
        <h2>Présentation</h2>
        <StrapiBlocks :content="association.description" />
      </section>
    </div>

    <!-- Galerie photos -->
    <section v-if="association.images?.length" class="association-section">
      <div class="association-gallery-header">
        <h2>Nos activités en images</h2>

        <div v-if="association.images.length > photosPerPage" class="slider-arrows">
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
            :disabled="(currentPhotoPage + 1) * photosPerPage >= association.images.length"
            @click="nextPhotos"
            aria-label="Photos suivantes"
          >
            <Icon name="lucide:chevron-right" />
          </button>
        </div>
      </div>

      <div class="association-gallery">
        <img
          v-for="(image, index) in displayedImages"
          :key="image.id || index"
          :src="image.formats?.large?.url || image.formats?.medium?.url || image.url"
          :alt="`Photo de ${association.name} ${currentPhotoPage * photosPerPage + index + 1}`"
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
          association.images[selectedImageIndex].formats?.large?.url ||
          association.images[selectedImageIndex].url
        "
        :alt="`Photo de ${association.name} ${selectedImageIndex + 1}`"
        class="lightbox__image"
      />

      <button class="lightbox__nav lightbox__next" @click="nextImage" aria-label="Photo suivante">
        <Icon name="lucide:chevron-right" />
      </button>

      <span class="lightbox__counter">
        {{ selectedImageIndex + 1 }} / {{ association.images.length }}
      </span>
    </div>

    <!-- Contact -->
    <section
      v-if="
        association.contact_name ||
        association.contact_email ||
        association.contact_phone ||
        association.website
      "
      class="association-section"
    >
      <h2>Contact</h2>

      <p v-if="association.contact_name">
        <strong>Responsable :</strong>
        {{ association.contact_name }}
      </p>

      <p v-if="association.contact_email">
        <strong>Email :</strong>
        <a :href="`mailto:${association.contact_email}`">
          {{ association.contact_email }}
        </a>
      </p>

      <p v-if="association.contact_phone">
        <strong>Téléphone :</strong>
        <a :href="`tel:${association.contact_phone}`">
          {{ association.contact_phone }}
        </a>
      </p>

      <p v-if="association.website">
        <strong>Site internet :</strong>
        <a :href="association.website" target="_blank" rel="noopener noreferrer">Visiter le site</a>
      </p>
    </section>
  </main>

  <main v-else class="container association-page">
    <h1>Association introuvable</h1>
    <NuxtLink to="/vie-locale">Retour à la vie locale</NuxtLink>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const { find } = useStrapi()

const { data: mairieResponse } = await useAsyncData('town-hall-info', () => find('town-hall-info'))

const mairie = computed(() => mairieResponse.value?.data || null)
</script>

<template>
  <section v-if="mairie" class="info-banner">
    <div class="info-banner__container container">
      <div class="info-banner__block">
        <div class="info-banner__icon-wrapper">
          <Icon name="lucide:clock" />
        </div>
        <div class="info-banner__content">
          <h3 class="info-banner__title">Horaires d'ouverture</h3>
          <div class="info-banner__hours rich-text">
            <StrapiBlocks v-if="mairie.opening_hours" :content="mairie.opening_hours" />
          </div>
        </div>
      </div>

      <div class="info-banner__block">
        <div class="info-banner__icon-wrapper">
          <Icon name="lucide:phone" />
        </div>
        <div class="info-banner__content">
          <h3 class="info-banner__title">Contact Secrétariat</h3>
          <p v-if="mairie.town_phone_number" class="info-banner__text">
            {{ mairie.town_phone_number }}
          </p>
          <a
            v-if="mairie.town_email"
            :href="`mailto:${mairie.town_email}`"
            class="info-banner__link"
          >
            {{ mairie.town_email }}
          </a>
        </div>
      </div>

      <div class="info-banner__block">
        <div class="info-banner__icon-wrapper">
          <Icon name="lucide:map-pin" />
        </div>
        <div class="info-banner__content">
          <h3 class="info-banner__title">Venir à la Mairie</h3>
          <p class="info-banner__text">
            {{ mairie.town_address }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

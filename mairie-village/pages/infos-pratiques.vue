<script setup>
import { computed } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const { find } = useStrapi()

const { data: mairieResponse } = await useAsyncData('practical-town-info', () =>
  find('town-hall-info')
)

const mairie = computed(() => mairieResponse.value?.data || null)

const services = [
  {
    id: 1,
    title: 'Déclaration Préalable d’Urbanisme (DP)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F17578'
  },
  {
    id: 2,
    title: 'Permis de Construire',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F1986'
  },
  {
    id: 3,
    title: 'Demande de carte d’identité / Passeport',
    url: 'https://www.ants.gouv.fr'
  }
]

const emergencyNumbers = [
  { name: 'Urgences Médicales / SAMU', number: '15' },
  { name: 'Sapeurs-Pompiers', number: '18' },
  { name: 'Gendarmerie (Semur)', number: '17' }
]
</script>

<template>
  <main class="container practical-page">
    <h1 class="section__title">Infos pratiques</h1>

    <div class="practical-grid">
      <section class="practical-card" id="dechets">
        <div class="practical-card__header">
          <Icon name="lucide:trash-2" class="practical-card__icon" />
          <h2 class="practical-card__title">Gestion des déchets</h2>
        </div>
        <div class="practical-card__content">
          <div class="rich-text">
            <StrapiBlocks
              v-if="mairie?.waste_collection_info"
              :content="mairie.waste_collection_info"
            />
          </div>

          <div class="sub-block">
            <h3 class="sub-block__title">📍 Déchèteries</h3>
            <div class="rich-text">
              <StrapiBlocks
                v-if="mairie?.waste_recycling_center_info"
                :content="mairie.waste_recycling_center_info"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="practical-card" id="services">
        <div class="practical-card__header">
          <Icon name="lucide:file-signature" class="practical-card__icon" />
          <h2 class="practical-card__title">Démarches & Urbanisme</h2>
        </div>
        <div class="practical-card__content">
          <p class="practical-card__intro">
            Accédez directement aux formulaires officiels sur Service-Public.fr :
          </p>
          <ul class="demarches-list">
            <li v-for="item in services" :key="item.id">
              <NuxtLink :to="item.url" target="_blank" class="demarche-item">
                <span>{{ item.title }}</span>
                <Icon name="lucide:arrow-up-right" class="demarche-item__icon" />
              </NuxtLink>
            </li>
          </ul>
        </div>
      </section>

      <section class="practical-card practical-card--danger">
        <div class="practical-card__header">
          <Icon name="lucide:phone-call" class="practical-card__icon" />
          <h2 class="practical-card__title">Numéros importants</h2>
        </div>
        <div class="practical-card__content">
          <ul class="emergency-list">
            <li v-for="(contact, index) in emergencyNumbers" :key="index" class="emergency-item">
              <span class="emergency-item__name">{{ contact.name }}</span>
              <a :href="`tel:${contact.number}`" class="emergency-item__number">
                {{ contact.number }}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </main>
</template>

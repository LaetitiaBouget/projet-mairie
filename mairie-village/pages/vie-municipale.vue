<script setup>
import { computed } from 'vue'
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'

const { find } = useStrapi()

const { data: mayorResponse } = await useAsyncData('municipality-mayor', () =>
  find('maire', { populate: '*' })
)

const mayor = computed(() => mayorResponse.value?.data || null)

const { data: councilResponse } = await useAsyncData('municipality-council', () =>
  find('conseillers', {
    populate: '*',
    sort: ['order:asc']
  })
)

const council = computed(() => councilResponse.value?.data || [])

const { data: mairieResponse } = await useAsyncData('municipality-town-info', () =>
  find('town-hall-info')
)

const mairie = computed(() => mairieResponse.value?.data || null)

const { data: documentsResponse } = await useAsyncData('official-documents', () =>
  find('official-documents', { populate: '*' })
)

const officialDocuments = computed(() => documentsResponse.value?.data || [])
</script>

<template>
  <main class="container municipality-page">
    <h1 class="section__title">Vie municipale</h1>

    <section v-if="mayor" class="mayor-section">
      <div class="mayor-card">
        <img
          v-if="mayor.image?.url"
          :src="mayor.image?.formats?.small?.url || mayor.image?.url"
          :alt="mayor.name"
          class="mayor-card__image"
        />
        <div class="mayor-card__content">
          <span class="mayor-card__role">{{ mayor.role }}</span>
          <h2 class="mayor-card__name">{{ mayor.name }}</h2>
          <div class="mayor-card__text">
            <div class="mayor-card__message rich-text">
              <StrapiBlocks v-if="mayor.message" :content="mayor.message" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="council-section">
      <h2 class="section__title">Le Conseil Municipal</h2>

      <div class="council-grid">
        <div v-for="member in council" :key="member.id" class="member-card">
          <img
            v-if="member.image?.url"
            :src="
              member.image?.formats?.medium?.url ||
              member.image?.formats?.small?.url ||
              member.image?.url
            "
            :alt="member.name"
            class="member-card__image"
          />

          <div class="member-card__content">
            <h3 class="member-card__name">{{ member.name }}</h3>
            <span class="member-card__role">{{ member.role }}</span>

            <div
              v-if="member.commissions && member.commissions.length > 0"
              class="member-card__commissions"
            >
              <span class="commissions-title">Commissions :</span>
              <div class="commissions-tags">
                <span
                  v-for="commission in member.commissions"
                  :key="commission"
                  class="commission-tag"
                >
                  {{ commission }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="admin-section">
      <div class="admin-grid">
        <div class="admin-card">
          <div class="admin-card__header">
            <Icon name="lucide:clock" class="admin-card__icon" />
            <h2 class="admin-card__title">Horaires & Secrétariat</h2>
          </div>
          <div class="admin-card__content">
            <div class="hours-list rich-text">
              <StrapiBlocks v-if="mairie?.opening_hours" :content="mairie.opening_hours" />
            </div>

            <hr class="admin-separator" />

            <div v-if="mairie">
              <p v-if="mairie.town_address" class="contact-line">
                <strong>
                  <Icon name="lucide:map-pin" class="admin-card__icon" />
                  Adresse :
                </strong>
                {{ mairie.town_address }}
              </p>

              <p v-if="mairie.town_phone_number" class="contact-line">
                <strong>
                  <Icon name="lucide:phone" class="admin-card__icon" />
                  Téléphone :
                </strong>
                <a :href="`tel:${mairie.town_phone_number}`">
                  {{ mairie.town_phone_number }}
                </a>
              </p>

              <p v-if="mairie.town_email" class="contact-line">
                <strong>
                  <Icon name="lucide:mail" class="admin-card__icon" />
                  Email :
                </strong>
                <a :href="`mailto:${mairie.town_email}`">
                  {{ mairie.town_email }}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card__header">
            <Icon name="lucide:file-text" class="admin-card__icon" />
            <h2 class="admin-card__title">Publications officielles</h2>
          </div>
          <div class="admin-card__content">
            <p class="admin-card__subtitle">Actes administratifs et documents officiels :</p>
            <ul class="docs-list">
              <li v-for="doc in officialDocuments" :key="doc.documentId">
                <a
                  v-if="doc.pdf_file?.url"
                  :href="doc.pdf_file.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="doc-link"
                >
                  <Icon name="lucide:download" class="doc-link__icon" />
                  {{ doc.title }}
                </a>
              </li>
            </ul>

            <div class="admin-redirect-box">
              <p class="admin-redirect-box__text">
                <strong>Besoin de réaliser une démarche ?</strong>
                <br />
                Urbanisme, gestion des déchets, numéros d'urgence...
              </p>
              <NuxtLink to="/infos-pratiques#services" class="admin-redirect-box__link">
                Consulter les infos pratiques
                <Icon name="lucide:arrow-right" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

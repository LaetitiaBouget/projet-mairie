<script setup>
import { computed, ref } from 'vue'

const navigation = [
  { label: 'Accueil', url: '/' },
  { label: 'Actualités', url: '/actualites' },
  { label: 'Vie municipale', url: '/vie-municipale' },
  { label: 'Vie locale', url: '/vie-locale' },
  { label: 'Infos pratiques', url: '/infos-pratiques' },
  { label: 'Patrimoine', url: '/patrimoine' }
]

const { find } = useStrapi()

const { data: mairieResponse } = await useAsyncData('navbar-town-info', () =>
  find('town-hall-info')
)

const phoneNumber = computed(() => mairieResponse.value?.data?.town_phone_number || '')

const showPhone = ref(false)

const menuOpen = ref(false)
</script>

<template>
  <div class="navbar-actions">
    <nav class="navbar">
      <button
        class="navbar__toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="Ouvrir ou fermer le menu"
        @click="menuOpen = !menuOpen"
      >
        <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" />
      </button>

      <ul class="navbar__list" :class="{ 'navbar__list--open': menuOpen }">
        <li v-for="item in navigation" :key="item.url">
          <NuxtLink :to="item.url" class="navbar__link" @click="menuOpen = false">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="contact-link-wrapper">
      <button
        v-if="!showPhone"
        class="contact-link"
        type="button"
        @click="showPhone = true"
        aria-label="Afficher le numéro de téléphone"
      >
        <Icon name="lucide:phone" />
      </button>

      <button
        v-else
        class="phone-number"
        type="button"
        @click="showPhone = false"
        title="Cliquer pour masquer le numéro"
      >
        {{ phoneNumber }}
      </button>
    </div>
  </div>
</template>

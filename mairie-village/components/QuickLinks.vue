<script setup>
const quickLinks = [
  {
    label: 'Agenda',
    url: '/actualites#events',
    description: 'Fêtes & Événements',
    icon: 'lucide:calendar'
  },
  {
    label: 'Salle des fêtes',
    url: '/salle-communale#salle-communale',
    description: 'Informations & Réservations',
    icon: 'lucide:key'
  },
  {
    label: 'École',
    url: '/ecole',
    description: 'Informations & inscriptions',
    icon: 'lucide:school'
  },

  {
    label: 'Déchets',
    url: '/infos-pratiques#dechets',
    description: 'Collecte & Tri',
    icon: 'lucide:trash-2'
  },

  {
    label: 'Mairie',
    url: '/municipalite#equipe',
    description: 'Horaires, contact & élus',
    icon: 'lucide:building'
  }
]
</script>

<template>
  <section class="quick-links" aria-labelledby="quick-links-title">
    <ul class="quick-links__list">
      <li v-for="item in quickLinks" :key="item.url" class="quick-links__card">
        <NuxtLink class="quick-links__link" :to="item.url">
          <div class="quick-links__top">
            <Icon :name="item.icon" class="quick-links__icon" />

            <span class="quick-links__label">
              {{ item.label }}
            </span>
          </div>

          <span v-if="item.description" class="quick-links__description">
            {{ item.description }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

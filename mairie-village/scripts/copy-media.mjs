import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const source = resolve('../cms-mairie/public/uploads')
const destination = resolve('public/uploads')

try {
  await rm(destination, { recursive: true, force: true })

  await mkdir(destination, { recursive: true })

  await cp(source, destination, { recursive: true, force: true })

  console.log('✅ Médias Strapi synchronisés avec Nuxt.')
} catch (error) {
  console.error('❌ Erreur lors de la synchronisation des médias :', error.message)
  process.exitCode = 1
}

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qda0c21o',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2022-03-07',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function seedSiteSettings() {
  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    brand: {
      name: 'Diego NR',
      fullName: 'Diego Navarro Rodriguez',
      tagline_es: [
        {
          _key: 'e1',
          _type: 'block',
          children: [{ _key: 'c1', _type: 'span', text: 'Solutions Architect & Full-Stack Developer' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      tagline_en: [
        {
          _key: 'e1',
          _type: 'block',
          children: [{ _key: 'c1', _type: 'span', text: 'Solutions Architect & Full-Stack Developer' }],
          markDefs: [],
          style: 'normal',
        },
      ],
    },
    contact: {
      email: 'hola@diegonr.com',
      location_es: 'Madrid, España',
      location_en: 'Madrid, Spain',
    },
    socialLinks: [
      { _key: 'l1', platform: 'LinkedIn', url: 'https://linkedin.com/in/diegonr' },
      { _key: 'l2', platform: 'GitHub', url: 'https://github.com/500byte' },
    ],
    seo: {
      siteUrl: 'https://diegonr.com',
    },
    copyright: `© ${new Date().getFullYear()} Diego NR. All rights reserved.`,
  }

  console.log('Seeding site settings...')
  try {
    await client.createOrReplace(doc)
    console.log('✅ Site settings seeded successfully!')
  } catch (err) {
    console.error('❌ Error seeding site settings:', err.message)
  }
}

seedSiteSettings()

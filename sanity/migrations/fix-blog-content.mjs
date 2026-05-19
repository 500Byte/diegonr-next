import { getCliClient } from 'sanity/cli'

const POST_ID = '81b9177b-0c1a-4e4f-8724-822a6f21f0e3'
const client = getCliClient()

async function main() {
  console.log('Fetching post content...')
  const doc = await client.fetch('*[_id == $id][0]{content}', { id: POST_ID })
  
  if (!doc || !doc.content) {
    console.error('Post not found or has no content')
    return
  }

  let content = doc.content
  const initialCount = content.length
  console.log(`Initial block count: ${initialCount}`)

  // Step 1: Log detected invalid list styles
  const bulletStyleCount = content.filter(b => b._type === 'block' && b.style === 'bullet').length
  const numberStyleCount = content.filter(b => b._type === 'block' && b.style === 'number').length
  console.log(`Detected invalid styles: ${bulletStyleCount} bullets, ${numberStyleCount} numbers`)

  // Step 2: Convert style: bullet/number to proper listItem structure
  content = content.map(block => {
    if (block._type === 'block') {
      if (block.style === 'bullet') {
        return { ...block, style: 'normal', listItem: 'bullet' }
      }
      if (block.style === 'number') {
        return { ...block, style: 'normal', listItem: 'number' }
      }
    }
    return block
  })
}

main()

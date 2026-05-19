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

  // Logic will go here
}

main()

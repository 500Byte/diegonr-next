import { reader } from './src/lib/keystatic';

async function test() {
  const projects = await reader.collections.projects.all();
  console.log("Projects:", projects.length);
  const services = await reader.collections.services.all();
  console.log("Services:", services.length);
  const posts = await reader.collections.posts.all();
  console.log("Posts:", posts.length);
}

test();

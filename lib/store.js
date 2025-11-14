import { getClient } from './client.js'

export async function uploadFile(buffer) {
  const client = getClient()
  const { root } = await client.uploadFile(buffer)
  return root
}

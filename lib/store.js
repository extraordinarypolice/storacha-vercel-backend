import { getClient } from './client.js'

export async function uploadFile(buffer) {
  const client = getClient()
  const cid = await client.storeFile(buffer)
  return cid
}


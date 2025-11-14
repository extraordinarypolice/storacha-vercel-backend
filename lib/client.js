import { create } from '@storacha/client'

export function getClient() {
  const privateKey = process.env.PRIVATE_KEY
  const proof = process.env.PROOF

  if (!privateKey || !proof) {
    throw new Error("Missing PRIVATE_KEY or PROOF in environment")
  }

  return create({
    privateKey,
    proofs: [proof]
  })
}

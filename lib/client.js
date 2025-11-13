import { create } from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import * as Proof from "@web3-storage/w3up-client/proof";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import dotenv from "dotenv";
dotenv.config();

let _client = null;

export async function getClient() {
  if (_client) return _client;

  if (!process.env.PRIVATE_KEY || !process.env.PROOF) {
    throw new Error("PRIVATE_KEY and PROOF environment variables are required");
  }

  const signer = Signer.parse(process.env.PRIVATE_KEY);
  const store = new StoreMemory();
  const client = await create({ principal: signer, store });

  const proof = await Proof.parse(process.env.PROOF);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());

  console.log("Storacha client initialized. Server DID:", signer.did(), "Space DID:", space.did());

  _client = client;
  return _client;
}

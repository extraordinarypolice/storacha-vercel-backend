# Storacha Vercel Backend (Upload API)

Vercel-ready serverless backend that accepts file uploads and stores them to Storacha (w3up).

## Env vars (set in Vercel)
- PRIVATE_KEY — your server agent private key (ed25519)
- PROOF — UCAN proof delegating space permissions to the agent

## Local test
1. Install:
   npm install
2. Create .env with PRIVATE_KEY, PROOF
3. Run:
   npx vercel dev
4. Test:
   curl -X POST http://localhost:3000/api/upload -F "file=@./path/to/file.png"


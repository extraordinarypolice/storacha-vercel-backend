import { uploadFile } from '../lib/store.js'

export const config = {
  runtime: "nodejs18.x",
}

export default async function handler(req, res) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const cid = await uploadFile(buffer)
    return res.status(200).json({ cid })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

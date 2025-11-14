import busboy from "busboy"
import { uploadFile } from "../lib/store.js"

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const bb = busboy({ headers: req.headers })
  let fileUploaded = null

  bb.on("file", (fieldname, file, filename) => {
    const chunks = []
    file.on("data", (d) => chunks.push(d))
    file.on("end", () => {
      fileUploaded = { buffer: Buffer.concat(chunks), filename }
    })
  })

  bb.on("finish", async () => {
    if (!fileUploaded) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const root = await uploadFile(fileUploaded.buffer)
    return res.status(200).json({ root })
  })

  req.pipe(bb)
}

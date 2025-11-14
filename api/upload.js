import { uploadFile } from '../lib/store.js'
import fs from 'fs'
import { IncomingForm } from 'formidable'

export const config = {
  runtime: "nodejs",
  api: {
    bodyParser: false
  }
}

export default function handler(req, res) {
  try {
    const form = new IncomingForm()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      const file = files.file
      const buffer = await fs.promises.readFile(file.filepath)

      const cid = await uploadFile(buffer)
      return res.status(200).json({ cid })
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

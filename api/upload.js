import formidable from "formidable";
import fs from "fs";
import { storeFiles } from "../lib/storacha.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Form parse error", message: err });
    }

    try {
      const uploadedFiles = Array.isArray(files.files)
        ? files.files
        : [files.files];

      const fileBuffers = uploadedFiles.map((file) => ({
        name: file.originalFilename,
        size: file.size,
        buffer: fs.readFileSync(file.filepath),
      }));

      const result = await storeFiles(fileBuffers);

      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: "Upload failed", message: e.message });
    }
  });
}

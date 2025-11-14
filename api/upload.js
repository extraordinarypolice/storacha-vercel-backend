import formidable from "formidable";
import fs from "fs";
import { storeFiles } from "../lib/store.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const form = formidable({ multiples: true, keepExtensions: true });

    const files = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve(files);
      });
    });

    const uploaded = [].concat(files.files || files.file || []);

    const results = [];
    for (const file of uploaded) {
      const buffer = fs.readFileSync(file.filepath);
      const cid = await storeFiles(buffer, file.originalFilename);
      results.push({ cid, file: file.originalFilename });
    }

    return res.status(200).json({ uploaded: results });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({ error: "Upload failed", message: error.message });
  }
}

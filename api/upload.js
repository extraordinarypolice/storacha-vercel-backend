export const config = {
  api: {
    bodyParser: false,
  },
};

import { storeFiles } from "../lib/store.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Parse multipart form using Web API (supported by Vercel)
    const formData = await req.formData();

    const files = formData.getAll("files");
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const results = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name;

      // Upload using your Storacha function
      const cid = await storeFiles(buffer, filename);

      results.push({ cid, file: filename });
    }

    return res.status(200).json({ uploaded: results });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res
      .status(500)
      .json({ error: "Upload failed", message: error.message });
  }
}

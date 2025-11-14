import formidable from "formidable";
import fs from "fs";
import { uploadFile } from "../lib/store.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ error: err.message });
      }

      const file = files.file?.[0];
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const buffer = await fs.promises.readFile(file.filepath);

      const cid = await uploadFile(buffer);

      return res.status(200).json({ cid });
    } catch (e) {
      console.error("Handler crash:", e);
      return res.status(500).json({ error: e.message });
    }
  });
}

import { uploadFile } from "../lib/store.js";
import fs from "fs";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false, // Required!
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ error: err.message });
      }

      const file = files.file;
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

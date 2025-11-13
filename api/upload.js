import { Readable } from "node:stream";
import Busboy from "busboy";
import { getClient } from "../lib/client.js";

/**
 * Parse multipart/form-data using busboy and return array of files:
 * [{ filename, mimeType, buffer }]
 */
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const bb = new Busboy({ headers: req.headers });
    const files = [];

    bb.on("file", (fieldname, fileStream, info) => {
      const { filename, mimeType } = info;
      const chunks = [];
      fileStream.on("data", (chunk) => chunks.push(chunk));
      fileStream.on("end", () => {
        files.push({
          fieldname,
          filename,
          mimeType,
          buffer: Buffer.concat(chunks),
        });
      });
      fileStream.on("error", reject);
    });

    bb.on("error", reject);
    bb.on("finish", () => resolve(files));
    req.pipe(bb);
  });
}

/**
 * Helper: make a web ReadableStream from a Buffer for uploadDirectory
 */
function bufferToWebStream(buffer) {
  return Readable.toWeb(Readable.from([buffer]));
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const files = await parseMultipart(req);

    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    const client = await getClient();

    if (files.length === 1) {
      const f = files[0];
      const cid = await client.uploadFile(f.buffer, { name: f.filename });
      res.status(200).json({
        type: "single",
        fileName: f.filename,
        cid: cid.toString(),
        gateway: `https://w3s.link/ipfs/${cid.toString()}`,
      });
      return;
    }

    const items = files.map((f) => ({
      name: f.filename,
      stream: () => bufferToWebStream(f.buffer),
    }));

    const root = await client.uploadDirectory(items);

    res.status(200).json({
      type: "directory",
      fileCount: files.length,
      root: root.toString(),
      gateway: `https://w3s.link/ipfs/${root.toString()}`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", message: err?.message || String(err) });
  }
}

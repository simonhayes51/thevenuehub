import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const dist = path.join(__dirname, "dist");

app.use(express.static(dist, { maxAge: "1y", index: false }));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ BookedUp serving /dist on :${PORT}`));

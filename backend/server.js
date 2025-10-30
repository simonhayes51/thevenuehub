import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get("*", (_, res) =>
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
);

app.listen(port, () => console.log(`🎧 BookedUp live on port ${port}`));

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import { readFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const route = "/api/projects";
const timeTracker = `Server running on PORT ${PORT}`;
const filePath = path.join(__dirname, "projects.json");
const frontendPath = path.join(__dirname, "..", "src");

const app = express();
app.use(express.json());
app.use(cors());

// Statische Dateien aus dem "public" Ordner bereitstellen
app.use(express.static(frontendPath));


app.get(route, (_, res) => {
  try {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(500).send("Error reading projects.json file");
      }

      const projects = JSON.parse(data);
      return res.status(200).send(projects);
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: error, message: "Internal Server Error" });
  }
});

// Falls jemand direkt auf die API-Route im Browser geht
app.get("/", (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
  res.sendFile(path.join(frontendPath, "styles.css"));
});

app.listen(PORT, () => console.log(timeTracker));

console.log("Project started at http://localhost:3000");
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const route = "/api/projects";
const timeTracker = `Server running on PORT ${PORT}`;
const filePath = path.join(__dirname, "projects.json");

const app = express();
app.use(express.json());
app.use(cors());

// Serve index.html from src directory FIRST (before static middleware)
app.get("/", (_, res) => {
  const indexPath = path.join(__dirname, '..', 'src', 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Statische Dateien aus dem "src" Ordner bereitstellen
const srcPath = path.join(__dirname, '..', 'src');
app.use(express.static(srcPath));

app.get(route, (_, res) => {
  try {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(500).send("Error reading projects.json file");
      }

      try {
        const projects = JSON.parse(data);
        return res.status(200).json(projects);
      } catch (parseError) {
        console.error("Invalid JSON in projects.json:", parseError);
        return res
          .status(500)
          .json({ message: "Invalid projects.json format. Please fix and retry." });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: error, message: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(timeTracker));
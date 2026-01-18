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

const app = express();
app.use(express.json());
app.use(cors());

// Statische Dateien aus dem "public" Ordner bereitstellen
app.use(express.static(path.join(__dirname)));


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

//----------------- 18.01.2026 - NC : Time Entries API Endpoints ------------------
// In-memory data store for time entries
let timeEntries = [];

// POST endpoint for creating time entries
app.post('/api/time-entries', (req, res) => {
    try {
        const { projectId, date, durationMinutes } = req.body;

        // Validation: Check for required fields
        if (projectId === undefined || !date || durationMinutes === undefined) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'projectId, date, and durationMinutes are required'
            });
        }

        // Validate data types
        if (typeof projectId !== 'number') {
            return res.status(400).json({
                error: 'Invalid project ID',
                message: 'projectId must be a number'
            });
        }

        if (typeof durationMinutes !== 'number' || durationMinutes <= 0) {
            return res.status(400).json({
                error: 'Invalid duration minutes',
                message: 'durationMinutes must be a positive number'
            });
        }

        // Validate date format: DD-MM-YYYY
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({
                error: 'Invalid date format',
                message: 'Date must be in DD-MM-YYYY format'
            });
        }

        // Validate that the date is actually valid (not just format)
        // Parse DD-MM-YYYY format
        const [day, month, year] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day); // month is 0-indexed in Date
        
        // Check if the date is valid
        if (dateObj.getDate() !== day || dateObj.getMonth() !== month - 1 || dateObj.getFullYear() !== year) {
            return res.status(400).json({
                error: 'Invalid date',
                message: 'The provided date is not a valid date'
            });
        }

        // Create time entry
        const entry = {
            id: Date.now(),
            projectId,
            date,
            durationMinutes
        };

        // Add to in-memory data store
        timeEntries.push(entry);

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Time entry created successfully',
            entry
        });
    } catch (error) {
        // Error handling for unexpected errors
        console.error('Error creating time entry:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while creating the time entry'
        });
    }
});

// GET endpoint for fetching time entries
app.get('/api/time-entries', (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Time entries fetched successfully',
            entries: timeEntries
        });
    } catch (error) {
        console.error('Error fetching time entries:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while fetching time entries'
        });
    }
});

// Falls jemand direkt auf die API-Route im Browser geht
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(timeTracker));
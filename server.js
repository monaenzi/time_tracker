import express from "express";

const app = express();
const port = 3000;

//----------------- Step 1: Add JSON Middleware and In-memory data store----------------------------------------
// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store for time entries
let timeEntries = [];

// Healthcheck
app.get('/', (req, res) => {
    res.send('Server is running.');
});

//----------------- Step 2: Add POST endpoint for creating time entries ----------------------------------------

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

//----------------- Step 3: Add GET endpoint for fetching time entries ----------------------------------------

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

// Static files middleware should come after API routes
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
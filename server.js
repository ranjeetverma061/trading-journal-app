require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const { Pool } = require('pg'); // Use pg for PostgreSQL
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
// Render provides the PORT environment variable
const port = process.env.PORT || 3007;

app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

let pool;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Endpoint to get all journal entries
app.get('/api/entries', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM entries ORDER BY date DESC');
        res.json({ entries: rows });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to add a new journal entry
app.post('/api/add-entry', upload.single('chartImage'), async (req, res) => {
    const { date, ticker, entry, exit, setup, result, notes } = req.body;
    const chartImage = req.file ? `/uploads/${req.file.filename}` : null;
    const queryText = 'INSERT INTO entries (date, ticker, entry, exit, setup, result, chartImage, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
    const values = [date, ticker, entry, exit, setup, result, chartImage, notes];

    try {
        const result = await pool.query(queryText, values);
        res.json({ id: result.rows[0].id });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to delete a journal entry
app.delete('/api/entries/:id', async (req, res) => {
    const { id } = req.params;
    const queryText = 'DELETE FROM entries WHERE id = $1';
    try {
        const result = await pool.query(queryText, [id]);
        res.json({ message: 'Deleted successfully', changes: result.rowCount });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// All other GET requests not handled before will return the app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const startServer = async () => {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")
                ? { rejectUnauthorized: false }
                : false,
        });

        // Test the connection
        await pool.query('SELECT NOW()');
        console.log('Database connected successfully.');

        // Create table if it doesn't exist
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS entries (
            id SERIAL PRIMARY KEY,
            date TEXT,
            ticker TEXT,
            entry REAL,
            exit REAL,
            setup TEXT,
            result TEXT,
            chartImage TEXT,
            notes TEXT
        );`;
        await pool.query(createTableQuery);
        console.log('Table "entries" is ready.');

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();

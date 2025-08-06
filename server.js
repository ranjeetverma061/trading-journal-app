const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create a new database or open an existing one
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create a table to store journal entries
db.run('CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, ticker TEXT, entry REAL, exit REAL, setup TEXT, result TEXT, chartImage TEXT, notes TEXT)');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to get all journal entries
app.get('/entries', (req, res) => {
    db.all('SELECT * FROM entries ORDER BY date DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ entries: rows });
    });
});

// Endpoint to add a new journal entry
app.post('/add-entry', upload.single('chartImage'), (req, res) => {
    const { date, ticker, entry, exit, setup, result, notes } = req.body;
    const chartImage = req.file ? `/uploads/${req.file.filename}` : null;

    db.run('INSERT INTO entries (date, ticker, entry, exit, setup, result, chartImage, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [date, ticker, entry, exit, setup, result, chartImage, notes], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

// Endpoint to delete a journal entry
app.delete('/entries/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM entries WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Deleted successfully', changes: this.changes });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

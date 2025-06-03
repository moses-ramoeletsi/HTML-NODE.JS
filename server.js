const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP MySQL password is empty
    database: 'user_management'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            db.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to create user' });
                    }
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User Login
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token: token,
                user: { id: user.id, username: user.username, email: user.email }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all data for authenticated user
app.get('/api/data', authenticateToken, (req, res) => {
    db.query(
        'SELECT * FROM user_data WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        }
    );
});

// Create new data
app.post('/api/data', authenticateToken, (req, res) => {
    const { title, description, status } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    db.query(
        'INSERT INTO user_data (user_id, title, description, status) VALUES (?, ?, ?, ?)',
        [req.user.id, title, description || '', status || 'active'],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to create data' });
            }
            res.status(201).json({ message: 'Data created successfully', id: result.insertId });
        }
    );
});

// Update data
app.put('/api/data/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    db.query(
        'UPDATE user_data SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
        [title, description, status, id, req.user.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update data' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Data not found' });
            }
            res.json({ message: 'Data updated successfully' });
        }
    );
});

// Delete data
app.delete('/api/data/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM user_data WHERE id = ? AND user_id = ?',
        [id, req.user.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete data' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Data not found' });
            }
            res.json({ message: 'Data deleted successfully' });
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
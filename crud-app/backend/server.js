const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Add cors import

// Initialize Express app
const app = express();

// CORS Configuration - Add this before other middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to handle JSON requests
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',   // Use your MySQL username
  password: '',   // Use your MySQL password
  database: 'placement_services',  
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err.message);
    return;
  }
  console.log('Connected to MySQL database');
});

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// API route to handle student creation with file upload
app.post('/api/students', upload.fields([{ name: 'offer_letter' }, { name: 'internship_letter' }]), (req, res) => {
  const { name, email, phone, sgpa, accepted_company } = req.body;
  const offer_letter = req.files['offer_letter'] ? req.files['offer_letter'][0].path : null;
  const internship_letter = req.files['internship_letter'] ? req.files['internship_letter'][0].path : null;

  const sql = "INSERT INTO students (name, email, phone, sgpa, accepted_company, offer_letter, internship_letter) VALUES (?, ?, ?, ?, ?, ?, ?)";
  
  db.query(sql, [name, email, phone, sgpa, accepted_company, offer_letter, internship_letter], (err, result) => {
    if (err) {
      console.error('Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Student created successfully' });
  });
});

// API route to fetch all students
app.get('/api/students', (req, res) => {
  const sql = 'SELECT * FROM students';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching students:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// API route to update a student
app.put('/api/students/:id', upload.fields([{ name: 'offer_letter' }, { name: 'internship_letter' }]), (req, res) => {
  const { id } = req.params;
  const { name, email, phone, sgpa, accepted_company } = req.body;
  const offer_letter = req.files['offer_letter'] ? req.files['offer_letter'][0].path : null;
  const internship_letter = req.files['internship_letter'] ? req.files['internship_letter'][0].path : null;

  let sql = "UPDATE students SET name=?, email=?, phone=?, sgpa=?, accepted_company=?";
  let params = [name, email, phone, sgpa, accepted_company];

  if (offer_letter) {
    sql += ", offer_letter=?";
    params.push(offer_letter);
  }
  if (internship_letter) {
    sql += ", internship_letter=?";
    params.push(internship_letter);
  }

  sql += " WHERE id=?";
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating student:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Student updated successfully' });
  });
});

// API route to delete a student
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM students WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting student:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
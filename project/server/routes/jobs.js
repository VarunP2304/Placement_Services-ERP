import express from 'express';
import { pool } from '../index.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jobs');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get job by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new job
router.post('/', async (req, res) => {
  const { title, company, location, description, skills, status, deadline } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO jobs (title, company, location, description, skills, status, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, company, location, description, JSON.stringify(skills), status, deadline]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const jobsRouter = router;
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { jobsRouter } from './routes/jobs.js';
import { profileRouter } from './routes/profile.js';
import { authRouter } from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'placement_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
app.use('/api/jobs', jobsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
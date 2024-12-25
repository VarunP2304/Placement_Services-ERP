import express from 'express';
import { pool } from '../index.js';

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const [profile] = await pool.query('SELECT * FROM profiles WHERE user_id = ?', [req.params.userId]);
    if (profile.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    const [education] = await pool.query('SELECT * FROM education WHERE user_id = ?', [req.params.userId]);
    const [experience] = await pool.query('SELECT * FROM experience WHERE user_id = ?', [req.params.userId]);
    
    res.json({
      ...profile[0],
      education,
      experience,
      skills: JSON.parse(profile[0].skills)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  const { name, email, phone, bio, avatar, skills } = req.body;
  try {
    await pool.query(
      'UPDATE profiles SET name = ?, email = ?, phone = ?, bio = ?, avatar = ?, skills = ? WHERE user_id = ?',
      [name, email, phone, bio, avatar, JSON.stringify(skills), req.params.userId]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const profileRouter = router;
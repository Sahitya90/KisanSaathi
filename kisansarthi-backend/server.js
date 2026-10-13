import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL Connection Pool using environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- AUTHENTICATION MIDDLEWARE ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// --- 1. USER REGISTRATION (Secure Password Hashing) ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { full_name, phone_number, password, state, district } = req.body;
    
    if (!full_name || !phone_number || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (full_name, phone_number, password_hash, state, district)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, full_name, phone_number, state, district, created_at;
    `;
    const values = [full_name, phone_number, password_hash, state, district];
    const newUser = await pool.query(query, values);

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: newUser.rows[0] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed (Phone number may already be registered).' });
  }
});

// --- 2. USER LOGIN (JWT Token Generation) ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    
    const userResult = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid phone number or password.' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid phone number or password.' });
    }

    const token = jwt.sign({ id: user.id, phone_number: user.phone_number }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, name: user.full_name, phone: user.phone_number } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// --- 3. GET CROP LOGS (Protected Route) ---
app.get('/api/crops', verifyToken, async (req, res) => {
  try {
    const crops = await pool.query('SELECT * FROM crop_logs WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(crops.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch crop logs.' });
  }
});

// --- 4. ADD CROP LOG (Protected Route) ---
app.post('/api/crops', verifyToken, async (req, res) => {
  try {
    const { crop_name, sowing_date, field_size_acres, fertilizers_used, expected_harvest_date, yield_kg } = req.body;
    
    const query = `
      INSERT INTO crop_logs (user_id, crop_name, sowing_date, field_size_acres, fertilizers_used, expected_harvest_date, yield_kg)
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *;
    `;
    const values = [req.user.id, crop_name, sowing_date, field_size_acres, fertilizers_used, expected_harvest_date, yield_kg];
    const newCrop = await pool.query(query, values);
    
    res.status(201).json(newCrop.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add crop log.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`KisanSarthi Backend running smoothly on port ${PORT}`));
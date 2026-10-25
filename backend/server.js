require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mongoose Schema & Model matching exam rules
const gymLeaderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2 },
    region: {
      type: String,
      required: true,
      enum: ['Kanto', 'Johto', 'Hoenn'],
    },
    town: { type: String, required: true },
    badge: { type: String, required: true },
    specialty: { type: String, required: true },
    aceLevel: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 100,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not a whole number (integer)'
        }
    },
    motto: { type: String, maxlength: 150, default: '' },
  },
  { timestamps: true }
);

const GymLeader = mongoose.model('GymLeader', gymLeaderSchema);

// --- REST API ENDPOINTS ---

// 1. READ ALL: GET /api/leaders
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await GymLeader.find();
    res.status(200).json(leaders);
  } catch (err) {
    console.error('Fetch all failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. READ ONE: GET /api/leaders/:id
app.get('/api/leaders/:id', async (req, res) => {
  try {
    const leader = await GymLeader.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ error: 'Gym Leader not found' });
    }
    res.status(200).json(leader);
  } catch (err) {
    console.error('Fetch one failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. CREATE: POST /api/leaders
app.post('/api/leaders', async (req, res) => {
  try {
    const leader = await GymLeader.create(req.body);
    res.status(201).json(leader);
  } catch (err) {
    console.error('Create failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// 4. UPDATE: PUT /api/leaders/:id
app.put('/api/leaders/:id', async (req, res) => {
  try {
    const updatedLeader = await GymLeader.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLeader) {
      return res.status(404).json({ error: 'Gym Leader not found' });
    }
    res.status(200).json(updatedLeader);
  } catch (err) {
    console.error('Update failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE: DELETE /api/leaders/:id
app.delete('/api/leaders/:id', async (req, res) => {
  try {
    const deletedLeader = await GymLeader.findByIdAndDelete(req.params.id);
    if (!deletedLeader) {
      return res.status(404).json({ error: 'Gym Leader not found' });
    }
    res.status(200).json({ message: 'Gym Leader deleted successfully', id: req.params.id });
  } catch (err) {
    console.error('Delete failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Database Connection & Server Start
async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is missing in .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Backend server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

startServer();
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/words',   require('./routes/words'));
app.use('/api/users',   require('./routes/users'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'LinguaFlow API' }));

// 404
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 LinguaFlow server running on http://localhost:${PORT}`));


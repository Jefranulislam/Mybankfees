import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Configure CORS specifically for your frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://mybankfees.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      message: 'Server is running', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      hasDbConfig: !!(process.env.PGUSER && process.env.PGHOST)
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed', details: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  try {
    res.json({ 
      message: 'MyBankFees API is running',
      endpoints: [
        '/api/health',
        '/api/banks',
        '/api/report-issue',
        '/api/visitor-count'
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Root endpoint failed', details: error.message });
  }
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const { sql } = await import('../src/config/db.js');
    const result = await sql`SELECT NOW() as current_time`;
    res.json({ 
      message: 'Database connection successful',
      currentTime: result[0].current_time
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: error.message,
      env: {
        hasUser: !!process.env.PGUSER,
        hasHost: !!process.env.PGHOST,
        hasDb: !!process.env.PGDATABASE
      }
    });
  }
});

// Simple bank endpoints without external route files
app.get('/api/banks', async (req, res) => {
  try {
    const { sql } = await import('../src/config/db.js');
    const banks = await sql`SELECT * FROM banks LIMIT 10`;
    res.json({ banks });
  } catch (error) {
    console.error('Banks error:', error);
    res.status(500).json({ error: 'Failed to fetch banks', details: error.message });
  }
});

app.post('/api/report-issue', async (req, res) => {
  try {
    const { wrongInfo, bankName, accountType, url } = req.body;
    
    if (!wrongInfo || !bankName || !accountType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For now, just log the issue
    console.log('Issue reported:', { wrongInfo, bankName, accountType, url });
    
    res.json({ 
      message: 'Your report has been submitted successfully!',
      reportId: Date.now().toString()
    });
  } catch (error) {
    console.error('Report issue error:', error);
    res.status(500).json({ error: 'Failed to submit report', details: error.message });
  }
});

app.get('/api/visitor-count', (req, res) => {
  try {
    // Simple static count for now
    res.json({ count: 1234 });
  } catch (error) {
    console.error('Visitor count error:', error);
    res.status(500).json({ error: 'Failed to get visitor count', details: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Export for Vercel
export default app;

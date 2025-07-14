import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import bankRoutes from '../src/routes/bankRoutes.js';
import utilityRoutes from '../src/routes/utilityRoutes.js';
import { sql } from '../src/config/db.js';

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
  res.json({ 
    message: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MyBankFees API is running',
    endpoints: [
      '/api/health',
      '/api/banks',
      '/api/report-issue',
      '/api/visitor-count'
    ]
  });
});

//All Routes
app.use("/api/banks", bankRoutes);
app.use("/api", utilityRoutes);

// Export for Vercel
export default app;

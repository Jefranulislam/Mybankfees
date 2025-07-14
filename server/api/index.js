import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import arcjet, { fixedWindow, rateLimit, shield, request } from '@arcjet/node';
import bankRoutes from '../src/routes/bankRoutes.js';
import utilityRoutes from '../src/routes/utilityRoutes.js';
import { sql } from '../src/config/db.js';
dotenv.config();

// Initialize Arcjet with rate limiting and security rules
const aj = arcjet({
  key: process.env.ARCJET_KEY, // Get this from your Arcjet dashboard
  rules: [
    // Rate limiting rules
    rateLimit({
      mode: "LIVE", // Change to "DRY_RUN" for testing
      match: "/api/*", // Apply to all API routes
      window: fixedWindow({
        duration: "1m", // 1 minute window
        limit: 100, // 100 requests per minute per IP
      }),
    }),
    // Additional rate limit for report submission (stricter)
    rateLimit({
      mode: "LIVE",
      match: "/api/report-issue",
      window: fixedWindow({
        duration: "15m", // 15 minute window
        limit: 5, // Only 5 reports per 15 minutes per IP
      }),
    }),
    // Shield against common attacks
    shield({
      mode: "LIVE",
    }),
  ],
});

const app = express();
const PORT = process.env.PORT;

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

// Arcjet middleware for rate limiting and security
app.use(async (req, res, next) => {
  const decision = await aj.protect(req, { 
    requested: request.pathAndQuery(req.url),
    ip: req.ip || req.connection.remoteAddress,
  });

  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return res.status(429).json({ 
        error: "Too many requests", 
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.round(decision.reason.resetTime - Date.now() / 1000)
      });
    } else if (decision.reason.isShield()) {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: "Request blocked for security reasons" 
      });
    } else {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: "Request denied" 
      });
    }
  }

  next();
});

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

//All Routes
app.use("/api/banks", bankRoutes);
app.use("/api", utilityRoutes);

// Export for Vercel
export default app;

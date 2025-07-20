import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import bankRoutes from './routes/bankRoutes.js';
import { sql } from './config/db.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Configure CORS for production and development
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://your-vercel-app.vercel.app', // Replace with your actual Vercel frontend URL
  process.env.FRONTEND_URL // Add this to your .env file
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

//Database Connection
async function initDB() {
  try {
    // Create banks table
    await sql`
      CREATE TABLE IF NOT EXISTS banks (
        id VARCHAR(100) PRIMARY KEY,
        bank_name VARCHAR(255) NOT NULL,
        bank_type VARCHAR(100) NOT NULL,
        established_year INTEGER,
        headquarters VARCHAR(255),
        website VARCHAR(500),
        total_branches INTEGER,
        total_atms INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create account_types table
    await sql`
      CREATE TABLE IF NOT EXISTS account_types (
        id SERIAL PRIMARY KEY,
        bank_id VARCHAR(100) REFERENCES banks(id) ON DELETE CASCADE,
        account_type VARCHAR(50) NOT NULL,
        minimum_balance DECIMAL(15,2),
        account_maintenance_fee DECIMAL(10,2),
        atm_fee_own DECIMAL(10,2),
        atm_fee_other DECIMAL(10,2),
        online_banking_fee DECIMAL(10,2),
        sms_banking_fee DECIMAL(10,2),
        debit_card_fee DECIMAL(10,2),
        credit_card_fee DECIMAL(10,2),
        nspb_fee DECIMAL(10,2),
        rtgs_fee DECIMAL(10,2),
        beftn_fee DECIMAL(10,2),
        checkbook_fee DECIMAL(10,2),
        statement_fee DECIMAL(10,2),
        other_charges DECIMAL(10,2),
        interest_rate DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}


//All Routes
app.use("/api/banks", bankRoutes);

// Note: Run 'npm run reset-db' and then 'npm run seed' to set up the database
// initDB(); // Commented out - use manual reset instead



//Listen

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


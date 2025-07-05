import { sql } from './config/db.js';

async function resetDatabase() {
  try {
    console.log('Dropping existing tables...');
    
    // Drop tables (order matters due to foreign key constraints)
    await sql`DROP TABLE IF EXISTS account_types CASCADE`;
    await sql`DROP TABLE IF EXISTS banks CASCADE`;
    
    console.log('Creating banks table...');
    
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

    console.log('Creating account_types table...');
    
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

    console.log('Database reset completed successfully!');
    console.log('You can now run: npm run seed');
    
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}

resetDatabase();

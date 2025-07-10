import { sql } from '../config/db.js';





export const getallBanks = async (req, res) => {
  try {
    const banks = await sql`
      SELECT 
        b.*,
        json_agg(
          json_build_object(
            'id', at.id,
            'type', at.account_type,
            'minimumBalance', at.minimum_balance,
            'accountMaintenanceFee', at.account_maintenance_fee,
            'atmFeeOwn', at.atm_fee_own,
            'atmFeeOther', at.atm_fee_other,
            'onlineBankingFee', at.online_banking_fee,
            'smsBankingFee', at.sms_banking_fee,
            'debitCardFee', at.debit_card_fee,
            'creditCardFee', at.credit_card_fee,
            'nspbFee', at.nspb_fee,
            'rtgsFee', at.rtgs_fee,
            'beftnFee', at.beftn_fee,
            'checkbookFee', at.checkbook_fee,
            'statementFee', at.statement_fee,
            'otherCharges', at.other_charges,
            'interestRate', at.interest_rate
          )
        ) as account_types
      FROM banks b
      LEFT JOIN account_types at ON b.id = at.bank_id
      GROUP BY b.id, b.bank_name, b.bank_type, b.established_year, 
               b.headquarters, b.website, b.total_branches, b.total_atms,
               b.created_at, b.updated_at
      ORDER BY b.bank_name
    `;

    res.status(200).json({
      message: "Banks retrieved successfully",
      data: banks
    });
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({
      message: "Error retrieving banks",
      error: error.message
    });
  }
}

export const addBank = async (req, res) => {
  try {
    const { 
      id, bankName, bankType, establishedYear, headquarters, 
      website, totalBranches, totalAtms, accountTypes 
    } = req.body;

    // Insert bank
    await sql`
      INSERT INTO banks (
        id, bank_name, bank_type, established_year, 
        headquarters, website, total_branches, total_atms
      ) VALUES (
        ${id}, ${bankName}, ${bankType}, ${establishedYear},
        ${headquarters}, ${website}, ${totalBranches}, ${totalAtms}
      )
    `;

    // Insert account types
    if (accountTypes && accountTypes.length > 0) {
      for (const accountType of accountTypes) {
        await sql`
          INSERT INTO account_types (
            bank_id, account_type, minimum_balance, account_maintenance_fee,
            atm_fee_own, atm_fee_other, online_banking_fee, sms_banking_fee,
            debit_card_fee, credit_card_fee, nspb_fee, rtgs_fee, beftn_fee,
            checkbook_fee, statement_fee, other_charges, interest_rate
          ) VALUES (
            ${id}, ${accountType.type}, ${accountType.minimumBalance},
            ${accountType.accountMaintenanceFee}, ${accountType.atmFeeOwn},
            ${accountType.atmFeeOther}, ${accountType.onlineBankingFee},
            ${accountType.smsBankingFee}, ${accountType.debitCardFee},
            ${accountType.creditCardFee}, ${accountType.nspbFee},
            ${accountType.rtgsFee}, ${accountType.beftnFee},
            ${accountType.checkbookFee}, ${accountType.statementFee},
            ${accountType.otherCharges}, ${accountType.interestRate}
          )
        `;
      }
    }

    res.status(201).json({
      message: "Bank added successfully",
      data: { id, bankName }
    });
  } catch (error) {
    console.error('Error adding bank:', error);
    res.status(500).json({
      message: "Error adding bank",
      error: error.message
    });
  }
}


export const getBankById = async (req, res) => {
  try {
    const bankId = req.params.id;
    
    const bank = await sql`
      SELECT 
        b.*,
        json_agg(
          json_build_object(
            'id', at.id,
            'type', at.account_type,
            'minimumBalance', at.minimum_balance,
            'accountMaintenanceFee', at.account_maintenance_fee,
            'atmFeeOwn', at.atm_fee_own,
            'atmFeeOther', at.atm_fee_other,
            'onlineBankingFee', at.online_banking_fee,
            'smsBankingFee', at.sms_banking_fee,
            'debitCardFee', at.debit_card_fee,
            'creditCardFee', at.credit_card_fee,
            'nspbFee', at.nspb_fee,
            'rtgsFee', at.rtgs_fee,
            'beftnFee', at.beftn_fee,
            'checkbookFee', at.checkbook_fee,
            'statementFee', at.statement_fee,
            'otherCharges', at.other_charges,
            'interestRate', at.interest_rate
          )
        ) as account_types
      FROM banks b
      LEFT JOIN account_types at ON b.id = at.bank_id
      WHERE b.id = ${bankId}
      GROUP BY b.id, b.bank_name, b.bank_type, b.established_year, 
               b.headquarters, b.website, b.total_branches, b.total_atms,
               b.created_at, b.updated_at
    `;

    if (bank.length === 0) {
      return res.status(404).json({
        message: "Bank not found"
      });
    }

    res.status(200).json({
      message: "Bank retrieved successfully",
      data: bank[0]
    });
  } catch (error) {
    console.error('Error fetching bank:', error);
    res.status(500).json({
      message: "Error retrieving bank",
      error: error.message
    });
  }
}



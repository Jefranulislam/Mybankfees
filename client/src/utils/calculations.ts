import { AccountTypeDetails, CalculatedCharges, UserCalculation, CustomCalculatedCharges, BankCharge, BankType, AccountType } from '../types/bank';

// Transform API response to frontend format
export const transformBankData = (apiBank: {
  id: string;
  bank_name: string;
  bank_type: string;
  established_year?: number;
  headquarters?: string;
  website?: string;
  total_branches?: number;
  total_atms?: number;
  account_types: Array<{
    id?: number;
    type: string;
    minimumBalance: number;
    accountMaintenanceFee: number;
    atmFeeOwn: number;
    atmFeeOther: number;
    onlineBankingFee: number;
    smsBankingFee: number;
    debitCardFee: number;
    creditCardFee: number;
    nspbFee: number;
    rtgsFee: number;
    beftnFee: number;
    checkbookFee: number;
    statementFee: number;
    otherCharges: number;
    interestRate?: number;
  }>;
  created_at?: string;
  updated_at?: string;
}): BankCharge => {
  return {
    id: apiBank.id,
    bankName: apiBank.bank_name,
    bankType: apiBank.bank_type as BankType,
    establishedYear: apiBank.established_year,
    headquarters: apiBank.headquarters,
    website: apiBank.website,
    totalBranches: apiBank.total_branches,
    totalAtms: apiBank.total_atms,
    accountTypes: (apiBank.account_types || []).map(accountType => ({
      ...accountType,
      type: accountType.type as AccountType
    })),
    created_at: apiBank.created_at,
    updated_at: apiBank.updated_at,
  };
};

export const calculateCharges = (
  bankId: string,
  bankName: string,
  bankType: string,
  accountType: AccountTypeDetails
): CalculatedCharges => {
  // Yearly calculation (proper banking fee structure)
  
  // Annual charges (charged once per year)
  const annualCharges = 
    accountType.accountMaintenanceFee + // Annual maintenance fee
    accountType.onlineBankingFee + // Annual online banking fee
    accountType.smsBankingFee + // Annual SMS banking fee
    accountType.debitCardFee + // Annual debit card fee
    accountType.creditCardFee + // Annual credit card fee
    accountType.checkbookFee + // Annual checkbook fee (assuming 1 per year)
    accountType.statementFee + // Annual statement fee (assuming 1 per year)
    accountType.otherCharges; // Other annual charges

  // Monthly transaction-based charges (multiply by 12 for yearly)
  const monthlyTransactionCharges = 
    (accountType.atmFeeOther * 4) + // 4 ATM transactions at other banks per month
    (accountType.nspbFee * 2) + // 2 NSPB transactions per month
    (accountType.beftnFee * 2); // 2 BEFTN transactions per month

  const yearlyTransactionCharges = monthlyTransactionCharges * 12;
  const yearlyTotal = annualCharges + yearlyTransactionCharges;
  const monthlyTotal = yearlyTotal / 12; // For display purposes

  return {
    ...accountType,
    bankId,
    bankName,
    bankType: bankType as BankType,
    monthlyTotal: Math.round(monthlyTotal),
    yearlyTotal: Math.round(yearlyTotal),
  };
};

export const calculateCustomCharges = (
  baseCharges: CalculatedCharges,
  userInputs: UserCalculation
): CustomCalculatedCharges => {
  const customMonthlyTotal = 
    baseCharges.accountMaintenanceFee + 
    (baseCharges.atmFeeOther * userInputs.monthlyAtmTransactions) +
    (userInputs.useOnlineBanking ? baseCharges.onlineBankingFee : 0) +
    (userInputs.useSms ? baseCharges.smsBankingFee : 0) +
    (baseCharges.debitCardFee / 12) + // Annual fee divided by 12
    (baseCharges.creditCardFee / 12) + // Annual fee divided by 12
    (baseCharges.nspbFee * userInputs.monthlyTransfers) +
    (baseCharges.beftnFee * userInputs.monthlyTransfers) +
    (baseCharges.checkbookFee / 6) + // New checkbook every 6 months
    (baseCharges.statementFee * userInputs.monthlyStatements) +
    baseCharges.otherCharges;

  const customYearlyTotal = customMonthlyTotal * 12;

  return {
    ...baseCharges,
    customMonthlyTotal: Math.round(customMonthlyTotal),
    customYearlyTotal: Math.round(customYearlyTotal),
    userInputs,
  };
};

export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '৳0';
  }
  return `৳${amount.toLocaleString()}`;
};

export const sortBanks = (banks: CalculatedCharges[], sortBy: string, sortOrder: 'asc' | 'desc'): CalculatedCharges[] => {
  return [...banks].sort((a, b) => {
    let aValue: number | string = 0;
    let bValue: number | string = 0;

    switch (sortBy) {
      case 'bankName':
        aValue = a.bankName;
        bValue = b.bankName;
        break;
      case 'minimumBalance':
        aValue = a.minimumBalance;
        bValue = b.minimumBalance;
        break;
      case 'monthlyTotal':
        aValue = a.monthlyTotal;
        bValue = b.monthlyTotal;
        break;
      case 'yearlyTotal':
        aValue = a.yearlyTotal;
        bValue = b.yearlyTotal;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });
};

export const getCalculationBreakdown = () => {
  return {
    title: "Yearly Total Calculation",
    description: "Our yearly total is calculated using proper banking fee structure:",
    items: [
      "Annual Charges (charged once per year):",
      "• Account Maintenance Fee (annual)",
      "• Online Banking Fee (annual)",
      "• SMS Banking Fee (annual)", 
      "• Debit Card Fee (annual)",
      "• Credit Card Fee (annual)",
      "• Checkbook Fee (annual)",
      "• Statement Fee (annual)",
      "• Other Charges (annual)",
      "",
      "Transaction Charges (monthly × 12):",
      "• ATM Fees: 4 transactions at other banks",
      "• Transfer Fees: 2 NSPB + 2 BEFTN transactions",
      "",
      "Monthly Total = Yearly Total ÷ 12"
    ],
    note: "You can customize these calculations on individual bank pages based on your actual usage."
  };
};
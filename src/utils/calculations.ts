import { AccountTypeDetails, CalculatedCharges, UserCalculation, CustomCalculatedCharges } from '../types/bank';

export const calculateCharges = (
  bankId: string,
  bankName: string,
  bankType: string,
  accountType: AccountTypeDetails
): CalculatedCharges => {
  // Standard calculation (assuming average usage)
  const monthlyTotal = 
    accountType.accountMaintenanceFee + 
    (accountType.atmFeeOther * 4) + // 4 ATM transactions at other banks per month
    accountType.onlineBankingFee +
    accountType.smsBankingFee +
    (accountType.debitCardFee / 12) + // Annual fee divided by 12
    (accountType.creditCardFee / 12) + // Annual fee divided by 12
    (accountType.neftFee * 2) + // 2 NEFT transactions per month
    (accountType.beftnFee * 2) + // 2 BEFTN transactions per month
    (accountType.checkbookFee / 6) + // New checkbook every 6 months
    (accountType.statementFee / 3) + // Statement every 3 months
    accountType.otherCharges;

  const yearlyTotal = monthlyTotal * 12;

  return {
    ...accountType,
    bankId,
    bankName,
    bankType: bankType as any,
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
    (baseCharges.neftFee * userInputs.monthlyTransfers) +
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

export const formatCurrency = (amount: number): string => {
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
    title: "Monthly Total Calculation",
    description: "Our monthly total is calculated based on typical banking usage patterns:",
    items: [
      "Account Maintenance Fee (monthly)",
      "ATM Fees: 4 transactions at other banks",
      "Online Banking Fee (if applicable)",
      "SMS Banking Fee (monthly)",
      "Debit Card Fee (annual ÷ 12)",
      "Credit Card Fee (annual ÷ 12)",
      "Transfer Fees: 2 NEFT + 2 BEFTN transactions",
      "Checkbook Fee (every 6 months ÷ 6)",
      "Statement Fee (quarterly ÷ 3)",
      "Other Charges (monthly)"
    ],
    note: "You can customize these calculations on individual bank pages based on your actual usage."
  };
};
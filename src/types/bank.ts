export interface BankCharge {
  id: string;
  bankName: string;
  bankType: BankType;
  accountTypes: AccountTypeDetails[];
  establishedYear?: number;
  headquarters?: string;
  website?: string;
  swiftCode?: string;
  routingNumber?: string;
  totalBranches?: number;
  totalAtms?: number;
  description?: string;
  logo?: string;
}

export interface AccountTypeDetails {
  type: AccountType;
  minimumBalance: number;
  accountMaintenanceFee: number;
  atmFeeOwn: number;
  atmFeeOther: number;
  onlineBankingFee: number;
  smsBankingFee: number;
  debitCardFee: number;
  creditCardFee: number;
  neftFee: number;
  rtgsFee: number;
  beftnFee: number;
  checkbookFee: number;
  statementFee: number;
  otherCharges: number;
  interestRate?: number;
  overdraftFacility?: boolean;
  overdraftRate?: number;
  loanFacilities?: string[];
  specialFeatures?: string[];
}

export type AccountType = 
  | 'Savings' 
  | 'Current' 
  | 'Business' 
  | 'Student' 
  | 'Senior Citizen' 
  | 'Joint'
  | 'Fixed Deposit'
  | 'Salary'
  | 'NRB'
  | 'Foreign Currency'
  | 'Islamic Savings'
  | 'Islamic Current';

export type BankType = 
  | 'State-Owned Commercial Bank'
  | 'Specialized Development Bank'
  | 'Private Commercial Bank'
  | 'Islamic Bank'
  | 'Foreign Commercial Bank';

export interface FilterOptions {
  accountTypes: AccountType[];
  bankTypes: BankType[];
  maxMinimumBalance: number;
  maxMonthlyFee: number;
  searchTerm: string;
}

export interface CalculatedCharges extends AccountTypeDetails {
  bankId: string;
  bankName: string;
  bankType: BankType;
  monthlyTotal: number;
  yearlyTotal: number;
}

export interface UserCalculation {
  monthlyAtmTransactions: number;
  monthlyTransfers: number;
  monthlyStatements: number;
  useOnlineBanking: boolean;
  useSms: boolean;
}

export interface CustomCalculatedCharges extends CalculatedCharges {
  customMonthlyTotal: number;
  customYearlyTotal: number;
  userInputs: UserCalculation;
}
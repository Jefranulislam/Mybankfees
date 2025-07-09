import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Globe, MapPin, Calendar, Users, CreditCard, Calculator, Loader2 } from 'lucide-react';
import { Header } from '../components/Header';
import { bankService } from '../services/api';
import { calculateCharges, formatCurrency, transformBankData } from '../utils/calculations';
import { BankCharge } from '../types/bank';

export const BankDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [bank, setBank] = useState<BankCharge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccountType, setSelectedAccountType] = useState<string>('');
  
  const [optionalFeatures, setOptionalFeatures] = useState({
    includeCreditCard: false,
    includeDebitCard: true,
    includeOnlineBanking: true,
    includeSms: true,
    includeStatements: true,
    includeCheckbook: false
  });

  const [transactionInputs, setTransactionInputs] = useState({
    monthlyAtmOtherBank: 4,
    monthlyNspbTransfers: 2,
    monthlyBeftnTransfers: 2,
    monthlyStatements: 1,
    monthlyCheckbooks: 0
  });

  useEffect(() => {
    const fetchBank = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const apiBank = await bankService.getBankById(id);
        const transformedBank = transformBankData(apiBank);
        setBank(transformedBank);
        
        // Set the first account type as default
        if (transformedBank.accountTypes && transformedBank.accountTypes.length > 0) {
          setSelectedAccountType(transformedBank.accountTypes[0].type);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bank data');
      } finally {
        setLoading(false);
      }
    };

    fetchBank();
  }, [id]);

  const calculatedAccounts = useMemo(() => {
    if (!bank || !bank.accountTypes) return [];
    return bank.accountTypes.map(accountType => 
      calculateCharges(bank.id, bank.bankName, bank.bankType, accountType)
    );
  }, [bank]);

  const selectedAccount = calculatedAccounts.find(acc => acc.type === selectedAccountType);
  
  const customCalculation = useMemo(() => {
    if (!selectedAccount) return null;
    
    // Calculate custom charges based on user inputs and optional features
    let customMonthlyTotal = 0;
    
    // Base charges (always included)
    customMonthlyTotal += selectedAccount.accountMaintenanceFee || 0;
    customMonthlyTotal += selectedAccount.minimumBalance || 0; // This might need adjustment based on your logic
    
    // Optional features
    if (optionalFeatures.includeOnlineBanking) {
      customMonthlyTotal += selectedAccount.onlineBankingFee || 0;
    }
    
    if (optionalFeatures.includeSms) {
      customMonthlyTotal += selectedAccount.smsBankingFee || 0;
    }
    
    if (optionalFeatures.includeStatements) {
      customMonthlyTotal += (selectedAccount.statementFee || 0) * transactionInputs.monthlyStatements;
    }
    
    if (optionalFeatures.includeCheckbook) {
      customMonthlyTotal += (selectedAccount.checkbookFee || 0) * transactionInputs.monthlyCheckbooks;
    }
    
    // Transaction-based charges
    customMonthlyTotal += (selectedAccount.atmFeeOther || 0) * transactionInputs.monthlyAtmOtherBank;
    customMonthlyTotal += (selectedAccount.nspbFee || 0) * transactionInputs.monthlyNspbTransfers;
    customMonthlyTotal += (selectedAccount.beftnFee || 0) * transactionInputs.monthlyBeftnTransfers;
    
    // Annual charges (divided by 12 for monthly calculation)
    if (optionalFeatures.includeCreditCard) {
      customMonthlyTotal += (selectedAccount.creditCardFee || 0) / 12;
    }
    
    // Include debit card only if selected
    if (optionalFeatures.includeDebitCard) {
      customMonthlyTotal += (selectedAccount.debitCardFee || 0) / 12;
    }
    
    const customYearlyTotal = customMonthlyTotal * 12;
    
    return {
      customMonthlyTotal,
      customYearlyTotal
    };
  }, [selectedAccount, optionalFeatures, transactionInputs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Loading Bank Details</h2>
            <p className="text-gray-500">Please wait while we fetch the bank information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bank) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              {error ? 'Error Loading Bank' : 'Bank Not Found'}
            </h2>
            <p className="text-gray-500 mb-4">
              {error || 'The requested bank could not be found.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Bank Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Comparison
          </button>
          
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{bank.bankName}</h1>
              <p className="text-lg text-gray-600">{bank.bankType}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bank Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bank Information</h2>
              
              <div className="space-y-4">
                {bank.establishedYear && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Established</p>
                      <p className="font-medium">{bank.establishedYear}</p>
                    </div>
                  </div>
                )}
                
                {bank.headquarters && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Headquarters</p>
                      <p className="font-medium">{bank.headquarters}</p>
                    </div>
                  </div>
                )}
                
                {bank.website && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a 
                        href={bank.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                
                {bank.totalBranches && (
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Total Branches</p>
                      <p className="font-medium">{bank.totalBranches.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                
                {bank.totalAtms && (
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Total ATMs</p>
                      <p className="font-medium">{bank.totalAtms.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Type Selector */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Types</h2>
              
              <div className="space-y-2">
                {bank.accountTypes && bank.accountTypes.map((accountType) => (
                  <button
                    key={accountType.type}
                    onClick={() => setSelectedAccountType(accountType.type)}
                    className={`w-full text-left p-3 rounded-md border transition-colors ${
                      selectedAccountType === accountType.type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{accountType.type}</div>
                    <div className="text-sm text-gray-600">
                      Min Balance: {formatCurrency(accountType.minimumBalance)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Account Details and Calculator */}
          <div className="lg:col-span-2">
            {selectedAccount ? (
              <div className="space-y-6">
                {/* Account Details */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {selectedAccount.type} Account Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Basic Charges</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Minimum Balance:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.minimumBalance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Maintenance:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.accountMaintenanceFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SMS Banking:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.smsBankingFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Online Banking:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.onlineBankingFee)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Transaction Charges</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>ATM (Own):</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.atmFeeOwn)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ATM (Other):</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.atmFeeOther)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>NSPB Transfer:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.nspbFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>BEFTN Transfer:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.beftnFee)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Card Charges (Annual)</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Debit Card:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.debitCardFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Credit Card:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.creditCardFee)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Other Charges</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Checkbook:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.checkbookFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Statement:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.statementFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>RTGS Transfer:</span>
                          <span className="font-medium">{formatCurrency(selectedAccount.rtgsFee)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Custom Calculator */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <Calculator className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Calculate Your Personal Charges
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transaction Inputs */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 mb-3">Monthly Transactions</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ATM Transactions (Other Banks)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={transactionInputs.monthlyAtmOtherBank}
                          onChange={(e) => setTransactionInputs(prev => ({
                            ...prev,
                            monthlyAtmOtherBank: Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Charge: {formatCurrency(selectedAccount.atmFeeOther)} per transaction
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          NSPB Transfers
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={transactionInputs.monthlyNspbTransfers}
                          onChange={(e) => setTransactionInputs(prev => ({
                            ...prev,
                            monthlyNspbTransfers: Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Charge: {formatCurrency(selectedAccount.nspbFee)} per transfer
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          BEFTN Transfers
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={transactionInputs.monthlyBeftnTransfers}
                          onChange={(e) => setTransactionInputs(prev => ({
                            ...prev,
                            monthlyBeftnTransfers: Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Charge: {formatCurrency(selectedAccount.beftnFee)} per transfer
                        </p>
                      </div>
                    </div>
                    
                    {/* Optional Services */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 mb-3">Optional Services</h3>
                      
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={optionalFeatures.includeOnlineBanking}
                            onChange={(e) => setOptionalFeatures(prev => ({
                              ...prev,
                              includeOnlineBanking: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            Online Banking
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6">
                          Monthly: {formatCurrency(selectedAccount.onlineBankingFee)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={optionalFeatures.includeSms}
                            onChange={(e) => setOptionalFeatures(prev => ({
                              ...prev,
                              includeSms: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            SMS Banking
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6">
                          Monthly: {formatCurrency(selectedAccount.smsBankingFee)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={optionalFeatures.includeDebitCard}
                            onChange={(e) => setOptionalFeatures(prev => ({
                              ...prev,
                              includeDebitCard: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            Debit Card
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6">
                          Annual: {formatCurrency(selectedAccount.debitCardFee)} (Monthly: {formatCurrency((selectedAccount.debitCardFee || 0) / 12)})
                        </p>
                      </div>
                      
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={optionalFeatures.includeCreditCard}
                            onChange={(e) => setOptionalFeatures(prev => ({
                              ...prev,
                              includeCreditCard: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            Credit Card
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6">
                          Annual: {formatCurrency(selectedAccount.creditCardFee)} (Monthly: {formatCurrency((selectedAccount.creditCardFee || 0) / 12)})
                        </p>
                      </div>
                    </div>
                    
                    {/* Additional Services */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 mb-3">Additional Services</h3>
                      
                      <div>
                        <label className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={optionalFeatures.includeStatements}
                            onChange={(e) => setOptionalFeatures(prev => ({
                              ...prev,
                              includeStatements: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            Monthly Statements
                          </span>
                        </label>
                        {optionalFeatures.includeStatements && (
                          <div className="ml-6">
                            <input
                              type="number"
                              min="0"
                              value={transactionInputs.monthlyStatements}
                              onChange={(e) => setTransactionInputs(prev => ({
                                ...prev,
                                monthlyStatements: Number(e.target.value)
                              }))}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-xs text-gray-500">
                              {formatCurrency(selectedAccount.statementFee)} each
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={optionalFeatures.includeCheckbook}
                            onChange={(e) => setOptionalFeatures(prev => ({
                              ...prev,
                              includeCheckbook: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            Checkbooks
                          </span>
                        </label>
                        {optionalFeatures.includeCheckbook && (
                          <div className="ml-6">
                            <input
                              type="number"
                              min="0"
                              value={transactionInputs.monthlyCheckbooks}
                              onChange={(e) => setTransactionInputs(prev => ({
                                ...prev,
                                monthlyCheckbooks: Number(e.target.value)
                              }))}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-xs text-gray-500">
                              {formatCurrency(selectedAccount.checkbookFee)} each
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-600">
                          <strong>Note:</strong> Choose only the cards and services you actually use. 
                          Account maintenance fee is always included in the base calculation.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {customCalculation && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Personalized Charges</h3>
                        <div className="grid  gap-6">
                          <div className="space-y-3 grid-end">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-medium">Your Monthly Total:</span>
                              <span className="text-2xl font-bold text-green-600">
                                {formatCurrency(customCalculation.customMonthlyTotal)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-medium">Your Yearly Total:</span>
                              <span className="text-2xl font-bold text-blue-600">
                                {formatCurrency(customCalculation.customYearlyTotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Select an Account Type</h3>
                <p className="text-gray-500">Choose an account type from the left panel to view detailed charges and use the calculator.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
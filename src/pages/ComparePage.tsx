import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Header } from '../components/Header';
import { bangladeshiBanks } from '../data/banks';
import { calculateCharges, formatCurrency } from '../utils/calculations';

export const ComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const bankIds = searchParams.get('banks')?.split(',') || [];
  
  const comparisonData = useMemo(() => {
    return bankIds.map(bankId => {
      const bank = bangladeshiBanks.find(b => b.id === bankId);
      if (!bank) return null;
      
      return {
        bank,
        accounts: bank.accountTypes.map(accountType => 
          calculateCharges(bank.id, bank.bankName, bank.bankType, accountType)
        )
      };
    }).filter(Boolean);
  }, [bankIds]);

  if (comparisonData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Banks Selected</h2>
            <p className="text-gray-500 mb-4">Please select banks to compare from the main page.</p>
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
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Comparison
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Bank Comparison</h1>
          <p className="text-lg text-gray-600">
            Comparing {comparisonData.length} banks side by side
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {comparisonData.map((data, index) => (
            <div key={data!.bank.id} className="bg-white rounded-lg shadow-md border border-gray-200">
              {/* Bank Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{data!.bank.bankName}</h2>
                    <p className="text-sm text-gray-600">{data!.bank.bankType}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {data!.bank.totalBranches && (
                    <div>
                      <p className="text-gray-600">Branches</p>
                      <p className="font-medium">{data!.bank.totalBranches.toLocaleString()}</p>
                    </div>
                  )}
                  {data!.bank.totalAtms && (
                    <div>
                      <p className="text-gray-600">ATMs</p>
                      <p className="font-medium">{data!.bank.totalAtms.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Types */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Account Types</h3>
                <div className="space-y-4">
                  {data!.accounts.map((account) => (
                    <div key={account.type} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">{account.type}</h4>
                        <span className="text-sm text-gray-600">
                          Min: {formatCurrency(account.minimumBalance)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly Fee:</span>
                          <span className="font-medium">{formatCurrency(account.accountMaintenanceFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ATM (Other):</span>
                          <span className="font-medium">{formatCurrency(account.atmFeeOther)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transfer Fee:</span>
                          <span className="font-medium">{formatCurrency(account.neftFee)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Monthly Total:</span>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(account.monthlyTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-medium">Yearly Total:</span>
                          <span className="text-lg font-bold text-blue-600">
                            {formatCurrency(account.yearlyTotal)}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/bank/${data!.bank.id}`)}
                        className="w-full mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Full Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
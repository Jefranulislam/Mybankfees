import React from 'react';
import { Filter, X } from 'lucide-react';
import { AccountType, FilterOptions, BankType } from '../types/bank';
import { accountTypes, bankTypes } from '../data/banks';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle
}) => {
  const handleAccountTypeChange = (accountType: AccountType) => {
    const updatedTypes = filters.accountTypes.includes(accountType)
      ? filters.accountTypes.filter(type => type !== accountType)
      : [...filters.accountTypes, accountType];
    
    onFiltersChange({
      ...filters,
      accountTypes: updatedTypes
    });
  };

  const handleBankTypeChange = (bankType: BankType) => {
    const updatedTypes = filters.bankTypes.includes(bankType)
      ? filters.bankTypes.filter(type => type !== bankType)
      : [...filters.bankTypes, bankType];
    
    onFiltersChange({
      ...filters,
      bankTypes: updatedTypes
    });
  };

  const handleMaxBalanceChange = (value: number) => {
    onFiltersChange({
      ...filters,
      maxMinimumBalance: value
    });
  };

  const handleMaxMonthlyFeeChange = (value: number) => {
    onFiltersChange({
      ...filters,
      maxMonthlyFee: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      accountTypes: [],
      bankTypes: [],
      maxMinimumBalance: 100000,
      maxMonthlyFee: 1000,
      searchTerm: filters.searchTerm
    });
  };

  const hasActiveFilters = filters.accountTypes.length > 0 || 
                          filters.bankTypes.length > 0 ||
                          filters.maxMinimumBalance < 100000 || 
                          filters.maxMonthlyFee < 1000;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-600 mr-3" />
          <span className="font-medium text-gray-700">Filters</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
          {/* Bank Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Bank Types
            </label>
            <div className="space-y-2">
              {bankTypes.map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.bankTypes.includes(type)}
                    onChange={() => handleBankTypeChange(type)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Account Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Account Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {accountTypes.map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.accountTypes.includes(type)}
                    onChange={() => handleAccountTypeChange(type)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Maximum Minimum Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Maximum Minimum Balance: ৳{filters.maxMinimumBalance.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={filters.maxMinimumBalance}
              onChange={(e) => handleMaxBalanceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>৳0</span>
              <span>৳100,000</span>
            </div>
          </div>

          {/* Maximum Monthly Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Maximum Monthly Fee: ৳{filters.maxMonthlyFee.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.maxMonthlyFee}
              onChange={(e) => handleMaxMonthlyFeeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>৳0</span>
              <span>৳1,000</span>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
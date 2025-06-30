import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Building2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CalculatedCharges } from '../types/bank';
import { formatCurrency, sortBanks } from '../utils/calculations';
import { CalculationTooltip } from './CalculationTooltip';
import { CompareButton } from './CompareButton';

interface ComparisonTableProps {
  banks: CalculatedCharges[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ banks }) => {
  const [sortBy, setSortBy] = useState<string>('monthlyTotal');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const navigate = useNavigate();

  const sortedBanks = sortBanks(banks, sortBy, sortOrder);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleToggleSelect = (bankId: string) => {
    setSelectedBanks(prev => 
      prev.includes(bankId) 
        ? prev.filter(id => id !== bankId)
        : prev.length < 3 ? [...prev, bankId] : prev
    );
  };

  const handleCompare = () => {
    navigate(`/compare?banks=${selectedBanks.join(',')}`);
  };

  const handleViewBank = (bankId: string) => {
    navigate(`/bank/${bankId}`);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  if (banks.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No banks found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compare
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('bankName')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Bank Name</span>
                  <SortIcon column="bankName" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('minimumBalance')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Min Balance</span>
                  <SortIcon column="minimumBalance" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Fee
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ATM Fees
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Card Fees
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transfer Fees
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('monthlyTotal')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Monthly Total</span>
                  <SortIcon column="monthlyTotal" />
                  <CalculationTooltip />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('yearlyTotal')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <span>Yearly Total</span>
                  <SortIcon column="yearlyTotal" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedBanks.map((bank, index) => (
              <tr key={`${bank.bankId}-${bank.type}`} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CompareButton
                    selectedBanks={selectedBanks}
                    onCompare={handleCompare}
                    onToggleSelect={handleToggleSelect}
                    bankId={bank.bankId}
                    isSelected={selectedBanks.includes(bank.bankId)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{bank.bankName}</div>
                      <div className="text-xs text-gray-500">{bank.bankType}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {bank.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(bank.minimumBalance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(bank.accountMaintenanceFee)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div>Own: {formatCurrency(bank.atmFeeOwn)}</div>
                    <div>Other: {formatCurrency(bank.atmFeeOther)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div>Debit: {formatCurrency(bank.debitCardFee)}</div>
                    <div>Credit: {formatCurrency(bank.creditCardFee)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div>NEFT: {formatCurrency(bank.neftFee)}</div>
                    <div>BEFTN: {formatCurrency(bank.beftnFee)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(bank.monthlyTotal)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(bank.yearlyTotal)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewBank(bank.bankId)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
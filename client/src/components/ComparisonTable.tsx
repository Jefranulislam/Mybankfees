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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 size-fit">
      {/* Table container with proper overflow handling */}
      <div className="min-w-fit">
          <table className="min-w-fit">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Compare
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48 ">
                  <button
                    onClick={() => handleSort('bankName')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Bank Name</span>
                    <SortIcon column="bankName" />
                  </button>
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Account Type
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  <button
                    onClick={() => handleSort('minimumBalance')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Min Balance</span>
                    <SortIcon column="minimumBalance" />
                  </button>
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Monthly Fee
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  ATM Fees
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Card Fees
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Transfer Fees
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 relative">
                  <button
                    onClick={() => handleSort('monthlyTotal')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Monthly Total</span>
                    <SortIcon column="monthlyTotal" />
                    <CalculationTooltip />
                  </button>
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <button
                    onClick={() => handleSort('yearlyTotal')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Yearly Total</span>
                    <SortIcon column="yearlyTotal" />
                  </button>
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBanks.map((bank, index) => (
                <tr key={`${bank.bankId}-${bank.type}`} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <CompareButton
                      selectedBanks={selectedBanks}
                      onCompare={handleCompare}
                      onToggleSelect={handleToggleSelect}
                      bankId={bank.bankId}
                      isSelected={selectedBanks.includes(bank.bankId)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap overflow-hidden">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm w-16 font-medium text-gray-900 leading-tight">{bank.bankName}</div>
                        <div className="text-xs text-gray-500">{bank.bankType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {bank.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(bank.minimumBalance)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(bank.accountMaintenanceFee)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="text-xs">Own: <span className="font-medium">{formatCurrency(bank.atmFeeOwn)}</span></div>
                      <div className="text-xs">Other: <span className="font-medium">{formatCurrency(bank.atmFeeOther)}</span></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="text-xs">Debit: <span className="font-medium">{formatCurrency(bank.debitCardFee)}</span></div>
                      <div className="text-xs">Credit: <span className="font-medium">{formatCurrency(bank.creditCardFee)}</span></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="text-xs">NSPB: <span className="font-medium">{formatCurrency(bank.nspbFee)}</span></div>
                      <div className="text-xs">BEFTN: <span className="font-medium">{formatCurrency(bank.beftnFee)}</span></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(bank.monthlyTotal)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(bank.yearlyTotal)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewBank(bank.bankId)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      
      {/* Scroll indicator for mobile */}
      <div className="lg:hidden px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
        ← Scroll horizontally to see all columns →
      </div>
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { Building2, Calculator, TrendingUp, Users } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ComparisonTable } from '../components/ComparisonTable';
import { StatsCard } from '../components/StatsCard';
import { bangladeshiBanks } from '../data/banks';
import { calculateCharges, formatCurrency } from '../utils/calculations';
import { FilterOptions, CalculatedCharges } from '../types/bank';

export const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    accountTypes: [],
    bankTypes: [],
    maxMinimumBalance: 100000,
    maxMonthlyFee: 1000,
    searchTerm: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const calculatedBanks = useMemo(() => {
    const allCalculated: CalculatedCharges[] = [];
    
    bangladeshiBanks.forEach(bank => {
      bank.accountTypes.forEach(accountType => {
        const calculated = calculateCharges(bank.id, bank.bankName, bank.bankType, accountType);
        allCalculated.push(calculated);
      });
    });
    
    return allCalculated;
  }, []);

  const filteredBanks = useMemo(() => {
    return calculatedBanks.filter(bank => {
      // Search filter
      if (filters.searchTerm && !bank.bankName.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Account type filter
      if (filters.accountTypes.length > 0 && !filters.accountTypes.includes(bank.type)) {
        return false;
      }

      // Bank type filter
      if (filters.bankTypes.length > 0 && !filters.bankTypes.includes(bank.bankType)) {
        return false;
      }

      // Minimum balance filter
      if (bank.minimumBalance > filters.maxMinimumBalance) {
        return false;
      }

      // Monthly fee filter
      if (bank.monthlyTotal > filters.maxMonthlyFee) {
        return false;
      }

      return true;
    });
  }, [calculatedBanks, filters]);

  const stats = useMemo(() => {
    const totalBanks = filteredBanks.length;
    const avgMinBalance = totalBanks > 0 
      ? filteredBanks.reduce((sum, bank) => sum + bank.minimumBalance, 0) / totalBanks 
      : 0;
    const avgMonthlyFee = totalBanks > 0 
      ? filteredBanks.reduce((sum, bank) => sum + bank.monthlyTotal, 0) / totalBanks 
      : 0;
    const lowestMonthlyFee = totalBanks > 0 
      ? Math.min(...filteredBanks.map(bank => bank.monthlyTotal)) 
      : 0;

    return {
      totalBanks,
      avgMinBalance: Math.round(avgMinBalance),
      avgMonthlyFee: Math.round(avgMonthlyFee),
      lowestMonthlyFee
    };
  }, [filteredBanks]);

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find the Best Banking Deals in Bangladesh
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Compare fees, charges, and features across all major banks. Make informed decisions and save money on your banking needs.
            </p>
            
            <SearchBar
              searchTerm={filters.searchTerm}
              onSearchChange={handleSearchChange}
              placeholder="Search banks (e.g., Dutch Bangla, BRAC, Islami Bank)..."
            />

            <div className="mt-8 text-sm text-blue-100">
              <p>✓ {bangladeshiBanks.length}+ Banks • ✓ Real-time Data • ✓ All Account Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Account Options"
              value={stats.totalBanks.toString()}
              icon={Building2}
              color="blue"
            />
            <StatsCard
              title="Avg Min Balance"
              value={formatCurrency(stats.avgMinBalance)}
              icon={Calculator}
              color="green"
            />
            <StatsCard
              title="Avg Monthly Fee"
              value={formatCurrency(stats.avgMonthlyFee)}
              icon={TrendingUp}
              color="orange"
            />
            <StatsCard
              title="Lowest Monthly Fee"
              value={formatCurrency(stats.lowestMonthlyFee)}
              icon={Users}
              color="purple"
            />
          </div>

          {/* Filters */}
          <div className="mb-8">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>

          {/* Results */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Comparison Results
            </h2>
            <p className="text-gray-600">
              Showing {filteredBanks.length} of {calculatedBanks.length} bank accounts
            </p>
          </div>
        </div>

        {/* Table with full width */}
        <div className="w-full">
          <ComparisonTable banks={filteredBanks} />
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-12 text-center text-gray-500 text-sm">
          <p>
            * Charges are based on typical usage patterns and may vary. 
            Monthly totals include estimated usage of ATM, transfer, and other services.
          </p>
          <p className="mt-2">
            Please verify current rates with respective banks before making decisions.
          </p>
        </div>
      </div>
    </div>
  );
};
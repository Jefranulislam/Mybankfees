import React, { useState, useMemo, useEffect } from 'react';
import { Building2, Calculator, TrendingUp, Users, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ComparisonTable } from '../components/ComparisonTable';
import { StatsCard } from '../components/StatsCard';
import { bankService } from '../services/api';
import { calculateCharges, formatCurrency, transformBankData } from '../utils/calculations';
import { FilterOptions, CalculatedCharges, BankCharge } from '../types/bank';

export const HomePage : React.FC = () => {
  const [banks, setBanks] = useState<BankCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    accountTypes: [],
    bankTypes: [],
    maxMinimumBalance: 100000,
    maxMonthlyFee: 1000,
    searchTerm: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true);
        const apiBanks = await bankService.getAllBanks();
        const transformedBanks = apiBanks.map(bank => transformBankData(bank));
        setBanks(transformedBanks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch banks');
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const calculatedBanks = useMemo(() => {
    const allCalculated: CalculatedCharges[] = [];
    
    banks.forEach(bank => {
      // Add defensive check to ensure accountTypes exists and is an array
      if (bank.accountTypes && Array.isArray(bank.accountTypes)) {
        bank.accountTypes.forEach(accountType => {
          const calculated = calculateCharges(bank.id, bank.bankName, bank.bankType, accountType);
          allCalculated.push(calculated);
        });
      }
    });
    
    return allCalculated;
  }, [banks]);

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
Stop Guessing. Start Knowing Bank Fees <br/> from Every Bangladeshi Bank.            </h1>
            <p className="text-xl text-blue-100 p-2 max-w-3xl mx-auto">
"আপনার টাকা কোথায় কাটছে, জানেন তো?"
            </p>
            <p className="text-xl text-blue-100 p-2 max-w-3xl mx-auto">
"MyBankFees সব ব্যাংকের চার্জ, এক জায়গায়।"
            </p>
            
            <SearchBar
              searchTerm={filters.searchTerm}
              onSearchChange={handleSearchChange}
              placeholder="Search banks (e.g., Dutch Bangla, BRAC, Islami Bank)..."
            />

            <div className="mt-8 text-sm text-blue-100">
              <p>✓ {banks.length}+ Banks • ✓ Real-time Data • ✓ All Account Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Loading Banks</h2>
              <p className="text-gray-500">Please wait while we fetch the latest bank data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Banks</h2>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
            <>
            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatsCard
                title="Bank Information"
                value={banks.length.toString()}
                icon={Building2}
                color="indigo"
              />
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
            </>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">BankCompare BD</h1>
              <p className="text-xs text-gray-600">Compare Banking Fees</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/compare"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/compare' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Compare
            </Link>
            <Link
              to="/admin"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                location.pathname === '/admin' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
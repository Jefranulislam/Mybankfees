import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { getCalculationBreakdown } from '../utils/calculations';

export const CalculationTooltip: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const breakdown = getCalculationBreakdown();

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
        title="How we calculate monthly totals"
      >
        <Info className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{breakdown.title}</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{breakdown.description}</p>
              
              <ul className="space-y-1 text-sm text-gray-700">
                {breakdown.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              
              <p className="text-xs text-blue-600 mt-3 font-medium">{breakdown.note}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
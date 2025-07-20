import React from 'react';
import { GitCompare } from 'lucide-react';

interface CompareButtonProps {
  selectedBanks: string[];
  onCompare: () => void;
  onToggleSelect: (bankId: string) => void;
  bankId: string;
  isSelected: boolean;
}

export const CompareButton: React.FC<CompareButtonProps> = ({
  selectedBanks,
  onCompare,
  onToggleSelect,
  bankId,
  isSelected
}) => {
  return (
    <div className="flex items-center space-x-2 justify-center">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(bankId)}
          className="rounded border-gray-300  text-blue-600 focus:ring-blue-500"
          disabled={!isSelected && selectedBanks.length >= 3}
        />
      </label>
      
      {selectedBanks.length >= 2 && (
        <button
          onClick={onCompare}
          className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <GitCompare className="w-4 h-4 mr-1" />
          Compare ({selectedBanks.length})
        </button>
      )}
    </div>
  );
};
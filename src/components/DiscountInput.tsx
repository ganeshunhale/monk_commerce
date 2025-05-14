import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DiscountInputProps {
  value: string;
  type: 'flat' | 'percentage';
  onChange: (value: string, type: 'flat' | 'percentage') => void;
}

const DiscountInput: React.FC<DiscountInputProps> = ({ value, type, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow numbers and a single decimal point
    if (/^(\d*\.?\d*)$/.test(newValue) || newValue === '') {
      onChange(newValue, type);
    }
  };

  const handleTypeChange = (newType: 'flat' | 'percentage') => {
    onChange(value, newType);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="0"
        className="w-16 bg-gray-50 border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 rounded-l-md"
      />
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {type === 'percentage' ? '% Off' : 'flat Off'}
          <ChevronDown size={14} className="ml-1" />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-24 rounded-md shadow-lg bg-white z-10">
            <div className="py-1">
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${type === 'percentage' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleTypeChange('percentage')}
              >
                % Off
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${type === 'flat' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleTypeChange('flat')}
              >
                flat Off
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountInput;
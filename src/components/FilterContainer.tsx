import React, { useState } from 'react';
import {
  CalendarIcon,
  CreditCardIcon,
  EyeIcon,
  FilterIcon,
  TasklistIcon,
} from '@primer/octicons-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterContainerProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
}

const FilterContainer = ({
  onSearch,
  onFilterChange,
}: FilterContainerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    onFilterChange(filter);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className='flex flex-row gap-5 px-[14px] py-2 items-center'>
      <input
        type='text'
        placeholder='Search...'
        value={searchQuery}
        onChange={handleSearchChange}
        className='text-[13px] rounded-full px-[17px] py-[9px] w-full border border-[#C2C2C2] focus:ring-[#15BC70] focus:border-[#15BC70]'
      />
      <div className='flex flex-row gap-[15px] relative'>
        <button onClick={toggleDropdown}>
          <FilterIcon
            size={24}
            className='text-[#797C7B] hover:text-[#373838]'
          />
        </button>
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className='absolute right-0 mt-10 w-[160px] bg-white text-[#494949] rounded-lg shadow-lg'
            >
              <div className='flex flex-col'>
                <button
                  onClick={() => handleFilterChange('Show All')}
                  className='flex items-center gap-2 text-sm px-4 py-2 hover:bg-gray-100'
                >
                  <EyeIcon />
                  Show All
                </button>
                <button
                  onClick={() => handleFilterChange('Category')}
                  className='flex items-center gap-2 text-sm px-4 py-2 hover:bg-gray-100'
                >
                  <TasklistIcon />
                  Category
                </button>
                <button
                  onClick={() => handleFilterChange('Price')}
                  className='flex items-center gap-2 text-sm px-4 py-2 hover:bg-gray-100'
                >
                  <CreditCardIcon />
                  Price
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Link to={'/history'}>
          <CalendarIcon
            size={24}
            className='text-[#797C7B] hover:text-[#373838]'
          />
        </Link>
      </div>
    </div>
  );
};

export default FilterContainer;

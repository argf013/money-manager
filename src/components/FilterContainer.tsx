import React, { useState } from 'react';
import {
  CalendarIcon,
  CreditCardIcon,
  EyeIcon,
  FilterIcon,
  TasklistIcon,
} from '@primer/octicons-react';
import { Dropdown } from 'flowbite-react';
import { Link } from 'react-router-dom';

interface FilterContainerProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
}

const FilterContainer = ({
  onSearch,
  onFilterChange,
}: FilterContainerProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    onFilterChange(filter);
  };

  return (
    <div className='flex flex-row gap-5 px-[14px] py-2 items-center'>
      <input
        type='text'
        placeholder='Search...'
        value={searchQuery}
        onChange={handleSearchChange}
        className='text-[13px] rounded-full px-[17px] py-[9px] w-full border border-[#C2C2C2] focus:outline-[#17A364]'
      />
      <div className='flex flex-row gap-[15px]'>
        <Dropdown
          label={<FilterIcon size={24} className='text-[#797C7B]' />}
          dismissOnClick={true}
          inline
          arrowIcon={false}
          placement='bottom-end'
        >
          <Dropdown.Item onClick={() => handleFilterChange('Show All')}>
            <div className='flex items-center gap-2 text-sm'>
              <EyeIcon />
              Show All
            </div>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterChange('Category')}>
            <div className='flex items-center gap-2 text-sm'>
              <TasklistIcon />
              Category
            </div>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterChange('Price')}>
            <div className='flex items-center gap-2 text-sm'>
              <CreditCardIcon />
              Price
            </div>
          </Dropdown.Item>
        </Dropdown>
        <Link to={'/history'}>
          <CalendarIcon size={24} className='text-[#797C7B]' />
        </Link>
      </div>
    </div>
  );
};

export default FilterContainer;

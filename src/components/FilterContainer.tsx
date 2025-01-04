import { CalendarIcon, FilterIcon } from '@primer/octicons-react';

const FilterContainer = () => {
  return (
    <div className='flex flex-row gap-5 px-[14px] py-2 items-center'>
      <input
        type='text'
        placeholder='Search...'
        className='text-[13px] rounded-full px-[17px] py-[9px] w-full border border-[#C2C2C2] focus:outline-[#17A364]'
      />
      <div className='flex flex-row gap-[15px]'>
        <button>
          <FilterIcon size={24} className='text-[#797C7B]' />
        </button>
        <button>
          <CalendarIcon size={24} className='text-[#797C7B]' />
        </button>
      </div>
    </div>
  );
};

export default FilterContainer;

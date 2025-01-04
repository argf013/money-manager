import { BellFillIcon, SparkleFillIcon } from '@primer/octicons-react';

const Navbar = () => {
  return (
    <div className='bg-[#17A364] text-white border-b w-full'>
      <div className='flex justify-between items-center p-4 w-full'>
        <div id='brand' className='flex items-center space-x-1'>
          <SparkleFillIcon size={16} className='rotate-[-18deg]' />
          <span className='text-lg font-bold'>Mana Plan</span>
        </div>
        <BellFillIcon size={16} />
      </div>
    </div>
  );
};

export default Navbar;

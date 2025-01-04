import {
  FeedRocketIcon,
  FiscalHostIcon,
  PencilIcon,
} from '@primer/octicons-react';
import { useState } from 'react';

const BalanceCard = () => {
  const [balance] = useState(1000000);
  const formattedBalance = new Intl.NumberFormat('id-ID').format(balance);

  return (
    <div className='flex flex-col items-center gap-[10px] p-5 pb-8 bg-gradient-to-b from-[#17A364] to-[#178953] text-white rounded-bl-[30px] rounded-br-[30px]'>
      <div className='flex items-center space-x-2'>
        <FiscalHostIcon size={24} />
        <span className='text-base font-medium'>Balance</span>
      </div>
      <div className='flex items-center space-x-2'>
        <span className='text-lg font-bold'>Rp {formattedBalance}</span>
        <button>
          <PencilIcon size={14} />
        </button>
      </div>
      <div className='flex items-center gap-1'>
        <FeedRocketIcon size={14} />
        <span className='text-sm flex'>
          You’ll have a surplus of&nbsp;
          <span className='font-bold'>Rp 150.000&nbsp;</span> next month.
        </span>
      </div>
    </div>
  );
};

export default BalanceCard;

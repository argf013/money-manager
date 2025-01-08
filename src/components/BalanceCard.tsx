import {
  FeedRocketIcon,
  FiscalHostIcon,
  PencilIcon,
} from '@primer/octicons-react';
import DialogForm from './DialogForm';
import IndexedDBService from '../service';
import { Action } from '../types/transactions';
import { useDialog } from '../context/DialogContext';

const BalanceCard = ({
  balance,
  setBalance,
  setNotifications,
  notifications,
}: {
  balance: number;
  setBalance: (balance: number) => void;
  setNotifications: React.Dispatch<React.SetStateAction<Action[]>>;
  notifications: Action[];
}) => {
  const { setIsVisible } = useDialog();
  const formattedBalance = new Intl.NumberFormat('id-ID').format(balance);

  const handleOpenDialog = () => setIsVisible(true);
  const handleCloseDialog = () => setIsVisible(false);

  const handleSaveBalance = async (
    _name?: string,
    amount?: number,
    _category?: string,
    detail?: string,
  ) => {
    if (amount !== undefined) {
      try {
        await IndexedDBService.editBalance(amount, detail as string);
        setBalance(amount);
        setNotifications([
          ...notifications,
          {
            actionId: notifications.length + 1,
            date: new Date().toISOString(),
            action: 'Balance Updated',
            detail: detail || '',
            from: balance.toString(),
            to: amount.toString(),
          },
        ]);
        setIsVisible(false);
      } catch (error) {
        console.error('Error updating balance:', error);
      }
    }
  };

  return (
    <div className='flex flex-col items-center gap-[10px] p-5 pb-8 bg-gradient-to-b from-[#17A364] to-[#178953] text-white rounded-bl-[30px] rounded-br-[30px]'>
      <div className='flex items-center space-x-2'>
        <FiscalHostIcon size={24} />
        <span className='text-base font-medium'>Balance</span>
      </div>
      <div className='flex items-center space-x-2'>
        <span className='text-lg font-bold'>Rp{formattedBalance}</span>
        <button onClick={handleOpenDialog}>
          <PencilIcon size={20} />
        </button>
      </div>
      <div className='flex items-center gap-1'>
        <FeedRocketIcon size={14} />
        <span className='text-sm flex'>
          You`ll have a surplus of&nbsp;
          <span className='font-bold'>Rp150.000&nbsp;</span> next month.
        </span>
      </div>
      <DialogForm
        onSave={handleSaveBalance}
        onCancel={handleCloseDialog}
        type='balance'
        initialAmount={balance}
      />
    </div>
  );
};

export default BalanceCard;

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FeedRocketIcon,
  FiscalHostIcon,
  GoalIcon,
  PencilIcon,
} from '@primer/octicons-react';
import DialogForm from './DialogForm';
import IndexedDBService from '../service';
import { Action } from '../types/transactions';
import { useDialog } from '../context/DialogContext';

interface BalanceCardProps {
  balance: number;
  surplus: number;
  setBalance: (balance: number) => void;
  setNotifications: React.Dispatch<React.SetStateAction<Action[]>>;
  notifications: Action[];
  payDayDate: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  setBalance,
  surplus,
  setNotifications,
  notifications,
  payDayDate,
}) => {
  const { setIsVisible, setType } = useDialog();
  const workingDaysRemaining = Number(
    sessionStorage.getItem('workingDaysRemaining'),
  );

  const [sufficient, setSufficient] = useState(
    sessionStorage.getItem('sufficient'),
  );

  useEffect(() => {
    if (surplus >= 0) {
      sessionStorage.setItem('sufficient', 'true');
      setSufficient('true');
    } else {
      sessionStorage.setItem('sufficient', 'false');
      setSufficient('false');
    }
  }, [surplus]);

  const formattedBalance = useMemo(
    () => new Intl.NumberFormat('id-ID').format(balance),
    [balance],
  );

  const handleOpenDialog = useCallback(() => {
    setIsVisible(true);
    setType('balance');
  }, [setIsVisible, setType]);

  const handleCloseDialog = useCallback(
    () => setIsVisible(false),
    [setIsVisible],
  );

  const handleSaveBalance = useCallback(
    async (
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
    },
    [balance, notifications, setBalance, setIsVisible, setNotifications],
  );

  return (
    <div
      className={`flex flex-col items-center gap-[10px] p-5 pb-8 text-white rounded-bl-[30px] rounded-br-[30px] ${
        sufficient === 'false'
          ? 'bg-gradient-to-b from-[#C04D4D] to-[#9f3636]'
          : 'bg-gradient-to-b from-[#17A364] to-[#178953]'
      }`}
    >
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
          {typeof surplus === 'number' && !isNaN(surplus) ? (
            surplus >= 0 ? (
              <>
                You`ll have a surplus of&nbsp;
                <span className='font-bold'>
                  +Rp
                  {new Intl.NumberFormat('id-ID').format(
                    Number(surplus.toFixed(2)),
                  )}
                  &nbsp;
                </span>
                on {payDayDate}th.
              </>
            ) : (
              <>
                Deficit&nbsp;
                <span className='font-bold'>
                  -Rp
                  {new Intl.NumberFormat('id-ID').format(
                    Number(Math.abs(surplus).toFixed(2)),
                  )}
                  &nbsp;
                </span>
                on {payDayDate}th.
              </>
            )
          ) : (
            'Invalid surplus value'
          )}
        </span>
      </div>
      <div className='text-sm flex flex-row items-center gap-1'>
        <span>
          <GoalIcon size={14} />
        </span>
        <div>
          <b>{workingDaysRemaining}</b>
          &nbsp;working days remaining
        </div>
      </div>
      <DialogForm
        onSave={handleSaveBalance}
        onCancel={handleCloseDialog}
        initialAmount={balance}
      />
    </div>
  );
};

export default BalanceCard;

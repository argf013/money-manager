import React, { useState } from 'react';
import {
  ChecklistIcon,
  DownloadIcon,
  SunIcon,
  UploadIcon,
} from '@primer/octicons-react';
import DialogForm from './DialogForm';
import IndexedDBService from '../service';
import { Income, Transaction, DailyExpense } from '../types/transactions';
import { useDialog } from '../context/DialogContext';

const IconButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) => (
  <div className='flex flex-col justify-center items-center gap-2'>
    <button
      className='bg-[#17A364] hover:bg-[#199c61] text-white rounded-[4px] p-[5px] w-[44px] h-[44px] flex items-center justify-center'
      onClick={onClick}
    >
      <Icon size={20} />
    </button>
    <span className='font-medium text-sm text-[#17A364]'>{label}</span>
  </div>
);

const ButtonContainer = ({
  setBalance,
  onTransactionAdded,
}: {
  setBalance: (balance: number) => void;
  onTransactionAdded: () => void;
}) => {
  const { setIsVisible } = useDialog();
  const [dialogType, setDialogType] = useState<'expense' | 'income' | 'daily'>(
    'expense',
  );

  const handleOpenDialog = (type: 'expense' | 'income' | 'daily') => {
    setDialogType(type);
    setIsVisible(true);
  };

  const handleCloseDialog = () => {
    setIsVisible(false);
  };

  const handleSave = (name?: string, amount?: number, category?: string) => {
    if (dialogType === 'income') {
      const newIncome = {
        transactionId: Date.now(),
        transactionName: name,
        date: new Date().toISOString(),
        transactionAmount: amount,
        category: 'Income',
        type: 'income',
      };

      IndexedDBService.addIncome(newIncome as Income)
        .then(() => {
          IndexedDBService.getBalance().then((balance) => {
            if (balance) {
              setBalance(balance.balance);
            }
          });
          onTransactionAdded();
        })
        .catch((error) => {
          console.error('Error adding income:', error);
        });
    } else if (dialogType === 'expense') {
      const newTransaction = {
        transactionId: Date.now(),
        transactionName: name,
        date: new Date().toISOString(),
        transactionAmount: amount,
        category: category,
        type: 'expense',
      };

      IndexedDBService.addTransaction(newTransaction as Transaction)
        .then(() => {
          IndexedDBService.getBalance().then((balance) => {
            if (balance) {
              setBalance(balance.balance);
            }
          });
          onTransactionAdded();
        })
        .catch((error) => {
          console.error('Error adding transaction:', error);
        });
    } else if (dialogType === 'daily') {
      const newExpense = {
        expenseId: Date.now(),
        name: name,
        category: category,
        time: new Date().toISOString(),
        amount: amount,
      };

      IndexedDBService.addExpense(newExpense as DailyExpense)
        .then(() => {
          onTransactionAdded();
        })
        .catch((error) => {
          console.error('Error adding daily expense:', error);
        });
    }

    setIsVisible(false);
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex justify-center gap-7 px-5 py-8'>
        <IconButton
          icon={UploadIcon}
          label='Expense'
          onClick={() => handleOpenDialog('expense')}
        />
        <IconButton
          icon={DownloadIcon}
          label='Income'
          onClick={() => handleOpenDialog('income')}
        />
        <IconButton
          icon={SunIcon}
          label='Set Daily'
          onClick={() => handleOpenDialog('daily')}
        />
        <IconButton icon={ChecklistIcon} label='Export' />
      </div>
      <DialogForm
        onSave={handleSave}
        onCancel={handleCloseDialog}
        type={dialogType}
      />
    </div>
  );
};

export default ButtonContainer;

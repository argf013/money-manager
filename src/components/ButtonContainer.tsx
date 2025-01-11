import React, { useCallback, useEffect, useState } from 'react';
import {
  CalendarIcon,
  ChecklistIcon,
  DownloadIcon,
  SunIcon,
  UploadIcon,
} from '@primer/octicons-react';
import DialogForm from './DialogForm';
import IndexedDBService from '../service';
import { Income, Transaction, DailyExpense } from '../types/transactions';
import { useDialog } from '../context/DialogContext';
import Dialog from './Dialog';

const IconButton = ({
  icon: Icon,
  label,
  onClick,
  balance,
  surplus,
  payDayDate,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  surplus?: number;
  balance: number;
  payDayDate: number;
}) => {
  const [buttonColor, setButtonColor] = useState('#17A364');

  useEffect(() => {
    if (surplus !== undefined) {
      setButtonColor(surplus < 0 ? '#C04D4D' : '#17A364');
    }
  }, [balance, payDayDate, surplus]);

  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <button
        className={`bg-[${buttonColor}] hover:bg-[${buttonColor}] text-white rounded-[4px] p-[5px] w-[44px] h-[44px] flex items-center justify-center`}
        onClick={onClick}
      >
        <Icon size={20} />
      </button>
      <span className={`font-medium text-sm text-[${buttonColor}]`}>
        {label}
      </span>
    </div>
  );
};

const ButtonContainer = ({
  surplus,
  setSurplus,
  setBalance,
  onTransactionAdded,
  balance,
  payDayDate,
  setPayDayDate,
  onExpenseDelete,
}: {
  surplus: number;
  setSurplus: (surplus: number) => void;
  setBalance: (balance: number) => void;
  onTransactionAdded: () => void;
  balance: number;
  payDayDate: number;
  setPayDayDate: (payDayDate: number) => void;
  onExpenseDelete: () => void;
}) => {
  const { setIsVisible, setType, type, showDialog, hideDialog } = useDialog();

  const handleOpenDialog = (
    type: 'expense' | 'income' | 'daily' | 'balance' | 'payDayDate',
  ) => {
    setType(type);
    setIsVisible(true);
    if (type === 'payDayDate') {
      setPayDayDate(payDayDate);
    }
  };

  const handleCloseDialog = () => {
    hideDialog();
  };

  const handleOpenDailyDialog = () => {
    showDialog();
  };

  useEffect(() => {
    isBalanceSufficient(balance);
  }, []);

  const getDailyAmount = useCallback(async () => {
    const response = await IndexedDBService.getAllExpenses();
    const workingDayExpenses = response.filter((expense) => {
      const expenseDate = new Date(expense.time);
      const day = expenseDate.getDay();
      return day >= 1 && day <= 5;
    });
    const totalAmount = workingDayExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    return totalAmount / workingDayExpenses.length;
  }, []);

  const getWorkingDaysUntilPayday = useCallback(
    (currentDate: Date) => {
      let workingDays = 0;
      let targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        payDayDate,
      );

      if (currentDate > targetDate) {
        targetDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          payDayDate,
        );
      }

      while (currentDate <= targetDate) {
        const day = currentDate.getDay();
        if (day >= 1 && day <= 5) {
          workingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return workingDays;
    },
    [payDayDate],
  );

  const isBalanceSufficient = useCallback(
    async (balance: number) => {
      const dailyAmount = await getDailyAmount();
      const today = new Date();
      const workingDaysRemaining = getWorkingDaysUntilPayday(new Date(today));

      if (workingDaysRemaining <= 0) {
        return { sufficient: false, surplus: 0, workingDaysRemaining };
      }

      const requiredAmount = dailyAmount * workingDaysRemaining;
      const surplus = balance - requiredAmount;
      const sufficient = balance >= requiredAmount;
      return {
        sufficient,
        surplus,
        workingDaysRemaining,
      };
    },
    [getDailyAmount, getWorkingDaysUntilPayday],
  );

  const handleSave = async (
    name?: string,
    amount?: number,
    category?: string,
    _detail?: string,
    payDayDate?: number,
  ) => {
    if (type === 'income') {
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
    } else if (type === 'expense') {
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
    } else if (type === 'daily') {
      const newExpense = {
        expenseId: Date.now(),
        name: name,
        category: category,
        time: new Date().toISOString(),
        amount: amount,
      };

      IndexedDBService.addExpense(newExpense as DailyExpense)
        .then(async () => {
          if (amount) {
            const { surplus } = await isBalanceSufficient(balance);
            setSurplus(surplus);
          }
          onTransactionAdded();
        })
        .catch((error) => {
          console.error('Error adding daily expense:', error);
        });
    } else if (type === 'payDayDate') {
      if (payDayDate) {
        setPayDayDate(payDayDate);
        sessionStorage.setItem('payDayDate', payDayDate.toString());
      }
    }

    setIsVisible(false);
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='grid grid-cols-4 gap-6 px-5 py-7'>
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={UploadIcon}
          label='Expense'
          onClick={() => handleOpenDialog('expense')}
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={DownloadIcon}
          label='Income'
          onClick={() => handleOpenDialog('income')}
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={SunIcon}
          label='Set Daily'
          onClick={() => handleOpenDialog('daily')}
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={ChecklistIcon}
          label='Export'
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={ChecklistIcon}
          label='Daily'
          onClick={handleOpenDailyDialog}
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={CalendarIcon}
          label='Set Date'
          onClick={() => handleOpenDialog('payDayDate')}
        />
      </div>
      {type !== 'balance' && (
        <DialogForm onSave={handleSave} onCancel={handleCloseDialog} />
      )}
      <Dialog
        header='Daily Expenses'
        onClose={handleCloseDialog}
        onExpenseDelete={onExpenseDelete}
      />
    </div>
  );
};

export default ButtonContainer;

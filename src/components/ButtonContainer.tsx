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
import jsPDF from 'jspdf';

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
      <div className="w-full min-h-[36px] flex items-center justify-center px-1" title={label}>
        <span className={`font-medium text-sm text-[${buttonColor}] text-center`}>
          {label}
        </span>
      </div>
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

  const handleExport = async () => {
    const transactions = await IndexedDBService.getAllTransactions();
    const doc = new jsPDF();

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    const dates = transactions.map((transaction) => new Date(transaction.date));
    const startDate = new Date(
      Math.min(...dates.map((date) => date.getTime())),
    );
    const endDate = new Date(Math.max(...dates.map((date) => date.getTime())));

    const formattedStartDate = startDate.toLocaleDateString('id-ID');
    const formattedEndDate = endDate.toLocaleDateString('id-ID');

    doc.text(
      `Transaction Report from ${formattedStartDate} to ${formattedEndDate}`,
      10,
      10,
    );

    doc.setFontSize(10);
    doc.text('No', 10, 20);
    doc.text('Category', 30, 20);
    doc.text('Transaction Name', 60, 20);
    doc.text('Amount', 120, 20);
    doc.text('Date', 160, 20);

    doc.line(10, 22, 200, 22);

    let totalAmount = 0;

    transactions.forEach((transaction, index) => {
      const rowY = 30 + index * 10;
      doc.text((index + 1).toString(), 10, rowY);
      doc.text(transaction.category, 30, rowY);
      doc.text(transaction.transactionName, 60, rowY);

      const formattedAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(transaction.transactionAmount);
      doc.text(formattedAmount, 120, rowY);

      const formattedDate = new Date(transaction.date).toLocaleDateString(
        'id-ID',
      );
      doc.text(formattedDate, 160, rowY);

      totalAmount += transaction.transactionAmount;
    });
    doc.line(
      10,
      30 + transactions.length * 10,
      200,
      30 + transactions.length * 10,
    );
    const totalFormatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(totalAmount);
    doc.text('Total:', 120, 30 + transactions.length * 10 + 10);
    doc.text(totalFormatted, 160, 30 + transactions.length * 10 + 10);
    doc.save('transactions.pdf');
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
        localStorage.setItem('payDayDate', payDayDate.toString());
      }
    }

    setIsVisible(false);
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='grid grid-cols-4 gap-4 px-5 py-7'>
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={UploadIcon}
          label='Add Expense'
          onClick={() => handleOpenDialog('expense')}
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={DownloadIcon}
          label='Add Income'
          onClick={() => handleOpenDialog('income')}
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={SunIcon}
          label='Set Daily Expenses'
          onClick={() => handleOpenDialog('daily')}
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={ChecklistIcon}
          label='Export Data'
          onClick={handleExport}
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={ChecklistIcon}
          label='Daily Expenses'
          onClick={handleOpenDailyDialog}
        />
        <IconButton
          balance={balance}
          surplus={surplus}
          payDayDate={payDayDate}
          icon={CalendarIcon}
          label='Set Payday Date'
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

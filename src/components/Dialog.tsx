import { SmileyIcon, XIcon } from '@primer/octicons-react';
import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IndexedDBService from '../service';
import { DailyExpense } from '../types/transactions';
import { useDialog } from '../context/DialogContext';

interface DialogProps {
  header: string;
  onClose: () => void;
  onExpenseDelete: () => void;
}

const Dialog: React.FC<DialogProps> = ({
  header,
  onClose,
  onExpenseDelete,
}) => {
  const [expenses, setExpenses] = useState<DailyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { isDialogVisible, hideDialog } = useDialog();

  const onDialogClose = () => {
    onClose();
    hideDialog();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDialogClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const getAllExpenses = async () => {
      try {
        const response = await IndexedDBService.getAllExpenses();
        setExpenses(response);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    getAllExpenses();
  }, [onClose]);

  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString('id-ID')} / day`;
  };

  const handleDelete = async (id: number) => {
    try {
      await IndexedDBService.deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense.expenseId !== id));
      onExpenseDelete();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  return (
    <AnimatePresence>
      {isDialogVisible && (
        <div
          ref={dialogRef}
          className='fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-10 z-50'
          onClick={(event) => {
            if (event.target === dialogRef.current) {
              onDialogClose();
            }
          }}
        >
          <motion.div
            className='min-w-[353px] bg-white rounded-lg shadow-lg px-[25px] py-[20px] flex flex-col gap-[12px]'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='flex items-center gap-2 font-bold text-[#15BC70]'>
              <h2 className='font-semibold'>{header}</h2>
              <button
                onClick={onDialogClose}
                className='text-gray-500 hover:text-gray-700 ml-auto'
              >
                <XIcon size={24} />
              </button>
            </div>
            <div className='flex flex-col justify-between items-center'>
              {loading ? (
                <div className='flex justify-center items-center py-5'>
                  <div className='loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12'></div>
                </div>
              ) : expenses.length === 0 ? (
                <div className='text-gray-400 flex flex-col items-center gap-5 py-2'>
                  <SmileyIcon size={108} />
                  <span className='text-xl'>No daily expenses to display</span>
                </div>
              ) : (
                expenses.map((expense, index) => (
                  <div
                    key={expense.expenseId}
                    className={`flex flex-row justify-between items-center w-full py-3 ${
                      index !== expenses.length - 1
                        ? 'border-b border-gray-200'
                        : ''
                    }`}
                  >
                    <span className='text-sm'>{expense.name}</span>
                    <span className='text-sm font-bold text-[#15BC70] flex flex-row'>
                      {formatCurrency(expense.amount)}
                      <button
                        onClick={() => handleDelete(expense.expenseId)}
                        className='text-gray-500 hover:text-gray-700 ml-2'
                      >
                        <XIcon size={16} className='text-[#C04D4D]' />
                      </button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Dialog;

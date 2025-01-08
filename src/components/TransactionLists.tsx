import { useEffect, useState } from 'react';
import IndexedDBService from '../service';
import { Transaction } from '../types/transactions';

interface TransactionListsProps {
  refresh?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  searchQuery?: string;
  filter?: string;
}

const TransactionLists = ({
  refresh,
  startDate,
  endDate,
  searchQuery = '',
  filter = 'Show All',
}: TransactionListsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const allTransactions = await IndexedDBService.getAllTransactions();
      setTransactions(allTransactions);
    };

    fetchTransactions();
  }, [refresh]);

  const filteredTransactions = transactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (startDate && transactionDate < startDate) return false;
      if (
        endDate &&
        transactionDate > new Date(endDate.setHours(23, 59, 59, 999))
      )
        return false;
      if (
        searchQuery &&
        !transaction.transactionName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (filter === 'Price') {
        return b.transactionAmount - a.transactionAmount;
      }
      if (filter === 'Category') {
        if (a.type === 'income' && b.type !== 'income') return -1;
        if (a.type !== 'income' && b.type === 'income') return 1;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className='flex flex-col'>
      {filteredTransactions.map((transaction, index) => (
        <div
          key={index}
          className='flex flex-row justify-between items-center px-[20px] py-[15px] border-b border-[#E0E0E0] hover:bg-slate-200 transition duration-100'
        >
          <span className='font-bold'>{transaction.transactionName}</span>
          <div className='flex flex-col gap-[10px] text-right'>
            <span
              className={`text-sm font-bold ${
                transaction.category === 'Income'
                  ? 'text-[#15BC70]'
                  : 'text-[#C04D4D]'
              }`}
            >
              {transaction.category === 'Income' ? '+Rp' : '-Rp'}
              {new Intl.NumberFormat('id-ID').format(
                transaction.transactionAmount,
              )}
            </span>
            <span className='text-[10px]'>
              {new Date(transaction.date)
                .toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                .replace(' at', '')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionLists;

import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BalanceCard from './components/BalanceCard';
import ButtonContainer from './components/ButtonContainer';
import FilterContainer from './components/FilterContainer';
import TransactionLists from './components/TransactionLists';
import History from './pages/History';
import { Action } from './types/transactions';

interface RoutesWrapperProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  surplus: number;
  setSurplus: React.Dispatch<React.SetStateAction<number>>;
  setNotifications: React.Dispatch<React.SetStateAction<Action[]>>;
  notifications: Action[];
  refresh: boolean;
  handleTransactionAdded: () => void;
  handleExpenseDelete: () => void;
  handleSearch: (query: string) => void;
  handleFilterChange: (filter: string) => void;
  searchQuery: string;
  filter: string;
  payDayDate: number;
  setPayDayDate: React.Dispatch<React.SetStateAction<number>>;
}

const RoutesWrapper = ({
  balance,
  setBalance,
  surplus,
  setSurplus,
  setNotifications,
  notifications,
  refresh,
  handleTransactionAdded,
  handleExpenseDelete,
  handleSearch,
  handleFilterChange,
  searchQuery,
  filter,
  payDayDate,
  setPayDayDate,
}: RoutesWrapperProps) => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path='/'
        element={
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <BalanceCard
              payDayDate={payDayDate}
              balance={balance}
              setBalance={setBalance}
              surplus={surplus}
              setNotifications={setNotifications}
              notifications={notifications}
            />
            <ButtonContainer
              balance={balance}
              surplus={surplus}
              setSurplus={setSurplus}
              setBalance={setBalance}
              onTransactionAdded={handleTransactionAdded}
              onExpenseDelete={handleExpenseDelete}
              payDayDate={payDayDate}
              setPayDayDate={setPayDayDate}
            />
            <h1 className='text-xl font-bold pt-[20px] pb-[15px] text-center text-[#17A364] border-[#17A364] border-t border-dashed'>
              History
            </h1>
            <FilterContainer
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
            />
            <TransactionLists
              refresh={refresh}
              searchQuery={searchQuery}
              filter={filter}
            />
          </motion.div>
        }
      />
      <Route
        path='/history'
        element={
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
          >
            <History />
          </motion.div>
        }
      />
    </Routes>
  );
};

export default RoutesWrapper;

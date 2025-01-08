import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BalanceCard from './components/BalanceCard';
import ButtonContainer from './components/ButtonContainer';
import FilterContainer from './components/FilterContainer';
import TransactionLists from './components/TransactionLists';
import Navbar from './components/Navbar';
import IndexedDBService from './service';
import './App.css';
import History from './pages/History';
import { Action } from './types/transactions';
import { DialogProvider } from './context/DialogContext';

const App = () => {
  const [balance, setBalance] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [notifications, setNotifications] = useState<Action[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('Show All');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setFilter(filter);
  };

  const handleTransactionAdded = () => {
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await IndexedDBService.getBalance();
        if (response) {
          setBalance(response.balance);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchActions = async () => {
      const actions = await IndexedDBService.getAllActions();
      setNotifications(actions);
    };

    fetchActions();
  }, []);

  return (
    <DialogProvider>
      <Router>
        <div className='max-w-[413px] mx-auto bg-white min-h-screen'>
          <Navbar notifications={notifications} />
          <AnimatePresence>
            <Routes>
              <Route
                path='/'
                element={
                  <>
                    <BalanceCard
                      balance={balance}
                      setBalance={setBalance}
                      setNotifications={setNotifications}
                      notifications={notifications}
                    />
                    <ButtonContainer
                      setBalance={setBalance}
                      onTransactionAdded={handleTransactionAdded}
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
                  </>
                }
              />
              <Route path='/history' element={<History />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </DialogProvider>
  );
};

export default App;

import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { Action } from './types/transactions';
import { DialogProvider } from './context/DialogContext';

import Navbar from './components/Navbar';

import IndexedDBService from './service';
import RoutesWrapper from './RoutesWrapper';

import './App.css';

const App = () => {
  const [balance, setBalance] = useState(0);
  const [surplus, setSurplus] = useState(0);
  const [payDayDate, setPayDayDate] = useState(
    localStorage.getItem('payDayDate')
      ? parseInt(localStorage.getItem('payDayDate') as string)
      : 0,
  );
  const [refresh, setRefresh] = useState(false);
  const [notifications, setNotifications] = useState<Action[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('Show All');
  const [, setWorkingDaysRemaining] = useState<number>(0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setFilter(filter);
  };

  const handleTransactionAdded = () => {
    setRefresh((prev) => !prev);
  };

  const getDailyAmount = useCallback(async () => {
    const response = await IndexedDBService.getAllExpenses();
    const amounts = response.map((expense) => expense.amount);
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

    return totalAmount;
  }, []);

  const calculateSurplus = async () => {
    const dailyAmount = await getDailyAmount();
    const workingDaysRemaining = Number(
      sessionStorage.getItem('workingDaysRemaining'),
    );

    if (isNaN(workingDaysRemaining)) {
      console.error('workingDaysRemaining is not a number');
      return;
    }

    const surplus = balance - dailyAmount * workingDaysRemaining;
    setSurplus(surplus);
  };

  const calculateWorkingDaysRemaining = () => {
    const today = new Date();
    let endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      payDayDate,
    );

    if (today > endOfMonth) {
      endOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        payDayDate,
      );
    }

    let count = 0;
    for (let d = new Date(today); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
    }
    return count;
  };

  const setWorkingDaysInSession = () => {
    const days = calculateWorkingDaysRemaining();
    sessionStorage.setItem('workingDaysRemaining', days.toString());
    setWorkingDaysRemaining(days);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balanceResponse = await IndexedDBService.getBalance();
        if (balanceResponse) {
          setBalance(balanceResponse.balance);
        }
        const actions = await IndexedDBService.getAllActions();
        setNotifications(actions);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
    setWorkingDaysInSession();
  }, [payDayDate]);

  useEffect(() => {
    calculateSurplus();
  }, [balance, refresh, payDayDate]);

  const handleExpenseDelete = () => {
    calculateSurplus();
  };

  return (
    <DialogProvider>
      <Router>
        <div className='max-w-[600px] mx-auto bg-white min-h-screen'>
          <Navbar
            setNotifications={setNotifications}
            notifications={notifications}
            balance={balance}
            surplus={surplus}
          />
          <AnimatePresence mode='wait'>
            <RoutesWrapper
              balance={balance}
              setBalance={setBalance}
              surplus={surplus}
              setSurplus={setSurplus}
              setNotifications={setNotifications}
              notifications={notifications}
              refresh={refresh}
              handleTransactionAdded={handleTransactionAdded}
              handleExpenseDelete={handleExpenseDelete}
              handleSearch={handleSearch}
              handleFilterChange={handleFilterChange}
              searchQuery={searchQuery}
              filter={filter}
              payDayDate={payDayDate}
              setPayDayDate={setPayDayDate}
            />
          </AnimatePresence>
        </div>
      </Router>
    </DialogProvider>
  );
};

export default App;

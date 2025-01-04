import './App.css';
import BalanceCard from './components/BalanceCard';
import ButtonContainer from './components/ButtonContainer';
import FilterContainer from './components/FilterContainer';
import TransactionLists from './components/TransactionLists';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className='max-w-[393px] mx-auto bg-white min-h-screen'>
      <Navbar />
      <BalanceCard />
      <ButtonContainer />
      <h1 className='text-xl font-bold pt-[20px] pb-[15px] text-center text-[#17A364] border-[#17A364] border-t border-dashed'>
        History
      </h1>
      <FilterContainer />
      <TransactionLists />
    </div>
  );
}

export default App;

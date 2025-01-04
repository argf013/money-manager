const transactions = [
  {
    transactionName: 'Buy a book',
    date: '2019-01-01',
    transactionAmount: 10000,
  },
  {
    transactionName: 'Buy a pen',
    date: '2019-01-02',
    transactionAmount: 20000,
  },
  {
    transactionName: 'Buy a pencil',
    date: '2019-01-03',
    transactionAmount: 30000,
  },
];

const TransactionLists = () => {
  return (
    <div className='flex flex-col'>
      {transactions.map((transaction, index) => (
        <div
          key={index}
          className='flex flex-row justify-between items-center px-[20px] py-[15px] border-b border-[#E0E0E0] hover:bg-slate-200 transition duration-100'
        >
          <span className='font-bold'>{transaction.transactionName}</span>
          <div className='flex flex-col gap-[10px] text-right'>
            <span className='text-sm text-[#C04D4D] font-bold'>
              {' '}
              -Rp. {transaction.transactionAmount.toLocaleString()}
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

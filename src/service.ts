import { openDB, IDBPDatabase } from 'idb';
import {
  Transaction,
  Balance,
  Action,
  DailyExpense,
  Income,
} from './types/transactions';

const DB_NAME = 'money-manager-db';
const DB_VERSION = 2;
const TRANSACTION_STORE = 'transactions';
const ACTION_STORE = 'actions';
const EXPENSE_STORE = 'dailyExpenses';
const BALANCE_STORE = 'balance';

const dbPromise: Promise<IDBPDatabase<unknown>> = openDB(DB_NAME, DB_VERSION, {
  upgrade(db: IDBPDatabase<unknown>, oldVersion) {
    if (oldVersion < 1) {
      db.createObjectStore(TRANSACTION_STORE, {
        keyPath: 'transactionId',
        autoIncrement: true,
      });
      db.createObjectStore(ACTION_STORE, {
        keyPath: 'actionId',
        autoIncrement: true,
      });
      db.createObjectStore(EXPENSE_STORE, {
        keyPath: 'expenseId',
        autoIncrement: true,
      });
    }
    if (oldVersion < 2) {
      db.createObjectStore(BALANCE_STORE, { keyPath: 'id' });
    }
  },
});

const IndexedDBService = {
  addTransaction(transaction: Transaction): Promise<void> {
    return dbPromise
      .then((db: IDBPDatabase<unknown>) => {
        const tx = db.transaction(BALANCE_STORE, 'readonly');
        const store = tx.objectStore(BALANCE_STORE);
        return store.get('balance') as Promise<Balance | undefined>;
      })
      .then((currentBalance) => {
        const oldBalance = currentBalance ? currentBalance.balance : 0;
        const newBalance = oldBalance - transaction.transactionAmount;

        return dbPromise
          .then((db: IDBPDatabase<unknown>) => {
            const tx = db.transaction(BALANCE_STORE, 'readwrite');
            const store = tx.objectStore(BALANCE_STORE);
            store.put({
              id: 'balance',
              balance: newBalance,
              detail: 'Transaction added',
            });
            return tx.done;
          })
          .then(() => {
            return dbPromise.then((db: IDBPDatabase<unknown>) => {
              const tx = db.transaction(TRANSACTION_STORE, 'readwrite');
              const store = tx.objectStore(TRANSACTION_STORE);
              store.add(transaction);
              return tx.done;
            });
          });
      });
  },

  addAction(action: Action): Promise<void> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(ACTION_STORE, 'readwrite');
      const store = tx.objectStore(ACTION_STORE);
      store.add(action);
      return tx.done;
    });
  },

  addExpense(expense: DailyExpense): Promise<void> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(EXPENSE_STORE, 'readwrite');
      const store = tx.objectStore(EXPENSE_STORE);
      store.add(expense);
      return tx.done;
    });
  },

  addIncome(income: Income): Promise<void> {
    return dbPromise
      .then((db: IDBPDatabase<unknown>) => {
        const tx = db.transaction(BALANCE_STORE, 'readonly');
        const store = tx.objectStore(BALANCE_STORE);
        return store.get('balance') as Promise<Balance | undefined>;
      })
      .then((currentBalance) => {
        const oldBalance = currentBalance ? currentBalance.balance : 0;
        const newBalance = oldBalance + income.transactionAmount;

        return dbPromise
          .then((db: IDBPDatabase<unknown>) => {
            const tx = db.transaction(BALANCE_STORE, 'readwrite');
            const store = tx.objectStore(BALANCE_STORE);
            store.put({
              id: 'balance',
              balance: newBalance,
              detail: 'Income added',
            });
            return tx.done;
          })
          .then(() => {
            return dbPromise.then((db: IDBPDatabase<unknown>) => {
              const tx = db.transaction(TRANSACTION_STORE, 'readwrite');
              const store = tx.objectStore(TRANSACTION_STORE);
              store.add(income);
              return tx.done;
            });
          });
      });
  },

  getTransaction(id: number): Promise<Transaction | undefined> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(TRANSACTION_STORE, 'readonly');
      const store = tx.objectStore(TRANSACTION_STORE);
      return store.get(id) as Promise<Transaction | undefined>;
    });
  },

  getAction(id: number): Promise<Action | undefined> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(ACTION_STORE, 'readonly');
      const store = tx.objectStore(ACTION_STORE);
      return store.get(id) as Promise<Action | undefined>;
    });
  },

  getExpense(id: number): Promise<DailyExpense | undefined> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(EXPENSE_STORE, 'readonly');
      const store = tx.objectStore(EXPENSE_STORE);
      return store.get(id) as Promise<DailyExpense | undefined>;
    });
  },

  getAllTransactions(): Promise<Transaction[]> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(TRANSACTION_STORE, 'readonly');
      const store = tx.objectStore(TRANSACTION_STORE);
      return store.getAll() as Promise<Transaction[]>;
    });
  },

  getAllActions(): Promise<Action[]> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(ACTION_STORE, 'readonly');
      const store = tx.objectStore(ACTION_STORE);
      return store.getAll() as Promise<Action[]>;
    });
  },

  getAllExpenses(): Promise<DailyExpense[]> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(EXPENSE_STORE, 'readonly');
      const store = tx.objectStore(EXPENSE_STORE);
      return store.getAll() as Promise<DailyExpense[]>;
    });
  },

  deleteTransaction(id: number): Promise<void> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(TRANSACTION_STORE, 'readwrite');
      const store = tx.objectStore(TRANSACTION_STORE);
      store.delete(id);
      return tx.done;
    });
  },

  deleteAllActions(): Promise<void> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(ACTION_STORE, 'readwrite');
      const store = tx.objectStore(ACTION_STORE);
      store.clear();
      return tx.done;
    });
  },

  deleteExpense(id: number): Promise<void> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(EXPENSE_STORE, 'readwrite');
      const store = tx.objectStore(EXPENSE_STORE);
      store.delete(id);
      return tx.done;
    });
  },

  getBalance(): Promise<Balance | undefined> {
    return dbPromise.then((db: IDBPDatabase<unknown>) => {
      const tx = db.transaction(BALANCE_STORE, 'readonly');
      const store = tx.objectStore(BALANCE_STORE);
      return store.get('balance') as Promise<Balance | undefined>;
    });
  },

  editBalance(newBalance: number, detail: string): Promise<void> {
    const formatRupiah = (value: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(value);
    };

    return dbPromise
      .then((db: IDBPDatabase<unknown>) => {
        const tx = db.transaction(BALANCE_STORE, 'readonly');
        const store = tx.objectStore(BALANCE_STORE);
        return store.get('balance') as Promise<Balance | undefined>;
      })
      .then((currentBalance) => {
        const oldBalance = currentBalance ? currentBalance.balance : 0;
        return dbPromise
          .then((db: IDBPDatabase<unknown>) => {
            const tx = db.transaction(BALANCE_STORE, 'readwrite');
            const store = tx.objectStore(BALANCE_STORE);
            store.put({ id: 'balance', balance: newBalance, detail: detail });
            return tx.done;
          })
          .then(() => {
            const action: Action = {
              actionId: Date.now(),
              date: new Date().toISOString(),
              detail: detail,
              action: 'Balance Updated',
              from: formatRupiah(oldBalance),
              to: formatRupiah(newBalance),
            };
            return this.addAction(action);
          });
      });
  },
};

export default IndexedDBService;

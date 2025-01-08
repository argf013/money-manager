export interface Action {
  actionId: number;
  date: string;
  action: string;
  detail: string;
  from: string;
  to: string;
}

export interface Transaction {
  transactionId: number;
  transactionName: string;
  date: string;
  transactionAmount: number;
  category: string;
  type: 'expense' | 'income';
}

export interface Income {
  transactionId: number;
  transactionName: string;
  date: string;
  transactionAmount: number;
  category: string;
  type: 'income';
}

export interface Action {
  actionId: number;
  date: string;
  action: string;
  detail: string;
  from: string;
  to: string;
}

export interface DailyExpense {
  expenseId: number;
  name: string;
  category: string;
  time: string;
  amount: number;
}

export interface Balance {
  id: string;
  balance: number;
  detail: string;
}
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

export interface ExpenseFilter {
  category?: ExpenseCategory | 'All';
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface ExpenseSummary {
  totalAmount: number;
  monthlyAmount: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  expenseCount: number;
  averageExpense: number;
}

export interface FormErrors {
  amount?: string;
  description?: string;
  category?: string;
  date?: string;
}
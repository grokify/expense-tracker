import { Expense, ExpenseCategory, ExpenseSummary, ExpenseFilter } from '@/types/expense';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const filterExpenses = (expenses: Expense[], filter: ExpenseFilter): Expense[] => {
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    
    // Category filter
    if (filter.category && filter.category !== 'All' && expense.category !== filter.category) {
      return false;
    }
    
    // Date range filter
    if (filter.startDate && filter.endDate) {
      const startDate = parseISO(filter.startDate);
      const endDate = parseISO(filter.endDate);
      if (!isWithinInterval(expenseDate, { start: startDate, end: endDate })) {
        return false;
      }
    }
    
    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      const matchesDescription = expense.description.toLowerCase().includes(searchLower);
      const matchesCategory = expense.category.toLowerCase().includes(searchLower);
      const matchesAmount = expense.amount.toString().includes(filter.searchTerm);
      
      if (!matchesDescription && !matchesCategory && !matchesAmount) {
        return false;
      }
    }
    
    return true;
  });
};

export const calculateExpenseSummary = (expenses: Expense[]): ExpenseSummary => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });
  
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyAmount = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryBreakdown: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0
  };
  
  expenses.forEach(expense => {
    categoryBreakdown[expense.category] += expense.amount;
  });
  
  return {
    totalAmount,
    monthlyAmount,
    categoryBreakdown,
    expenseCount: expenses.length,
    averageExpense: expenses.length > 0 ? totalAmount / expenses.length : 0
  };
};

export const validateExpenseForm = (data: Partial<Expense>) => {
  const errors: Record<string, string> = {};
  
  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  }
  
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  if (!data.date) {
    errors.date = 'Date is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Description', 'Category', 'Amount'];
  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      expense.date,
      `"${expense.description}"`,
      expense.category,
      expense.amount.toString()
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (expenses: Expense[], filename: string = 'expenses.csv'): void => {
  const csvContent = exportToCSV(expenses);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
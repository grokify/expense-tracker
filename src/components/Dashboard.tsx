'use client';

import { useMemo } from 'react';
import { Expense, ExpenseSummary } from '@/types/expense';
import { calculateExpenseSummary, formatCurrency } from '@/utils/expense';
import { DollarSign, TrendingUp, Calendar, BarChart } from 'lucide-react';

interface DashboardProps {
  expenses: Expense[];
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  description?: string;
}

const SummaryCard = ({ title, value, icon, trend, description }: SummaryCardProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        {trend && (
          <p className="text-sm text-gray-500 mt-1">{trend}</p>
        )}
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

interface CategoryBreakdownProps {
  categoryBreakdown: Record<string, number>;
  totalAmount: number;
}

const CategoryBreakdown = ({ categoryBreakdown, totalAmount }: CategoryBreakdownProps) => {
  const sortedCategories = Object.entries(categoryBreakdown)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a);

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  if (sortedCategories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h3>
        <p className="text-gray-500 text-center py-8">No expenses to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h3>
      <div className="space-y-4">
        {sortedCategories.map(([category, amount], index) => {
          const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
          return (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(index)}`} />
                <span className="text-sm font-medium text-gray-900">{category}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 max-w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getCategoryColor(index)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">
                  {formatCurrency(amount)}
                </span>
                <span className="text-xs text-gray-400 w-10 text-right">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface RecentExpensesProps {
  expenses: Expense[];
}

const RecentExpenses = ({ expenses }: RecentExpensesProps) => {
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: 'bg-green-100 text-green-800',
      Transportation: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Bills: 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h3>
      {recentExpenses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent expenses</p>
      ) : (
        <div className="space-y-3">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Dashboard({ expenses }: DashboardProps) {
  const summary: ExpenseSummary = useMemo(() => {
    return calculateExpenseSummary(expenses);
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your expense tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary.totalAmount)}
          icon={<DollarSign className="w-6 h-6" />}
          description={`${summary.expenseCount} transactions`}
        />
        <SummaryCard
          title="This Month"
          value={formatCurrency(summary.monthlyAmount)}
          icon={<Calendar className="w-6 h-6" />}
          description="Current month spending"
        />
        <SummaryCard
          title="Average Expense"
          value={formatCurrency(summary.averageExpense)}
          icon={<TrendingUp className="w-6 h-6" />}
          description="Per transaction"
        />
        <SummaryCard
          title="Categories"
          value={Object.values(summary.categoryBreakdown).filter(amount => amount > 0).length.toString()}
          icon={<BarChart className="w-6 h-6" />}
          description="With expenses"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown 
          categoryBreakdown={summary.categoryBreakdown}
          totalAmount={summary.totalAmount}
        />
        <RecentExpenses expenses={expenses} />
      </div>
    </div>
  );
}
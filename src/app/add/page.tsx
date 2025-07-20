'use client';

import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ExpenseForm from '@/components/ExpenseForm';
import { Expense } from '@/types/expense';

export default function AddExpensePage() {
  const router = useRouter();

  const handleSubmit = (_expense: Expense) => {
    router.push('/expenses');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
          <p className="text-gray-600">Track your spending by adding a new expense</p>
        </div>
        <ExpenseForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
}
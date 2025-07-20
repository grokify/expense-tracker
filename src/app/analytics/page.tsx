'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Analytics from '@/components/Analytics';
import { Expense } from '@/types/expense';
import { storageUtils } from '@/utils/storage';

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = () => {
      const savedExpenses = storageUtils.getExpenses();
      setExpenses(savedExpenses);
      setIsLoading(false);
    };

    loadExpenses();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Analytics expenses={expenses} />
    </Layout>
  );
}
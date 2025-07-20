import { Expense } from '@/types/expense';
import { ExportOptions, ExportProgress, ExportPreview } from '@/types/export';
import { formatCurrency, formatDate } from './expense';

export const generateExportPreview = (
  expenses: Expense[], 
  options: Partial<ExportOptions>
): ExportPreview => {
  const filteredExpenses = filterExportData(expenses, options);
  
  const dateRangeText = options.dateRange?.startDate && options.dateRange?.endDate
    ? `${formatDate(options.dateRange.startDate)} - ${formatDate(options.dateRange.endDate)}`
    : 'All dates';
    
  const estimatedSize = estimateFileSize(filteredExpenses, options.format || 'csv');
  
  return {
    totalRecords: filteredExpenses.length,
    dateRange: dateRangeText,
    categories: options.selectedCategories || [],
    estimatedFileSize: estimatedSize,
    filename: options.filename || generateDefaultFilename(options.format || 'csv')
  };
};

export const filterExportData = (
  expenses: Expense[], 
  options: Partial<ExportOptions>
): Expense[] => {
  return expenses.filter(expense => {
    // Date range filter
    if (options.dateRange?.startDate && options.dateRange?.endDate) {
      const expenseDate = new Date(expense.date);
      const startDate = new Date(options.dateRange.startDate);
      const endDate = new Date(options.dateRange.endDate);
      
      if (expenseDate < startDate || expenseDate > endDate) {
        return false;
      }
    }
    
    // Category filter
    if (!options.includeAllCategories && options.selectedCategories?.length) {
      if (!options.selectedCategories.includes(expense.category)) {
        return false;
      }
    }
    
    return true;
  });
};

export const generateDefaultFilename = (format: string): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `expenses-export-${timestamp}.${format}`;
};

export const estimateFileSize = (expenses: Expense[], format: string): string => {
  const avgRecordSize = format === 'csv' ? 80 : format === 'json' ? 200 : 500;
  const estimatedBytes = expenses.length * avgRecordSize;
  
  if (estimatedBytes < 1024) return `${estimatedBytes} B`;
  if (estimatedBytes < 1024 * 1024) return `${(estimatedBytes / 1024).toFixed(1)} KB`;
  return `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const validateExportOptions = (options: Partial<ExportOptions>): string[] => {
  const errors: string[] = [];
  
  if (!options.filename?.trim()) {
    errors.push('Filename is required');
  } else if (!/^[a-zA-Z0-9._-]+$/.test(options.filename.replace(/\.(csv|json|pdf)$/, ''))) {
    errors.push('Filename contains invalid characters');
  }
  
  if (options.dateRange?.startDate && options.dateRange?.endDate) {
    const startDate = new Date(options.dateRange.startDate);
    const endDate = new Date(options.dateRange.endDate);
    
    if (startDate > endDate) {
      errors.push('Start date must be before end date');
    }
  }
  
  if (!options.includeAllCategories && (!options.selectedCategories || options.selectedCategories.length === 0)) {
    errors.push('Please select at least one category or include all categories');
  }
  
  return errors;
};

export const exportToAdvancedCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Created At', 'Updated At'];
  const rows = expenses.map(expense => [
    expense.date,
    `"${expense.description.replace(/"/g, '""')}"`,
    expense.category,
    expense.amount.toString(),
    expense.createdAt,
    expense.updatedAt
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

export const exportToJSON = (expenses: Expense[]): string => {
  const exportData = {
    exportedAt: new Date().toISOString(),
    totalRecords: expenses.length,
    data: expenses.map(expense => ({
      id: expense.id,
      date: expense.date,
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
};

export const exportToPDF = async (expenses: Expense[]): Promise<Blob> => {
  const pdf = generatePDFContent(expenses);
  return new Blob([pdf], { type: 'application/pdf' });
};

const generatePDFContent = (expenses: Expense[]): string => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const content = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

5 0 obj
<<
/Length 1000
>>
stream
BT
/F1 12 Tf
50 750 Td
(Expense Report) Tj
0 -20 Td
(Generated: ${new Date().toLocaleDateString()}) Tj
0 -30 Td
(Total Expenses: ${formatCurrency(totalAmount)}) Tj
0 -20 Td
(Total Records: ${expenses.length}) Tj
0 -40 Td
(--- Expense Details ---) Tj
${expenses.slice(0, 20).map((expense) => 
  `0 -15 Td (${expense.date} - ${expense.description.slice(0, 30)} - ${expense.category} - ${formatCurrency(expense.amount)}) Tj`
).join('\n')}
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000365 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
1500
%%EOF`;

  return content;
};

export const downloadFile = (content: string | Blob, filename: string, mimeType: string): void => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const simulateExportProgress = (
  onProgress: (progress: ExportProgress) => void
): Promise<void> => {
  return new Promise((resolve) => {
    const steps = [
      { step: 'preparing', progress: 0, message: 'Preparing export...' },
      { step: 'filtering', progress: 25, message: 'Filtering data...' },
      { step: 'formatting', progress: 50, message: 'Formatting data...' },
      { step: 'generating', progress: 75, message: 'Generating file...' },
      { step: 'complete', progress: 100, message: 'Export complete!' }
    ] as ExportProgress[];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        onProgress(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });
};
export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  selectedCategories: string[];
  includeAllCategories: boolean;
}

export interface ExportPreview {
  totalRecords: number;
  dateRange: string;
  categories: string[];
  estimatedFileSize: string;
  filename: string;
}

export interface ExportProgress {
  step: 'preparing' | 'filtering' | 'formatting' | 'generating' | 'complete';
  progress: number;
  message: string;
}

export const EXPORT_FORMATS: { value: ExportFormat; label: string; description: string }[] = [
  {
    value: 'csv',
    label: 'CSV',
    description: 'Comma-separated values for spreadsheet applications'
  },
  {
    value: 'json',
    label: 'JSON', 
    description: 'JavaScript Object Notation for data interchange'
  },
  {
    value: 'pdf',
    label: 'PDF',
    description: 'Portable Document Format for reports and documentation'
  }
];
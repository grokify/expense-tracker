'use client';

import { useState, useEffect, useMemo } from 'react';
import { Expense, EXPENSE_CATEGORIES } from '@/types/expense';
import { ExportOptions, ExportProgress, ExportPreview, EXPORT_FORMATS } from '@/types/export';
import { 
  generateExportPreview, 
  filterExportData, 
  validateExportOptions,
  generateDefaultFilename,
  exportToAdvancedCSV,
  exportToJSON,
  exportToPDF,
  downloadFile,
  simulateExportProgress
} from '@/utils/exportAdvanced';
import { 
  X, 
  Download, 
  FileText, 
  Eye, 
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

type ModalStep = 'configure' | 'preview' | 'export';

export default function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>('configure');
  const [exportOptions, setExportOptions] = useState<Partial<ExportOptions>>({
    format: 'csv',
    filename: generateDefaultFilename('csv'),
    dateRange: {
      startDate: '',
      endDate: ''
    },
    selectedCategories: [],
    includeAllCategories: true
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const preview = useMemo(() => {
    if (currentStep === 'preview' || currentStep === 'export') {
      return generateExportPreview(expenses, exportOptions);
    }
    return null;
  }, [expenses, exportOptions, currentStep]);

  const filteredExpenses = useMemo(() => {
    return filterExportData(expenses, exportOptions);
  }, [expenses, exportOptions]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('configure');
      setExportProgress(null);
      setIsExporting(false);
      setValidationErrors([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (exportOptions.format) {
      setExportOptions(prev => ({
        ...prev,
        filename: generateDefaultFilename(exportOptions.format!)
      }));
    }
  }, [exportOptions.format]);

  const handleNext = () => {
    const errors = validateExportOptions(exportOptions);
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      if (currentStep === 'configure') {
        setCurrentStep('preview');
      } else if (currentStep === 'preview') {
        setCurrentStep('export');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'preview') {
      setCurrentStep('configure');
    } else if (currentStep === 'export') {
      setCurrentStep('preview');
    }
  };

  const handleExport = async () => {
    if (!exportOptions.format || isExporting) return;
    
    setIsExporting(true);
    
    try {
      await simulateExportProgress(setExportProgress);
      
      const dataToExport = filterExportData(expenses, exportOptions);
      let content: string | Blob;
      let mimeType: string;
      
      switch (exportOptions.format) {
        case 'csv':
          content = exportToAdvancedCSV(dataToExport);
          mimeType = 'text/csv';
          break;
        case 'json':
          content = exportToJSON(dataToExport);
          mimeType = 'application/json';
          break;
        case 'pdf':
          content = await exportToPDF(dataToExport);
          mimeType = 'application/pdf';
          break;
        default:
          throw new Error('Unsupported export format');
      }
      
      downloadFile(content, exportOptions.filename!, mimeType);
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportProgress({
        step: 'complete',
        progress: 100,
        message: 'Export failed. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const toggleCategory = (category: string) => {
    if (exportOptions.includeAllCategories) {
      setExportOptions(prev => ({
        ...prev,
        includeAllCategories: false,
        selectedCategories: [category]
      }));
    } else {
      setExportOptions(prev => ({
        ...prev,
        selectedCategories: prev.selectedCategories?.includes(category)
          ? prev.selectedCategories.filter(c => c !== category)
          : [...(prev.selectedCategories || []), category]
      }));
    }
  };

  const toggleAllCategories = () => {
    setExportOptions(prev => ({
      ...prev,
      includeAllCategories: !prev.includeAllCategories,
      selectedCategories: []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
              <p className="text-sm text-gray-500">
                {currentStep === 'configure' && 'Configure export settings'}
                {currentStep === 'preview' && 'Preview and verify your export'}
                {currentStep === 'export' && 'Generating your export file'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isExporting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[
              { step: 'configure', label: 'Configure', icon: Settings },
              { step: 'preview', label: 'Preview', icon: Eye },
              { step: 'export', label: 'Export', icon: Download }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep === step ? 'text-blue-600' : 
                  (index < ['configure', 'preview', 'export'].indexOf(currentStep)) ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step ? 'bg-blue-100' :
                    (index < ['configure', 'preview', 'export'].indexOf(currentStep)) ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {index < ['configure', 'preview', 'export'].indexOf(currentStep) ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    index < ['configure', 'preview', 'export'].indexOf(currentStep) ? 'bg-green-400' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {currentStep === 'configure' && (
            <ConfigureStep 
              exportOptions={exportOptions}
              setExportOptions={setExportOptions}
              validationErrors={validationErrors}
              toggleCategory={toggleCategory}
              toggleAllCategories={toggleAllCategories}
            />
          )}
          
          {currentStep === 'preview' && preview && (
            <PreviewStep 
              preview={preview}
              filteredExpenses={filteredExpenses}
              exportOptions={exportOptions}
            />
          )}
          
          {currentStep === 'export' && (
            <ExportStep 
              exportProgress={exportProgress}
              isExporting={isExporting}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 'configure' || isExporting}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {currentStep !== 'export' && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isExporting}
              >
                Cancel
              </button>
            )}
            
            {currentStep === 'configure' && (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            {currentStep === 'preview' && (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Export</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            {currentStep === 'export' && !isExporting && !exportProgress && (
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Configure Step Component
function ConfigureStep({ 
  exportOptions, 
  setExportOptions, 
  validationErrors, 
  toggleCategory, 
  toggleAllCategories 
}: {
  exportOptions: Partial<ExportOptions>;
  setExportOptions: (options: Partial<ExportOptions>) => void;
  validationErrors: string[];
  toggleCategory: (category: string) => void;
  toggleAllCategories: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
              <ul className="mt-2 text-sm text-red-700">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Export Format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EXPORT_FORMATS.map((format) => (
            <div
              key={format.value}
              onClick={() => setExportOptions({ ...exportOptions, format: format.value })}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                exportOptions.format === format.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">{format.label}</div>
                  <div className="text-xs text-gray-500">{format.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filename */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Filename</label>
        <input
          type="text"
          value={exportOptions.filename || ''}
          onChange={(e) => setExportOptions({ ...exportOptions, filename: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter filename..."
        />
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Date Range (Optional)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              value={exportOptions.dateRange?.startDate || ''}
              onChange={(e) => setExportOptions({
                ...exportOptions,
                dateRange: { ...exportOptions.dateRange!, startDate: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              value={exportOptions.dateRange?.endDate || ''}
              onChange={(e) => setExportOptions({
                ...exportOptions,
                dateRange: { ...exportOptions.dateRange!, endDate: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={exportOptions.includeAllCategories || false}
              onChange={toggleAllCategories}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 font-medium">Include all categories</span>
          </label>
          
          {!exportOptions.includeAllCategories && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {EXPENSE_CATEGORIES.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.selectedCategories?.includes(category) || false}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Preview Step Component
function PreviewStep({ 
  preview, 
  filteredExpenses, 
  exportOptions 
}: {
  preview: ExportPreview;
  filteredExpenses: Expense[];
  exportOptions: Partial<ExportOptions>;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Export Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-3">Export Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-blue-700 font-medium">Records</div>
            <div className="text-blue-900">{preview.totalRecords}</div>
          </div>
          <div>
            <div className="text-blue-700 font-medium">Date Range</div>
            <div className="text-blue-900">{preview.dateRange}</div>
          </div>
          <div>
            <div className="text-blue-700 font-medium">File Size</div>
            <div className="text-blue-900">{preview.estimatedFileSize}</div>
          </div>
          <div>
            <div className="text-blue-700 font-medium">Format</div>
            <div className="text-blue-900">{exportOptions.format?.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Data Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Data Preview (First 10 records)</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.slice(0, 10).map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{expense.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{expense.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(expense.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredExpenses.length > 10 && (
            <div className="bg-gray-50 px-4 py-3 text-sm text-gray-500 text-center">
              ... and {filteredExpenses.length - 10} more records
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export Step Component
function ExportStep({ 
  exportProgress, 
  isExporting 
}: {
  exportProgress: ExportProgress | null;
  isExporting: boolean;
}) {
  return (
    <div className="text-center space-y-6">
      {!isExporting && !exportProgress && (
        <div>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Export</h3>
          <p className="text-gray-600">Click the Download button to generate and download your export file.</p>
        </div>
      )}

      {exportProgress && (
        <div>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {exportProgress.step === 'complete' ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            )}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">{exportProgress.message}</h3>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress.progress}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600">{exportProgress.progress}% complete</p>
        </div>
      )}
    </div>
  );
}
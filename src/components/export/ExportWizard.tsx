'use client';

import { useState } from 'react';
import { Expense } from '@/types/expense';
import { 
  CloudExportConfig, 
  CloudConnection, 
  ExportTemplate, 
  ExportFormat, 
  DestinationType,
  SchedulePeriod 
} from '@/types/export';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mail, 
  FileSpreadsheet, 
  Cloud, 
  Calendar,
  Share2,
  Download,
  Zap,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface ExportWizardProps {
  expenses: Expense[];
  cloudConnections: CloudConnection[];
  onComplete: (config: CloudExportConfig) => void;
  onCancel: () => void;
}

type WizardStep = 'template' | 'destination' | 'schedule' | 'sharing' | 'review' | 'processing';

export default function ExportWizard({ expenses, cloudConnections, onComplete, onCancel }: ExportWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate>('monthly-summary');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('excel');
  const [selectedDestination, setSelectedDestination] = useState<DestinationType>('email');
  const [isRecurring, setIsRecurring] = useState(false);
  const [schedulePeriod, setSchedulePeriod] = useState<SchedulePeriod>('monthly');
  const [emailConfig, setEmailConfig] = useState({
    recipients: [''],
    subject: 'Monthly Expense Report',
    message: 'Please find your expense report attached.',
    format: 'excel' as ExportFormat
  });
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    allowDownload: true,
    expiresAt: ''
  });

  const templates = [
    {
      id: 'tax-report' as ExportTemplate,
      name: 'Tax Report',
      description: 'Detailed report optimized for tax filing with category breakdowns',
      icon: '📊',
      popular: true
    },
    {
      id: 'monthly-summary' as ExportTemplate,
      name: 'Monthly Summary',
      description: 'Comprehensive monthly overview with trends and insights',
      icon: '📅',
      popular: true
    },
    {
      id: 'category-analysis' as ExportTemplate,
      name: 'Category Analysis',
      description: 'Deep dive into spending patterns by category',
      icon: '🎯',
      popular: false
    },
    {
      id: 'quarterly-review' as ExportTemplate,
      name: 'Quarterly Review',
      description: 'Business-ready quarterly expense analysis',
      icon: '📈',
      popular: false
    },
    {
      id: 'expense-receipts' as ExportTemplate,
      name: 'Receipt Archive',
      description: 'Complete expense list with receipt references',
      icon: '🧾',
      popular: false
    },
    {
      id: 'budget-comparison' as ExportTemplate,
      name: 'Budget vs Actual',
      description: 'Compare your spending against budget targets',
      icon: '⚖️',
      popular: true
    }
  ];

  const destinations = [
    {
      id: 'email' as DestinationType,
      name: 'Email',
      description: 'Send directly to your inbox',
      icon: Mail,
      color: 'blue',
      available: true
    },
    {
      id: 'google-sheets' as DestinationType,
      name: 'Google Sheets',
      description: 'Live spreadsheet integration',
      icon: FileSpreadsheet,
      color: 'green',
      available: cloudConnections.some(c => c.provider === 'google-sheets' && c.isConnected)
    },
    {
      id: 'dropbox' as DestinationType,
      name: 'Dropbox',
      description: 'Save to your Dropbox account',
      icon: Cloud,
      color: 'indigo',
      available: cloudConnections.some(c => c.provider === 'dropbox' && c.isConnected)
    },
    {
      id: 'onedrive' as DestinationType,
      name: 'OneDrive',
      description: 'Microsoft cloud storage',
      icon: Cloud,
      color: 'blue',
      available: cloudConnections.some(c => c.provider === 'onedrive' && c.isConnected)
    }
  ];

  const handleNext = () => {
    const steps: WizardStep[] = ['template', 'destination', 'schedule', 'sharing', 'review', 'processing'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: WizardStep[] = ['template', 'destination', 'schedule', 'sharing', 'review', 'processing'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = () => {
    const config: CloudExportConfig = {
      id: Date.now().toString(),
      name: `${templates.find(t => t.id === selectedTemplate)?.name} Export`,
      templateType: selectedTemplate,
      schedulePeriod: isRecurring ? schedulePeriod : undefined,
      isRecurring,
      createdAt: new Date().toISOString(),
      status: 'pending',
      destination: {
        type: selectedDestination,
        config: {
          email: selectedDestination === 'email' ? emailConfig : undefined
        },
        syncStatus: 'connected'
      },
      shareSettings: {
        isPublic: shareSettings.isPublic,
        allowDownload: shareSettings.allowDownload,
        allowComments: false,
        analytics: true,
        expiresAt: shareSettings.expiresAt || undefined
      }
    };

    // Simulate processing
    setCurrentStep('processing');
    setTimeout(() => {
      onComplete(config);
    }, 2000);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'template', label: 'Template' },
      { id: 'destination', label: 'Destination' },
      { id: 'schedule', label: 'Schedule' },
      { id: 'sharing', label: 'Sharing' },
      { id: 'review', label: 'Review' }
    ];

    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentIndex 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index < currentIndex ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              index <= currentIndex ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTemplateStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Export Template</h2>
        <p className="text-gray-600">Select a pre-configured template optimized for your use case</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <span className="text-2xl">{template.icon}</span>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  {template.popular && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">AI-Powered Insights</h4>
            <p className="text-sm text-blue-700 mt-1">
              Each template includes smart categorization and trend analysis powered by machine learning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDestinationStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select Destination</h2>
        <p className="text-gray-600">Choose where to send your exported data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {destinations.map((dest) => {
          const Icon = dest.icon;
          return (
            <div
              key={dest.id}
              onClick={() => dest.available && setSelectedDestination(dest.id)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDestination === dest.id
                  ? 'border-blue-500 bg-blue-50'
                  : dest.available
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg bg-${dest.color}-100`}>
                  <Icon className={`w-6 h-6 text-${dest.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-medium ${dest.available ? 'text-gray-900' : 'text-gray-400'}`}>
                      {dest.name}
                    </h3>
                    {!dest.available && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        Connect Required
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${dest.available ? 'text-gray-600' : 'text-gray-400'}`}>
                    {dest.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDestination === 'email' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Email Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
              <input
                type="email"
                value={emailConfig.recipients[0]}
                onChange={(e) => setEmailConfig({
                  ...emailConfig,
                  recipients: [e.target.value]
                })}
                placeholder="email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={emailConfig.subject}
                onChange={(e) => setEmailConfig({
                  ...emailConfig,
                  subject: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderScheduleStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Schedule & Automation</h2>
        <p className="text-gray-600">Set up automatic exports to keep your data synchronized</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="checkbox"
            id="recurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="recurring" className="text-sm font-medium text-gray-900">
            Enable automatic recurring exports
          </label>
        </div>

        {isRecurring && (
          <div className="ml-7 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={schedulePeriod}
                onChange={(e) => setSchedulePeriod(e.target.value as SchedulePeriod)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">Smart Scheduling</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    We&rsquo;ll automatically process and send your reports on the first day of each period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSharingStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sharing & Access</h2>
        <p className="text-gray-600">Configure how others can access your exported data</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="public"
            checked={shareSettings.isPublic}
            onChange={(e) => setShareSettings({
              ...shareSettings,
              isPublic: e.target.checked
            })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="public" className="text-sm font-medium text-gray-900">
            Generate shareable link
          </label>
        </div>

        {shareSettings.isPublic && (
          <div className="ml-7 space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="download"
                checked={shareSettings.allowDownload}
                onChange={(e) => setShareSettings({
                  ...shareSettings,
                  allowDownload: e.target.checked
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="download" className="text-sm font-medium text-gray-900">
                Allow downloads
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link expires (optional)
              </label>
              <input
                type="date"
                value={shareSettings.expiresAt}
                onChange={(e) => setShareSettings({
                  ...shareSettings,
                  expiresAt: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Confirm</h2>
        <p className="text-gray-600">Verify your export configuration before processing</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Template</h4>
            <p className="text-sm text-gray-600">
              {templates.find(t => t.id === selectedTemplate)?.name}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Destination</h4>
            <p className="text-sm text-gray-600">
              {destinations.find(d => d.id === selectedDestination)?.name}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Schedule</h4>
            <p className="text-sm text-gray-600">
              {isRecurring ? `Every ${schedulePeriod}` : 'One-time export'}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Data Range</h4>
            <p className="text-sm text-gray-600">
              {expenses.length} expenses
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-green-900">Ready to Export</h4>
            <p className="text-sm text-green-700 mt-1">
              Your export will be processed and delivered according to your configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-12">
      <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Export</h2>
      <p className="text-gray-600">Please wait while we prepare your data...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {currentStep !== 'processing' && renderStepIndicator()}

        {currentStep === 'template' && renderTemplateStep()}
        {currentStep === 'destination' && renderDestinationStep()}
        {currentStep === 'schedule' && renderScheduleStep()}
        {currentStep === 'sharing' && renderSharingStep()}
        {currentStep === 'review' && renderReviewStep()}
        {currentStep === 'processing' && renderProcessingStep()}

        {currentStep !== 'processing' && (
          <div className="flex justify-between mt-8">
            <button
              onClick={currentStep === 'template' ? onCancel : handleBack}
              className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentStep === 'template' ? 'Cancel' : 'Back'}</span>
            </button>

            <button
              onClick={currentStep === 'review' ? handleComplete : handleNext}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>{currentStep === 'review' ? 'Create Export' : 'Next'}</span>
              {currentStep !== 'review' && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
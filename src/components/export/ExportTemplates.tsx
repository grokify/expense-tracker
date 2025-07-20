'use client';

import { ExportTemplate } from '@/types/export';
import { 
  FileText, 
  Calculator, 
  TrendingUp, 
  PieChart, 
  Receipt, 
  BarChart3,
  Sparkles,
  Crown,
  Star
} from 'lucide-react';

interface ExportTemplatesProps {
  onSelectTemplate: (template: ExportTemplate) => void;
}

export default function ExportTemplates({ onSelectTemplate }: ExportTemplatesProps) {
  const templates = [
    {
      id: 'tax-report' as ExportTemplate,
      name: 'Tax Report',
      description: 'Comprehensive tax-ready report with categorized deductions and summaries',
      icon: Calculator,
      features: ['IRS compliant format', 'Category summaries', 'Deduction tracking', 'Date range filtering'],
      color: 'blue',
      popular: true,
      premium: false
    },
    {
      id: 'monthly-summary' as ExportTemplate,
      name: 'Monthly Summary',
      description: 'Executive dashboard with trends, insights, and key metrics',
      icon: BarChart3,
      features: ['Trend analysis', 'Visual charts', 'Spending insights', 'Budget comparison'],
      color: 'green',
      popular: true,
      premium: false
    },
    {
      id: 'category-analysis' as ExportTemplate,
      name: 'Category Deep Dive',
      description: 'Detailed breakdown of spending patterns across all categories',
      icon: PieChart,
      features: ['Category trends', 'Subcategory analysis', 'Spending heatmap', 'Anomaly detection'],
      color: 'purple',
      popular: false,
      premium: true
    },
    {
      id: 'quarterly-review' as ExportTemplate,
      name: 'Quarterly Business Report',
      description: 'Professional quarterly analysis for business expense reporting',
      icon: TrendingUp,
      features: ['Quarter-over-quarter', 'Business metrics', 'Department breakdown', 'ROI analysis'],
      color: 'indigo',
      popular: false,
      premium: true
    },
    {
      id: 'expense-receipts' as ExportTemplate,
      name: 'Receipt Archive',
      description: 'Complete expense documentation with receipt references and details',
      icon: Receipt,
      features: ['Receipt linking', 'Audit trail', 'Compliance ready', 'Digital signatures'],
      color: 'orange',
      popular: false,
      premium: false
    },
    {
      id: 'budget-comparison' as ExportTemplate,
      name: 'Budget vs Actual',
      description: 'Compare planned budgets against actual spending with variance analysis',
      icon: FileText,
      features: ['Variance analysis', 'Budget tracking', 'Forecast projection', 'Alert thresholds'],
      color: 'red',
      popular: true,
      premium: false
    }
  ];

  const sampleReports = [
    {
      name: 'Q4 2024 Tax Report',
      template: 'Tax Report',
      size: '2.3 MB',
      records: 247,
      preview: 'Sample showing categorized business expenses...'
    },
    {
      name: 'December Summary',
      template: 'Monthly Summary',
      size: '1.8 MB',
      records: 89,
      preview: 'Executive overview with spending trends...'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Export Templates</h2>
            <p className="text-green-100">Pre-configured templates optimized for different use cases</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Template Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-${template.color}-100`}>
                  <Icon className={`w-6 h-6 text-${template.color}-600`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    {template.popular && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>Popular</span>
                      </span>
                    )}
                    {template.premium && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <Crown className="w-3 h-3" />
                        <span>Premium</span>
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Key Features:</h4>
                    <ul className="grid grid-cols-2 gap-1">
                      {template.features.map((feature) => (
                        <li key={feature} className="text-xs text-gray-600 flex items-center space-x-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => onSelectTemplate(template.id)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors ${
                      template.premium
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Template Customization */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Template Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-1">Create Custom</h4>
            <p className="text-sm text-gray-600">Build your own template from scratch</p>
          </div>
          
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
            <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-1">Modify Existing</h4>
            <p className="text-sm text-gray-600">Customize an existing template</p>
          </div>
          
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
            <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-1">AI Generator</h4>
            <p className="text-sm text-gray-600">Let AI create a template for you</p>
          </div>
        </div>
      </div>

      {/* Sample Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sample Reports</h3>
        <div className="space-y-4">
          {sampleReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{report.template}</span>
                    <span>•</span>
                    <span>{report.records} records</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Preview
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Template Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{templates.length}</p>
          <p className="text-sm text-gray-600">Available Templates</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {templates.filter(t => t.popular).length}
          </p>
          <p className="text-sm text-gray-600">Popular Templates</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {templates.filter(t => t.premium).length}
          </p>
          <p className="text-sm text-gray-600">Premium Templates</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">∞</p>
          <p className="text-sm text-gray-600">Custom Options</p>
        </div>
      </div>
    </div>
  );
}
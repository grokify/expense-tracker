'use client';

import { ExportHistory, CloudExportConfig } from '@/types/export';
import { BarChart3, TrendingUp, Download, Users, Calendar, FileText } from 'lucide-react';

interface ExportAnalyticsProps {
  exportHistory: ExportHistory[];
  exportConfigs: CloudExportConfig[];
}

export default function ExportAnalytics({ exportHistory, exportConfigs }: ExportAnalyticsProps) {
  const mockData = {
    totalExports: 47,
    totalDownloads: 89,
    avgExportSize: 2.3,
    popularFormat: 'Excel',
    growthRate: 23
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Export Analytics</h2>
            <p className="text-orange-100">Insights into your data export patterns and usage</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <BarChart3 className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Exports</p>
              <p className="text-xl font-bold text-gray-900">{mockData.totalExports}</p>
            </div>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-xl font-bold text-gray-900">{mockData.totalDownloads}</p>
            </div>
            <Download className="w-5 h-5 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Size</p>
              <p className="text-xl font-bold text-gray-900">{mockData.avgExportSize} MB</p>
            </div>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth</p>
              <p className="text-xl font-bold text-gray-900">+{mockData.growthRate}%</p>
            </div>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Trends</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>
    </div>
  );
}
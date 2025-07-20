'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import { CloudExportConfig, ExportHistory, CloudConnection, ExportProgress } from '@/types/export';
import { 
  Cloud, 
  Download, 
  Share2, 
  Calendar, 
  History, 
  Settings, 
  Plus,
  Zap,
  BarChart3,
  Globe
} from 'lucide-react';
import ExportWizard from './export/ExportWizard';
import ExportHistoryComponent from './export/ExportHistory';
import CloudConnections from './export/CloudConnections';
import ExportTemplates from './export/ExportTemplates';
import ShareCenter from './export/ShareCenter';
import ExportAnalytics from './export/ExportAnalytics';
import ScheduledExports from './export/ScheduledExports';

interface CloudExportProps {
  expenses: Expense[];
}

type ExportView = 
  | 'overview'
  | 'new-export'
  | 'history'
  | 'connections'
  | 'templates'
  | 'sharing'
  | 'analytics'
  | 'scheduled';

export default function CloudExport({ expenses }: CloudExportProps) {
  const [activeView, setActiveView] = useState<ExportView>('overview');
  const [exportConfigs, setExportConfigs] = useState<CloudExportConfig[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [cloudConnections, setCloudConnections] = useState<CloudConnection[]>([]);
  const [activeExports, setActiveExports] = useState<ExportProgress[]>([]);

  useEffect(() => {
    loadExportData();
  }, []);

  const loadExportData = () => {
    // Load data from localStorage in a real app this would be from API
    const savedConfigs = localStorage.getItem('cloudExportConfigs');
    const savedHistory = localStorage.getItem('exportHistory');
    const savedConnections = localStorage.getItem('cloudConnections');
    
    if (savedConfigs) setExportConfigs(JSON.parse(savedConfigs));
    if (savedHistory) setExportHistory(JSON.parse(savedHistory));
    if (savedConnections) setCloudConnections(JSON.parse(savedConnections));
  };

  const saveExportData = () => {
    localStorage.setItem('cloudExportConfigs', JSON.stringify(exportConfigs));
    localStorage.setItem('exportHistory', JSON.stringify(exportHistory));
    localStorage.setItem('cloudConnections', JSON.stringify(cloudConnections));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Cloud },
    { id: 'new-export', label: 'New Export', icon: Plus },
    { id: 'history', label: 'History', icon: History },
    { id: 'connections', label: 'Connections', icon: Settings },
    { id: 'templates', label: 'Templates', icon: BarChart3 },
    { id: 'sharing', label: 'Sharing', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: Zap },
    { id: 'scheduled', label: 'Scheduled', icon: Calendar },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Cloud Export Hub</h2>
            <p className="text-blue-100">Export, share, and sync your expense data anywhere</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <Globe className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Exports</p>
              <p className="text-xl font-bold text-gray-900">{exportHistory.length}</p>
            </div>
            <Download className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Configs</p>
              <p className="text-xl font-bold text-gray-900">{exportConfigs.length}</p>
            </div>
            <Settings className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected Services</p>
              <p className="text-xl font-bold text-gray-900">
                {cloudConnections.filter(c => c.isConnected).length}
              </p>
            </div>
            <Cloud className="w-5 h-5 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-xl font-bold text-gray-900">{activeExports.length}</p>
            </div>
            <Zap className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Export Activity</h3>
        {exportHistory.length === 0 ? (
          <div className="text-center py-8">
            <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No exports yet</p>
            <button
              onClick={() => setActiveView('new-export')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Export
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {exportHistory.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.destination.type} export
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.exportedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{item.recordCount} records</p>
                  <p className="text-xs text-gray-500">{(item.fileSize / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveView('new-export')}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors text-left"
        >
          <Plus className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Quick Export</h3>
          <p className="text-sm text-gray-600">Export your data instantly to any destination</p>
        </button>

        <button
          onClick={() => setActiveView('connections')}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-green-300 transition-colors text-left"
        >
          <Settings className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Connect Services</h3>
          <p className="text-sm text-gray-600">Link your Google Drive, Dropbox, and more</p>
        </button>

        <button
          onClick={() => setActiveView('scheduled')}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-purple-300 transition-colors text-left"
        >
          <Calendar className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Automate Backups</h3>
          <p className="text-sm text-gray-600">Set up recurring exports and backups</p>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'new-export':
        return (
          <ExportWizard
            expenses={expenses}
            cloudConnections={cloudConnections}
            onComplete={(config) => {
              setExportConfigs([...exportConfigs, config]);
              setActiveView('history');
              saveExportData();
            }}
            onCancel={() => setActiveView('overview')}
          />
        );
      case 'history':
        return (
          <ExportHistoryComponent
            exportHistory={exportHistory}
            onViewDetails={(historyItem) => {
              // Handle view details
            }}
          />
        );
      case 'connections':
        return (
          <CloudConnections
            connections={cloudConnections}
            onUpdateConnections={setCloudConnections}
          />
        );
      case 'templates':
        return (
          <ExportTemplates
            onSelectTemplate={(template) => {
              setActiveView('new-export');
            }}
          />
        );
      case 'sharing':
        return (
          <ShareCenter
            exportHistory={exportHistory}
            onUpdateHistory={setExportHistory}
          />
        );
      case 'analytics':
        return (
          <ExportAnalytics
            exportHistory={exportHistory}
            exportConfigs={exportConfigs}
          />
        );
      case 'scheduled':
        return (
          <ScheduledExports
            configs={exportConfigs}
            onUpdateConfigs={setExportConfigs}
          />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ExportView)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
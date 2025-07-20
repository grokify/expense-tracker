'use client';

import { useState } from 'react';
import { ExportHistory } from '@/types/export';
import { 
  Share2, 
  Link, 
  QrCode, 
  Copy, 
  Eye, 
  Download, 
  Lock,
  Globe,
  Calendar,
  BarChart3,
  Users,
  Sparkles
} from 'lucide-react';

interface ShareCenterProps {
  exportHistory: ExportHistory[];
  onUpdateHistory: (history: ExportHistory[]) => void;
}

export default function ShareCenter({ exportHistory, onUpdateHistory }: ShareCenterProps) {
  const [selectedExport, setSelectedExport] = useState<string | null>(null);
  const [shareConfig, setShareConfig] = useState({
    isPublic: false,
    password: '',
    expiresAt: '',
    allowDownload: true,
    allowComments: false
  });

  const sharedExports = exportHistory.filter(e => e.shareUrl);

  const generateShareLink = (exportId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/shared/export/${exportId}`;
  };

  const generateQRCode = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const handleCreateShare = (exportId: string) => {
    const shareUrl = generateShareLink(exportId);
    const updatedHistory = exportHistory.map(item => 
      item.id === exportId 
        ? { ...item, shareUrl }
        : item
    );
    onUpdateHistory(updatedHistory);
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleShowQR = (url: string) => {
    const qrCodeUrl = generateQRCode(url);
    window.open(qrCodeUrl, '_blank');
  };

  const mockAnalytics = [
    { export: 'Tax Report Q4', views: 23, downloads: 8, shares: 3 },
    { export: 'Monthly Summary Dec', views: 15, downloads: 12, shares: 2 },
    { export: 'Category Analysis', views: 31, downloads: 5, shares: 7 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Share Center</h2>
            <p className="text-pink-100">Share your reports with secure links and QR codes</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <Share2 className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Share Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shared Reports</p>
              <p className="text-xl font-bold text-gray-900">{sharedExports.length}</p>
            </div>
            <Share2 className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-xl font-bold text-gray-900">
                {mockAnalytics.reduce((acc, item) => acc + item.views, 0)}
              </p>
            </div>
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-xl font-bold text-gray-900">
                {mockAnalytics.reduce((acc, item) => acc + item.downloads, 0)}
              </p>
            </div>
            <Download className="w-5 h-5 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Re-shares</p>
              <p className="text-xl font-bold text-gray-900">
                {mockAnalytics.reduce((acc, item) => acc + item.shares, 0)}
              </p>
            </div>
            <Users className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Shareable Exports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Shared Reports</h3>
        
        {sharedExports.length === 0 ? (
          <div className="text-center py-8">
            <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No shared reports yet</h4>
            <p className="text-gray-600 mb-4">Share your exported reports with secure links</p>
            <div className="space-y-2">
              {exportHistory.filter(e => !e.shareUrl).slice(0, 3).map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">
                    {exp.destination.type} export • {new Date(exp.exportedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleCreateShare(exp.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Share
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sharedExports.map((exp) => (
              <div key={exp.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {exp.destination.type.replace('-', ' ').toUpperCase()} Export
                    </h4>
                    <p className="text-sm text-gray-600">
                      Shared on {new Date(exp.exportedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Public
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-gray-700 bg-white px-2 py-1 rounded border">
                      {exp.shareUrl}
                    </code>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyLink(exp.shareUrl!)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShowQR(exp.shareUrl!)}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Show QR code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <p className="font-medium text-gray-900">23</p>
                    <p className="text-gray-600">Views</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">8</p>
                    <p className="text-gray-600">Downloads</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">3</p>
                    <p className="text-gray-600">Shares</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Share Analytics</h3>
        <div className="space-y-4">
          {mockAnalytics.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{item.export}</h4>
                  <p className="text-sm text-gray-600">Shared 2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-900">{item.views}</p>
                  <p className="text-gray-600">Views</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{item.downloads}</p>
                  <p className="text-gray-600">Downloads</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{item.shares}</p>
                  <p className="text-gray-600">Shares</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Share Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="public"
                checked={shareConfig.isPublic}
                onChange={(e) => setShareConfig({ ...shareConfig, isPublic: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="public" className="text-sm font-medium text-gray-900">
                Make publicly accessible
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="download"
                checked={shareConfig.allowDownload}
                onChange={(e) => setShareConfig({ ...shareConfig, allowDownload: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="download" className="text-sm font-medium text-gray-900">
                Allow downloads
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="comments"
                checked={shareConfig.allowComments}
                onChange={(e) => setShareConfig({ ...shareConfig, allowComments: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="comments" className="text-sm font-medium text-gray-900">
                Enable comments
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password protection (optional)
              </label>
              <input
                type="password"
                value={shareConfig.password}
                onChange={(e) => setShareConfig({ ...shareConfig, password: e.target.value })}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration date (optional)
              </label>
              <input
                type="date"
                value={shareConfig.expiresAt}
                onChange={(e) => setShareConfig({ ...shareConfig, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Gallery */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <QrCode className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-medium text-gray-900">QR Code Sharing</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Generate QR codes for easy mobile sharing. Perfect for presentations, meetings, or quick access.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <QrCode className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">Tax Report</p>
            <p className="text-xs text-gray-600">23 scans</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <QrCode className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">Monthly Summary</p>
            <p className="text-xs text-gray-600">15 scans</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg text-center border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer">
            <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">Generate New</p>
            <p className="text-xs text-gray-500">Create QR code</p>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { ExportHistory as ExportHistoryType } from '@/types/export';
import { 
  Download, 
  Share2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  RefreshCw,
  Filter,
  Calendar,
  FileText,
  QrCode
} from 'lucide-react';

interface ExportHistoryProps {
  exportHistory: ExportHistoryType[];
  onViewDetails: (historyItem: ExportHistoryType) => void;
}

export default function ExportHistory({ exportHistory, onViewDetails }: ExportHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'processing'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'size'>('date');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredHistory = exportHistory
    .filter(item => filter === 'all' || item.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.exportedAt).getTime() - new Date(a.exportedAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'size':
          return b.fileSize - a.fileSize;
        default:
          return 0;
      }
    });

  const generateQRCode = (url: string) => {
    // In a real app, this would generate an actual QR code
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    return qrCodeUrl;
  };

  const handleShare = async (item: ExportHistoryType) => {
    if (item.shareUrl) {
      try {
        await navigator.clipboard.writeText(item.shareUrl);
        // In a real app, show a toast notification
        alert('Share link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const handleDownload = (item: ExportHistoryType) => {
    if (item.downloadUrl) {
      // In a real app, this would trigger the actual download
      window.open(item.downloadUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Export History</h2>
          <p className="text-gray-600">Track and manage your data exports</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'failed' | 'processing')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Exports</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'size')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exports found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You haven't created any exports yet." 
              : `No exports with status "${filter}" found.`
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {filteredHistory.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(item.status)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {item.destination.type.replace('-', ' ').toUpperCase()} Export
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.exportedAt).toLocaleString()}</span>
                        </span>
                        <span>{item.recordCount} records</span>
                        <span>{(item.fileSize / 1024).toFixed(1)} KB</span>
                      </div>
                      
                      {item.errorMessage && (
                        <div className="flex items-center space-x-1 mt-2 text-sm text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{item.errorMessage}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.shareUrl && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleShare(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy share link"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            const qrCodeUrl = generateQRCode(item.shareUrl!);
                            window.open(qrCodeUrl, '_blank');
                          }}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Show QR code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {item.downloadUrl && item.status === 'completed' && (
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onViewDetails(item)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar for processing exports */}
                {item.status === 'processing' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Processing...</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                )}

                {/* Share details for public exports */}
                {item.shareUrl && item.status === 'completed' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <Share2 className="w-3 h-3" />
                      <span>Shared publicly</span>
                      <span className="text-blue-500">•</span>
                      <span>Available for download</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {exportHistory.filter(h => h.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {exportHistory.filter(h => h.status === 'processing').length}
          </p>
          <p className="text-sm text-gray-600">Processing</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(exportHistory.reduce((acc, h) => acc + h.fileSize, 0) / 1024)} KB
          </p>
          <p className="text-sm text-gray-600">Total Size</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {exportHistory.filter(h => h.shareUrl).length}
          </p>
          <p className="text-sm text-gray-600">Shared</p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { CloudConnection, CloudProvider } from '@/types/export';
import { 
  Cloud,
  CheckCircle,
  AlertCircle,
  Settings,
  Link,
  Unlink,
  RefreshCw,
  HardDrive,
  Mail,
  FileSpreadsheet,
  Droplets,
  Box,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

interface CloudConnectionsProps {
  connections: CloudConnection[];
  onUpdateConnections: (connections: CloudConnection[]) => void;
}

export default function CloudConnections({ connections, onUpdateConnections }: CloudConnectionsProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const availableServices = [
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Direct integration with Google Sheets for live data',
      icon: FileSpreadsheet,
      color: 'green',
      category: 'Productivity'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Sync files to your Dropbox account',
      icon: Droplets,
      color: 'blue',
      category: 'Cloud Storage'
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      description: 'Microsoft cloud storage integration',
      icon: Cloud,
      color: 'indigo',
      category: 'Cloud Storage'
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Store files in your Google Drive',
      icon: HardDrive,
      color: 'yellow',
      category: 'Cloud Storage'
    },
    {
      id: 'box',
      name: 'Box',
      description: 'Enterprise file sharing and storage',
      icon: Box,
      color: 'blue',
      category: 'Cloud Storage'
    },
    {
      id: 'email',
      name: 'Email Service',
      description: 'Send reports via email automatically',
      icon: Mail,
      color: 'red',
      category: 'Communication'
    }
  ];

  const handleConnect = async (serviceId: string) => {
    setIsConnecting(serviceId);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const service = availableServices.find(s => s.id === serviceId);
    if (service) {
      const newConnection: CloudConnection = {
        id: Date.now().toString(),
        provider: serviceId as CloudProvider | 'email' | 'google-sheets',
        displayName: service.name,
        isConnected: true,
        connectionStatus: 'connected',
        lastSync: new Date().toISOString(),
        accountInfo: {
          email: 'user@example.com',
          username: 'User Name',
          quotaUsed: Math.floor(Math.random() * 80),
          quotaTotal: 100
        },
        permissions: ['read', 'write'],
        connectedAt: new Date().toISOString()
      };
      
      const updatedConnections = [...connections, newConnection];
      onUpdateConnections(updatedConnections);
    }
    
    setIsConnecting(null);
  };

  const handleDisconnect = (connectionId: string) => {
    const updatedConnections = connections.filter(c => c.id !== connectionId);
    onUpdateConnections(updatedConnections);
  };

  const handleSync = async (connectionId: string) => {
    const connectionIndex = connections.findIndex(c => c.id === connectionId);
    if (connectionIndex === -1) return;

    const updatedConnections = [...connections];
    updatedConnections[connectionIndex].connectionStatus = 'syncing';
    onUpdateConnections(updatedConnections);

    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 1500));

    updatedConnections[connectionIndex].connectionStatus = 'connected';
    updatedConnections[connectionIndex].lastSync = new Date().toISOString();
    onUpdateConnections(updatedConnections);
  };

  const getConnectionForService = (serviceId: string) => {
    return connections.find(c => c.provider === serviceId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'syncing': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const groupedServices = availableServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof availableServices>);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Cloud Connections</h2>
            <p className="text-purple-100">Connect your favorite services for seamless data export</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <Globe className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Connection Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected Services</p>
              <p className="text-xl font-bold text-gray-900">
                {connections.filter(c => c.isConnected).length}
              </p>
            </div>
            <Link className="w-5 h-5 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Sync</p>
              <p className="text-xl font-bold text-gray-900">
                {connections.length > 0 ? 'Just now' : 'Never'}
              </p>
            </div>
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-xl font-bold text-gray-900">
                {connections.reduce((acc, c) => acc + (c.accountInfo?.quotaUsed || 0), 0)} MB
              </p>
            </div>
            <HardDrive className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Connected Services */}
      {connections.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Connections</h3>
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-blue-100`}>
                    <Cloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{connection.displayName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.connectionStatus)}`}>
                        {connection.connectionStatus}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {connection.accountInfo?.email && (
                        <span>{connection.accountInfo.email}</span>
                      )}
                      {connection.lastSync && (
                        <span>Last sync: {new Date(connection.lastSync).toLocaleString()}</span>
                      )}
                    </div>
                    {connection.accountInfo?.quotaUsed !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Storage</span>
                          <span>{connection.accountInfo.quotaUsed}% used</span>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${connection.accountInfo.quotaUsed}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSync(connection.id)}
                    disabled={connection.connectionStatus === 'syncing'}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                    title="Sync now"
                  >
                    <RefreshCw className={`w-4 h-4 ${connection.connectionStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => handleDisconnect(connection.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Disconnect"
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Services */}
      {Object.entries(groupedServices).map(([category, services]) => (
        <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              const connection = getConnectionForService(service.id);
              const isConnected = !!connection;
              const isConnectingThis = isConnecting === service.id;

              return (
                <div
                  key={service.id}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isConnected 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-${service.color}-100`}>
                      <Icon className={`w-6 h-6 text-${service.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        {isConnected && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      
                      <div className="mt-4">
                        {isConnected ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-green-600 font-medium">Connected</span>
                            <button
                              onClick={() => handleDisconnect(connection.id)}
                              className="text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                              Disconnect
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleConnect(service.id)}
                            disabled={isConnectingThis}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                              isConnectingThis
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isConnectingThis ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Connecting...</span>
                              </>
                            ) : (
                              <>
                                <Link className="w-4 h-4" />
                                <span>Connect</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Security Notice */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex">
          <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
          <div className="ml-4">
            <h4 className="text-sm font-medium text-blue-900">Security & Privacy</h4>
            <p className="text-sm text-blue-700 mt-1">
              All connections use OAuth 2.0 authentication and are encrypted. We only request the minimum permissions needed for data export functionality. You can revoke access at any time.
            </p>
            <div className="mt-3 flex items-center space-x-4 text-xs text-blue-600">
              <span>🔒 End-to-end encryption</span>
              <span>🛡️ GDPR compliant</span>
              <span>🔑 Revocable access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
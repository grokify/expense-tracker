export interface CloudExportConfig {
  id: string;
  name: string;
  templateType: ExportTemplate;
  schedulePeriod?: SchedulePeriod;
  isRecurring: boolean;
  createdAt: string;
  lastExecuted?: string;
  status: ExportStatus;
  destination: ExportDestination;
  shareSettings: ShareSettings;
}

export interface ExportHistory {
  id: string;
  configId: string;
  exportedAt: string;
  status: ExportStatus;
  destination: ExportDestination;
  fileSize: number;
  downloadUrl?: string;
  shareUrl?: string;
  recordCount: number;
  errorMessage?: string;
}

export interface ExportDestination {
  type: DestinationType;
  config: DestinationConfig;
  syncStatus: SyncStatus;
}

export interface DestinationConfig {
  email?: EmailConfig;
  googleSheets?: GoogleSheetsConfig;
  cloudStorage?: CloudStorageConfig;
  webhook?: WebhookConfig;
}

export interface EmailConfig {
  recipients: string[];
  subject: string;
  message: string;
  format: ExportFormat;
}

export interface GoogleSheetsConfig {
  spreadsheetId?: string;
  spreadsheetName: string;
  sheetName: string;
  overwriteData: boolean;
}

export interface CloudStorageConfig {
  provider: CloudProvider;
  folderPath: string;
  fileName: string;
  autoSync: boolean;
}

export interface WebhookConfig {
  url: string;
  method: 'POST' | 'PUT';
  headers: Record<string, string>;
  authentication?: 'bearer' | 'basic' | 'api-key';
}

export interface ShareSettings {
  isPublic: boolean;
  expiresAt?: string;
  password?: string;
  allowDownload: boolean;
  allowComments: boolean;
  analytics: boolean;
}

export interface QRCodeData {
  url: string;
  type: 'share' | 'download';
  expiresAt?: string;
}

export type ExportTemplate = 
  | 'tax-report'
  | 'monthly-summary'
  | 'category-analysis'
  | 'quarterly-review'
  | 'annual-report'
  | 'expense-receipts'
  | 'budget-comparison'
  | 'custom';

export type ExportFormat = 
  | 'csv'
  | 'excel'
  | 'pdf'
  | 'json'
  | 'google-sheets'
  | 'quickbooks';

export type DestinationType = 
  | 'email'
  | 'google-sheets'
  | 'dropbox'
  | 'onedrive'
  | 'google-drive'
  | 'aws-s3'
  | 'webhook'
  | 'sharepoint';

export type CloudProvider = 
  | 'dropbox'
  | 'onedrive'
  | 'google-drive'
  | 'aws-s3'
  | 'box'
  | 'sharepoint';

export type SchedulePeriod = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export type ExportStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'scheduled';

export type SyncStatus = 
  | 'connected'
  | 'disconnected'
  | 'syncing'
  | 'error'
  | 'pending-auth';

export interface ExportAnalytics {
  totalExports: number;
  totalDownloads: number;
  totalShares: number;
  popularFormats: Record<ExportFormat, number>;
  popularDestinations: Record<DestinationType, number>;
  recentActivity: ExportActivity[];
}

export interface ExportActivity {
  id: string;
  type: 'export' | 'download' | 'share' | 'view';
  timestamp: string;
  details: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface CloudConnection {
  id: string;
  provider: CloudProvider | 'email' | 'google-sheets';
  displayName: string;
  isConnected: boolean;
  connectionStatus: SyncStatus;
  lastSync?: string;
  accountInfo?: {
    email?: string;
    username?: string;
    quotaUsed?: number;
    quotaTotal?: number;
  };
  permissions: string[];
  connectedAt: string;
}

export interface ExportProgress {
  configId: string;
  status: ExportStatus;
  progress: number;
  currentStep: string;
  estimatedTimeRemaining?: number;
  message?: string;
}
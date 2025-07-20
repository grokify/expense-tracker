'use client';

import { CloudExportConfig } from '@/types/export';
import { Calendar, Clock, PlayCircle, PauseCircle, Settings } from 'lucide-react';

interface ScheduledExportsProps {
  configs: CloudExportConfig[];
  onUpdateConfigs: (configs: CloudExportConfig[]) => void;
}

export default function ScheduledExports({ configs, onUpdateConfigs }: ScheduledExportsProps) {
  const scheduledConfigs = configs.filter(c => c.isRecurring);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Scheduled Exports</h2>
            <p className="text-indigo-100">Automate your data exports with recurring schedules</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Schedules</h3>
        {scheduledConfigs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No scheduled exports configured</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledConfigs.map((config) => (
              <div key={config.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{config.name}</h4>
                    <p className="text-sm text-gray-600">
                      Runs {config.schedulePeriod} • Next: Tomorrow at 9:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                    <PlayCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
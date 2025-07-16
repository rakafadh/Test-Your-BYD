import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Trash2, Save, Calendar } from 'lucide-react';
import { useTestDrive } from '../context/TestDriveContext';

export default function Settings() {
  const { autoDeleteOldRecords, showSuccess, showError, isOnline } = useTestDrive();
  const [autoDeleteDays, setAutoDeleteDays] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('testdrive_autodelete_days');
    if (saved) {
      setAutoDeleteDays(saved);
    }
  }, []);

  // Save settings
  const handleSaveSettings = () => {
    if (autoDeleteDays === '') {
      localStorage.removeItem('testdrive_autodelete_days');
      showSuccess('Auto-delete disabled');
    } else {
      localStorage.setItem('testdrive_autodelete_days', autoDeleteDays);
      showSuccess(`Auto-delete set to ${autoDeleteDays} days`);
    }
  };

  // Manual cleanup
  const handleManualCleanup = async () => {
    if (!autoDeleteDays || !isOnline) return;
    
    setIsProcessing(true);
    try {
      const result = await autoDeleteOldRecords(parseInt(autoDeleteDays));
      if (result?.success) {
        showSuccess(`Successfully cleaned up old records (older than ${autoDeleteDays} days)`);
      }
    } catch (err) {
      showError('Failed to cleanup old records: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-delete options
  const deleteOptions = [
    { value: '', label: 'Never delete automatically' },
    { value: '7', label: '1 Week (7 days)' },
    { value: '30', label: '1 Month (30 days)' },
    { value: '60', label: '2 Months (60 days)' },
    { value: '90', label: '3 Months (90 days)' },
    { value: '180', label: '6 Months (180 days)' },
    { value: '365', label: '1 Year (365 days)' }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h2>
        </div>

        {/* Auto Delete Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Auto Delete Old Records
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Automatically delete test drive records older than the specified time period.
              This helps keep your database clean and manage storage space.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delete records older than:
                </label>
                <select
                  value={autoDeleteDays}
                  onChange={(e) => setAutoDeleteDays(e.target.value)}
                  className="input"
                >
                  {deleteOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="btn btn-primary flex-1 sm:flex-none"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </button>

                {autoDeleteDays && (
                  <button
                    onClick={handleManualCleanup}
                    className="btn bg-orange-600 hover:bg-orange-700 text-white flex-1 sm:flex-none"
                    disabled={isProcessing || !isOnline}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Cleanup Now
                      </>
                    )}
                  </button>
                )}
              </div>

              {!isOnline && (
                <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                  ⚠️ Auto-delete and manual cleanup require internet connection
                </div>
              )}
            </div>
          </div>

          {/* Current Settings Display */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">Current Settings</h4>
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Auto-delete:</span>
                <span className="font-medium">
                  {autoDeleteDays ? 
                    `Records older than ${autoDeleteDays} days will be deleted` : 
                    'Disabled'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-red-500 mt-0.5">⚠️</div>
              <div>
                <h4 className="text-red-800 font-medium">Important Warning</h4>
                <p className="text-red-700 text-sm mt-1">
                  Deleted records cannot be recovered. Make sure to export important data 
                  before enabling auto-delete or running manual cleanup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

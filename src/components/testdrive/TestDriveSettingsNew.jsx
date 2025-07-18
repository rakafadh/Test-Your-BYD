import React, { useState, useEffect } from 'react';
import { useTestDrive } from '../../context/TestDriveContext';
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import DeleteModal from '../DeleteModal';

export default function TestDriveSettings() {
  const { 
    testDrives, 
    deleteOldRecords, 
    showToast, 
    isOffline,
    settings,
    updateSettings
  } = useTestDrive();
  
  const [autoDeleteDays, setAutoDeleteDays] = useState(settings.autoDeleteDays || 30);
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(settings.enableAutoDelete || false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sync with settings from context
  useEffect(() => {
    setAutoDeleteDays(settings.autoDeleteDays || 30);
    setAutoDeleteEnabled(settings.enableAutoDelete || false);
  }, [settings]);

  // Save settings when changed
  const handleSettingsChange = (key, value) => {
    if (key === 'autoDeleteDays') {
      setAutoDeleteDays(value);
    } else if (key === 'enableAutoDelete') {
      setAutoDeleteEnabled(value);
    }
    
    updateSettings({
      [key]: value
    });
  };

  const handleAutoDelete = async () => {
    setDeleting(true);
    try {
      await deleteOldRecords(autoDeleteDays);
      showToast(`Records older than ${autoDeleteDays} days have been deleted`, 'success');
      setShowDeleteModal(false);
    } catch (err) {
      showToast('Failed to auto-delete records: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const getOldRecordsCount = () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - autoDeleteDays);
    return testDrives.filter(record => 
      new Date(record.created_at) < cutoffDate
    ).length;
  };

  const oldRecordsCount = getOldRecordsCount();

  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        {isOffline && (
          <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
            Offline - Settings require internet connection
          </div>
        )}
      </div>

      {/* Auto Delete Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Auto Delete Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoDeleteEnabled"
              checked={autoDeleteEnabled}
              onChange={(e) => handleSettingsChange('enableAutoDelete', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="autoDeleteEnabled" className="text-sm font-medium text-gray-700">
              Enable automatic deletion of old records
            </label>
          </div>

          <p className="text-gray-600">
            {autoDeleteEnabled 
              ? "Automatically delete test drive records older than specified number of days to save storage space."
              : "Auto delete is disabled. Records will be kept indefinitely unless manually deleted."
            }
          </p>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Delete records older than:
            </label>
            <select
              value={autoDeleteDays}
              onChange={(e) => handleSettingsChange('autoDeleteDays', Number(e.target.value))}
              disabled={!autoDeleteEnabled}
              className={`input w-32 ${!autoDeleteEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
            </select>
          </div>

          {autoDeleteEnabled && (
            <>
              {oldRecordsCount > 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Records Found</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    {oldRecordsCount} test drive records are older than {autoDeleteDays} days and can be deleted.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">No Old Records</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    No test drive records older than {autoDeleteDays} days found.
                  </p>
                </div>
              )}
            </>
          )}

          {!autoDeleteEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Auto Delete Disabled</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Records will be kept indefinitely. You can manually delete records if needed.
              </p>
            </div>
          )}

          {autoDeleteEnabled && (
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isOffline || oldRecordsCount === 0}
              className="btn bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Old Records ({oldRecordsCount})
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleAutoDelete}
        loading={deleting}
        title="Auto Delete Old Records"
        message={`Are you sure you want to delete ${oldRecordsCount} test drive records older than ${autoDeleteDays} days? This action cannot be undone.`}
      />
    </div>
  );
}

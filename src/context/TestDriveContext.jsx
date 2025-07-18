import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useToast, ToastContainer } from '../components/Toast';

const TestDriveContext = createContext();

export function useTestDrive() {
  return useContext(TestDriveContext);
}

export function TestDriveProvider({ children }) {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [settings, setSettings] = useState({
    autoDeleteEnabled: false,
    autoDeleteDays: 30,
    notifications: true
  });
  const { toasts, addToast, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();

  // Network status tracking
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch data from Supabase
  const fetchTestDrives = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('test_drives')
        .select('*')
        .order('date_time', { ascending: false });
      
      if (error) throw error;
      setTestDrives(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Sync offline queue when online
  useEffect(() => {
    if (isOnline) {
      // Load offline queue from localStorage
      const storedQueue = localStorage.getItem('testdrive_offline');
      if (storedQueue) {
        try {
          const queue = JSON.parse(storedQueue);
          if (Array.isArray(queue) && queue.length > 0) {
            setOfflineQueue(queue);
            syncOfflineData(queue);
          }
        } catch (e) {
          console.error('Failed to parse offline queue:', e);
          localStorage.removeItem('testdrive_offline');
        }
      }
    }
  }, [isOnline]);

  // Sync offline data to server
  const syncOfflineData = async (queue) => {
    if (!queue || queue.length === 0) return;

    try {
      const syncPromises = queue.map(async (payload) => {
        try {
          const { error } = await supabase.from('test_drives').insert([payload]);
          if (error) throw error;
          return { success: true, payload };
        } catch (e) {
          console.error('Sync error for payload:', payload, e);
          return { success: false, payload, error: e.message };
        }
      });

      const results = await Promise.all(syncPromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        // Clear synced items from queue
        setOfflineQueue([]);
        localStorage.removeItem('testdrive_offline');
        
        // Refresh data
        await fetchTestDrives();
          // Show success message
        if (failed.length === 0) {
          showSuccess(`Successfully synced ${successful.length} offline records!`);
        } else {
          showWarning(`Synced ${successful.length} records. ${failed.length} failed to sync.`);
        }
      }

      if (failed.length > 0) {
        // Keep failed items in queue
        const failedPayloads = failed.map(f => f.payload);
        setOfflineQueue(failedPayloads);
        localStorage.setItem('testdrive_offline', JSON.stringify(failedPayloads));
      }
    } catch (err) {
      console.error('Sync process error:', err);
    }
  };

  // Add new test drive
  const addTestDrive = async (payload) => {
    if (isOnline) {
      try {
        const { error } = await supabase.from('test_drives').insert([payload]);
        if (error) throw error;
        await fetchTestDrives();
        return { success: true };
      } catch (err) {
        throw new Error(err.message || 'Failed to save data');
      }
    } else {
      // Save to offline queue
      const newQueue = [...offlineQueue, payload];
      setOfflineQueue(newQueue);
      localStorage.setItem('testdrive_offline', JSON.stringify(newQueue));
      return { success: true, offline: true };
    }
  };

  // Delete test drive
  const deleteTestDrive = async (id) => {
    if (isOnline) {
      try {
        const { error } = await supabase.from('test_drives').delete().eq('id', id);
        if (error) throw error;
        await fetchTestDrives();
        return { success: true };
      } catch (err) {
        throw new Error(err.message || 'Failed to delete record');
      }
    } else {
      throw new Error('Cannot delete records while offline');
    }
  };

  // Delete multiple test drives
  const deleteMultipleTestDrives = async (ids) => {
    if (isOnline) {
      try {
        const { error } = await supabase.from('test_drives').delete().in('id', ids);
        if (error) throw error;
        await fetchTestDrives();
        return { success: true, count: ids.length };
      } catch (err) {
        throw new Error(err.message || 'Failed to delete records');
      }
    } else {
      throw new Error('Cannot delete records while offline');
    }
  };

  // Auto delete old records based on settings
  const autoDeleteOldRecords = async (daysToKeep) => {
    if (!isOnline || !daysToKeep) return;
    
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const { error } = await supabase
        .from('test_drives')
        .delete()
        .lt('date_time', cutoffDate.toISOString());
      
      if (error) throw error;
      await fetchTestDrives();
      return { success: true };
    } catch (err) {
      console.error('Auto delete failed:', err);
    }
  };

  useEffect(() => {
    fetchTestDrives();
  }, []);

  // Auto-delete functionality - runs on app startup
  useEffect(() => {
    const checkAutoDelete = async () => {
      const autoDeleteDays = localStorage.getItem('testdrive_autodelete_days');
      if (autoDeleteDays && isOnline && testDrives.length > 0) {
        try {
          await autoDeleteOldRecords(parseInt(autoDeleteDays));
        } catch (err) {
          console.warn('Auto-delete failed:', err);
        }
      }
    };

    // Run auto-delete check on startup and when coming online
    if (isOnline) {
      setTimeout(checkAutoDelete, 5000); // Delay to ensure data is loaded
    }
  }, [isOnline, testDrives.length]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('testDriveSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    // Save to localStorage for persistence
    localStorage.setItem('testDriveSettings', JSON.stringify({
      ...settings,
      ...newSettings
    }));
  };

  const value = {
    testDrives,
    loading,
    error,
    offlineQueue,
    isOnline,
    settings,
    fetchTestDrives,
    addTestDrive,
    setOfflineQueue,
    updateSettings,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    deleteTestDrive,
    deleteMultipleTestDrives,
    autoDeleteOldRecords
  };

  return (
    <TestDriveContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </TestDriveContext.Provider>
  );
}

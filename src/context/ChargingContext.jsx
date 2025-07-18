import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useToast, ToastContainer } from '../components/Toast';

const ChargingContext = createContext();

export const useCharging = () => {
  const context = useContext(ChargingContext);
  if (!context) {
    throw new Error('useCharging must be used within a ChargingProvider');
  }
  return context;
};

export const ChargingProvider = ({ children }) => {
  const [chargingRecords, setChargingRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [settings, setSettings] = useState({
    autoDeleteEnabled: false,
    autoDeleteDays: 30,
    notifications: true
  });
  const { toasts, addToast, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();

  // Online/offline detection
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

  // Fetch charging records
  const fetchChargingRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('charging_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChargingRecords(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch charging records');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchChargingRecords();
  }, []);

  // Sync offline queue when online
  useEffect(() => {
    if (isOnline) {
      const storedQueue = localStorage.getItem('charging_offline');
      if (storedQueue) {
        try {
          const queue = JSON.parse(storedQueue);
          if (Array.isArray(queue) && queue.length > 0) {
            setOfflineQueue(queue);
            syncOfflineData(queue);
          }
        } catch (e) {
          console.error('Failed to parse offline queue:', e);
          localStorage.removeItem('charging_offline');
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
          const { error } = await supabase.from('charging_records').insert([payload]);
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
        setOfflineQueue([]);
        localStorage.removeItem('charging_offline');
        await fetchChargingRecords();
        showSuccess(`${successful.length} charging records synced successfully`);
      }

      if (failed.length > 0) {
        showError(`${failed.length} charging records failed to sync`);
      }
    } catch (err) {
      console.error('Sync process error:', err);
    }
  };

  // Add new charging record
  const addChargingRecord = async (payload) => {
    if (isOnline) {
      try {
        const { error } = await supabase.from('charging_records').insert([payload]);
        if (error) throw error;
        await fetchChargingRecords();
        return { success: true };
      } catch (err) {
        throw new Error(err.message || 'Failed to save charging record');
      }
    } else {
      // Save to offline queue
      const newQueue = [...offlineQueue, payload];
      setOfflineQueue(newQueue);
      localStorage.setItem('charging_offline', JSON.stringify(newQueue));
      return { success: true, offline: true };
    }
  };

  // Delete charging record
  const deleteChargingRecord = async (id) => {
    if (isOnline) {
      try {
        const { error } = await supabase.from('charging_records').delete().eq('id', id);
        if (error) throw error;
        await fetchChargingRecords();
        return { success: true };
      } catch (err) {
        throw new Error(err.message || 'Failed to delete charging record');
      }
    } else {
      throw new Error('Cannot delete records while offline');
    }
  };

  // Delete multiple charging records
  const deleteMultipleChargingRecords = async (ids) => {
    if (isOnline) {
      try {
        const { error } = await supabase.from('charging_records').delete().in('id', ids);
        if (error) throw error;
        await fetchChargingRecords();
        return { success: true };
      } catch (err) {
        throw new Error(err.message || 'Failed to delete charging records');
      }
    } else {
      throw new Error('Cannot delete records while offline');
    }
  };

  // Auto-delete old records
  const autoDeleteOldRecords = async (days) => {
    if (isOnline) {
      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const { error } = await supabase
          .from('charging_records')
          .delete()
          .lt('created_at', cutoffDate.toISOString());

        if (error) throw error;
        await fetchChargingRecords();
        return { success: true };
      } catch (err) {
        throw new Error(err.message || 'Failed to auto-delete old records');
      }
    } else {
      throw new Error('Cannot delete records while offline');
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    // Save to localStorage for persistence
    localStorage.setItem('chargingSettings', JSON.stringify({
      ...settings,
      ...newSettings
    }));
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chargingSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const value = {
    chargingRecords,
    loading,
    error,
    isOnline,
    offlineQueue,
    settings,
    fetchChargingRecords,
    addChargingRecord,
    deleteChargingRecord,
    deleteMultipleChargingRecords,
    autoDeleteOldRecords,
    updateSettings,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ChargingContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ChargingContext.Provider>
  );
};

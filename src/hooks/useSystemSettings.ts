import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase";

export interface SystemSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowRegistration: boolean;
  emailVerification: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  autoLogoutEnabled: boolean;
  dataRetentionDays: number;
  enableAuditLogs: boolean;
  systemVersion: string;
  lastBackupDate: any;
  createdAt?: any;
  updatedAt?: any;
  lastUpdatedBy?: string;
  lastBackupBy?: string;
}

export interface UseSystemSettingsReturn {
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export function useSystemSettings(): UseSystemSettingsReturn {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for system settings
  useEffect(() => {
    const settingsRef = doc(db, "system", "settings");

    const unsubscribe = onSnapshot(
      settingsRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setSettings(docSnapshot.data() as SystemSettings);
        } else {
          // Settings document doesn't exist yet, call backend to create default
          fetchDefaultSettings();
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error listening to system settings:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchDefaultSettings = async () => {
    try {
      const getSystemSettingsFn = httpsCallable(functions, "getSystemSettings");
      const result = await getSystemSettingsFn();
      const data = result.data as any;

      if (data.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch (err: any) {
      console.error("Error fetching default settings:", err);
      setError(err.message);
    }
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      setLoading(true);
      setError(null);

      const updateSystemSettingsFn = httpsCallable(functions, "updateSystemSettings");
      const result = await updateSystemSettingsFn({ settings: newSettings });
      const data = result.data as any;

      if (!data.ok) {
        throw new Error(data.message || "Failed to update settings");
      }

      // Settings will be automatically updated via the real-time listener
    } catch (err: any) {
      console.error("Error updating system settings:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const getSystemSettingsFn = httpsCallable(functions, "getSystemSettings");
      const result = await getSystemSettingsFn();
      const data = result.data as any;

      if (data.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch (err: any) {
      console.error("Error refreshing settings:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings,
  };
}

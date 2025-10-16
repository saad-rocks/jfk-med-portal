// Test utility for System Settings Functions
// Run this in browser console to test each function

import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export const testSystemFunctions = {
  // Test 1: Get System Settings (should work for any authenticated user)
  async testGetSettings() {
    try {
      const fn = httpsCallable(functions, "getSystemSettings");
      const result = await fn();
      return result.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Test 2: Update System Settings (admin only)
  async testUpdateSettings(settings: any) {
    try {
      const fn = httpsCallable(functions, "updateSystemSettings");
      const result = await fn({ settings });
      return result.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Test 3: Get Audit Logs (admin only)
  async testGetAuditLogs() {
    try {
      const fn = httpsCallable(functions, "getAuditLogs");
      const result = await fn({ limit: 10 });
      return result.data;
    } catch (error: any) {

      // Check if it's an index error
      if (error.message?.includes("index") || error.message?.includes("Index")) {
      }
      throw error;
    }
  },

  // Test 4: Get Active Sessions (admin only)
  async testGetActiveSessions() {
    try {
      const fn = httpsCallable(functions, "getActiveSessions");
      const result = await fn();
      return result.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Test 5: Trigger Database Backup (admin only)
  async testTriggerBackup() {
    try {
      const fn = httpsCallable(functions, "triggerDatabaseBackup");
      const result = await fn();
      return result.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Test 6: Force Logout User (admin only)
  async testForceLogout(uid: string) {
    try {
      const fn = httpsCallable(functions, "forceLogoutUser");
      const result = await fn({ uid });
      return result.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Run all tests in sequence
  async runAllTests() {

    const results = {
      getSettings: false,
      updateSettings: false,
      getAuditLogs: false,
      getActiveSessions: false,
      triggerBackup: false,
    };

    // Test 1: Get Settings
    try {
      await this.testGetSettings();
      results.getSettings = true;
    } catch (error) {
    }


    // Test 2: Update Settings
    try {
      await this.testUpdateSettings({
        maintenanceMode: false,
        maintenanceMessage: "Test from automated test suite"
      });
      results.updateSettings = true;
    } catch (error) {
    }


    // Test 3: Get Audit Logs
    try {
      await this.testGetAuditLogs();
      results.getAuditLogs = true;
    } catch (error) {
    }


    // Test 4: Get Active Sessions
    try {
      await this.testGetActiveSessions();
      results.getActiveSessions = true;
    } catch (error) {
    }


    // Test 5: Trigger Backup
    try {
      await this.testTriggerBackup();
      results.triggerBackup = true;
    } catch (error) {
    }


    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;

    return results;
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testSystemFunctions = testSystemFunctions;
}

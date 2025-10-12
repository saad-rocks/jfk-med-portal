// Test utility for System Settings Functions
// Run this in browser console to test each function

import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export const testSystemFunctions = {
  // Test 1: Get System Settings (should work for any authenticated user)
  async testGetSettings() {
    console.log("🧪 Testing getSystemSettings...");
    try {
      const fn = httpsCallable(functions, "getSystemSettings");
      const result = await fn();
      console.log("✅ getSystemSettings SUCCESS:", result.data);
      return result.data;
    } catch (error: any) {
      console.error("❌ getSystemSettings FAILED:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      throw error;
    }
  },

  // Test 2: Update System Settings (admin only)
  async testUpdateSettings(settings: any) {
    console.log("🧪 Testing updateSystemSettings...");
    console.log("Settings to update:", settings);
    try {
      const fn = httpsCallable(functions, "updateSystemSettings");
      const result = await fn({ settings });
      console.log("✅ updateSystemSettings SUCCESS:", result.data);
      return result.data;
    } catch (error: any) {
      console.error("❌ updateSystemSettings FAILED:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      throw error;
    }
  },

  // Test 3: Get Audit Logs (admin only)
  async testGetAuditLogs() {
    console.log("🧪 Testing getAuditLogs...");
    try {
      const fn = httpsCallable(functions, "getAuditLogs");
      const result = await fn({ limit: 10 });
      console.log("✅ getAuditLogs SUCCESS:", result.data);
      return result.data;
    } catch (error: any) {
      console.error("❌ getAuditLogs FAILED:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);

      // Check if it's an index error
      if (error.message?.includes("index") || error.message?.includes("Index")) {
        console.error("⚠️  SOLUTION: You need to create a Firestore index!");
        console.error("The error message should contain a link to create the index.");
        console.error("Click the link or go to Firebase Console > Firestore > Indexes");
      }
      throw error;
    }
  },

  // Test 4: Get Active Sessions (admin only)
  async testGetActiveSessions() {
    console.log("🧪 Testing getActiveSessions...");
    try {
      const fn = httpsCallable(functions, "getActiveSessions");
      const result = await fn();
      console.log("✅ getActiveSessions SUCCESS:", result.data);
      return result.data;
    } catch (error: any) {
      console.error("❌ getActiveSessions FAILED:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      throw error;
    }
  },

  // Test 5: Trigger Database Backup (admin only)
  async testTriggerBackup() {
    console.log("🧪 Testing triggerDatabaseBackup...");
    try {
      const fn = httpsCallable(functions, "triggerDatabaseBackup");
      const result = await fn();
      console.log("✅ triggerDatabaseBackup SUCCESS:", result.data);
      return result.data;
    } catch (error: any) {
      console.error("❌ triggerDatabaseBackup FAILED:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      throw error;
    }
  },

  // Test 6: Force Logout User (admin only)
  async testForceLogout(uid: string) {
    console.log("🧪 Testing forceLogoutUser...");
    console.log("Target UID:", uid);
    try {
      const fn = httpsCallable(functions, "forceLogoutUser");
      const result = await fn({ uid });
      console.log("✅ forceLogoutUser SUCCESS:", result.data);
      return result.data;
    } catch (error: any) {
      console.error("❌ forceLogoutUser FAILED:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      throw error;
    }
  },

  // Run all tests in sequence
  async runAllTests() {
    console.log("🚀 Running all system function tests...");
    console.log("=".repeat(50));

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
      console.log("Test 1 failed, continuing...");
    }

    console.log("=".repeat(50));

    // Test 2: Update Settings
    try {
      await this.testUpdateSettings({
        maintenanceMode: false,
        maintenanceMessage: "Test from automated test suite"
      });
      results.updateSettings = true;
    } catch (error) {
      console.log("Test 2 failed, continuing...");
    }

    console.log("=".repeat(50));

    // Test 3: Get Audit Logs
    try {
      await this.testGetAuditLogs();
      results.getAuditLogs = true;
    } catch (error) {
      console.log("Test 3 failed, continuing...");
    }

    console.log("=".repeat(50));

    // Test 4: Get Active Sessions
    try {
      await this.testGetActiveSessions();
      results.getActiveSessions = true;
    } catch (error) {
      console.log("Test 4 failed, continuing...");
    }

    console.log("=".repeat(50));

    // Test 5: Trigger Backup
    try {
      await this.testTriggerBackup();
      results.triggerBackup = true;
    } catch (error) {
      console.log("Test 5 failed, continuing...");
    }

    console.log("=".repeat(50));
    console.log("📊 TEST RESULTS:");
    console.log(results);
    console.log("=".repeat(50));

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);

    return results;
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testSystemFunctions = testSystemFunctions;
  console.log("💡 Test functions loaded! Use window.testSystemFunctions in console");
  console.log("Example: window.testSystemFunctions.runAllTests()");
}
